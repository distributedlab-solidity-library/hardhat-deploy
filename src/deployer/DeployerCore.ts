import { ContractDeployTransaction, Overrides, Signer, TransactionResponse, toBigInt } from "ethers";

import { HardhatRuntimeEnvironment } from "hardhat/types";

import { Linker } from "./Linker";

import { catchError, getChainId, getSignerHelper } from "../utils";

import { MigrateError } from "../errors";

import {
  Args,
  ContractDeployParams,
  ContractDeployTransactionWithContractName,
  OverridesAndLibs,
} from "../types/deployer";
import { MigrateConfig, VerifyStrategy } from "../types/migrations";

import { Reporter } from "../tools/reporter/Reporter";
import { ArtifactProcessor } from "../tools/storage/ArtifactProcessor";
import { TransactionProcessor } from "../tools/storage/TransactionProcessor";
import { Verifier } from "../verifier/Verifier";

@catchError
export class DeployerCore {
  private _config: MigrateConfig;

  constructor(private _hre: HardhatRuntimeEnvironment) {
    this._config = _hre.config.migrate;
  }

  public async deploy(deployParams: ContractDeployParams, args: Args, parameters: OverridesAndLibs): Promise<string> {
    const contractName = ArtifactProcessor.getContractName(deployParams.bytecode);

    deployParams.bytecode = await Linker.linkBytecode(deployParams.bytecode, parameters.libraries || {});

    const tx: ContractDeployTransactionWithContractName = {
      ...(await this._createDeployTransaction(deployParams, args, parameters)),
      contractName: contractName,
    };

    let contractAddress: string;
    if (this._config.continuePreviousDeployment) {
      contractAddress = await this._tryRecoverContractAddress(tx, args);
    } else {
      contractAddress = await this._processContractDeploymentTransaction(tx, args);
    }

    return contractAddress;
  }

  private async _createDeployTransaction(
    contractParams: ContractDeployParams,
    args: Args,
    txOverrides: Overrides,
  ): Promise<ContractDeployTransaction> {
    const factory = new this._hre.ethers.ContractFactory(contractParams.abi, contractParams.bytecode);

    const chainId = await getChainId(this._hre);
    const from = (await getSignerHelper(this._hre, txOverrides.from)).address;

    const tx: ContractDeployTransaction = {
      chainId: toBigInt(chainId),
      from,
      ...(await factory.getDeployTransaction(...args, txOverrides)),
    };

    return tx;
  }

  private async _tryRecoverContractAddress(tx: ContractDeployTransactionWithContractName, args: Args): Promise<string> {
    try {
      const contractAddress = TransactionProcessor.tryRestoreSavedContractAddress(tx);

      Reporter.notifyContractRecovery(tx.contractName, contractAddress);

      return contractAddress;
    } catch (e) {
      Reporter.notifyDeploymentInsteadOfRecovery(tx.contractName);

      return this._processContractDeploymentTransaction(tx, args);
    }
  }

  private async _processContractDeploymentTransaction(
    tx: ContractDeployTransactionWithContractName,
    args: Args,
  ): Promise<string> {
    const signer: Signer = await getSignerHelper(this._hre, tx.from);

    const txResponse = await signer.sendTransaction(tx);

    const [[contractAddress, blockNumber]] = await Promise.all([
      this._waitForDeployment(txResponse),
      Reporter.reportTransaction(txResponse, tx.contractName),
    ]);

    TransactionProcessor.saveDeploymentTransaction(tx, tx.contractName, contractAddress);

    switch (this._config.verify) {
      case VerifyStrategy.AtTheEnd: {
        TransactionProcessor.saveVerificationFunction({
          contractAddress,
          contractName: tx.contractName,
          constructorArguments: args,
          blockNumber,
        });
        break;
      }
      case VerifyStrategy.Immediately: {
        await new Verifier(this._hre).verify({
          contractAddress,
          contractName: tx.contractName,
          constructorArguments: args,
        });
        break;
      }
      case VerifyStrategy.None: {
        break;
      }
    }

    return contractAddress;
  }

  private async _waitForDeployment(tx: TransactionResponse): Promise<[string, number]> {
    // this._config.confirmations -- is used only for verification process.
    // TODO: Create other parameter to pass to tx.wait(). Default must be 1
    const receipt = await tx.wait(this._config.verify === VerifyStrategy.Immediately ? this._config.confirmations : 1);

    if (receipt) {
      return [receipt.contractAddress!, receipt.blockNumber];
    }

    throw new MigrateError("Contract deployment failed.");
  }
}
