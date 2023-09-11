import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { AddressLike, Overrides, Signer, TransactionRequest, TransactionResponse } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { catchError } from "../utils";

import { MigrateError } from "../errors";

import { Args, ContractDeployParams } from "../types/deployer";
import { MigrateConfig } from "../types/migrations";

@catchError
export class DeployerCore {
  private _config: MigrateConfig;

  constructor(private _hre: HardhatRuntimeEnvironment) {
    this._config = _hre.config.migrate;
  }

  public async deploy(deployParams: ContractDeployParams, args: Args, txOverrides: Overrides = {}): Promise<string> {
    const tx = await this._deploy(deployParams, args, txOverrides);

    const [, contractAddress] = await Promise.all([
      this._reportContractDeployTransactionSent(tx),
      this._waitForDeployment(tx),
    ]);

    return contractAddress;
  }

  public async getSigner(from?: null | AddressLike): Promise<HardhatEthersSigner> {
    if (!from) {
      return this._hre.ethers.provider.getSigner();
    }

    const address = await this._hre.ethers.resolveAddress(from, this._hre.ethers.provider);

    return this._hre.ethers.provider.getSigner(address);
  }

  protected async _deploy(
    deployParams: ContractDeployParams,
    args: Args,
    txOverrides: Overrides,
  ): Promise<TransactionResponse> {
    const signer: Signer = await this.getSigner(txOverrides.from);

    const tx = await this._createDeployTransaction(deployParams, args, txOverrides);

    return signer.sendTransaction(tx);
  }

  protected async _waitForDeployment(tx: TransactionResponse): Promise<string> {
    const receipt = await tx.wait(this._config.confirmations);

    if (receipt) {
      return receipt.contractAddress!;
    }

    throw new MigrateError("Contract deployment failed. Please check your network configuration (confirmations).");
  }

  // eslint-disable-next-line
  protected async _reportContractDeployTransactionSent(tx: TransactionResponse): Promise<void> {
    // TODO: implement when reporter is ready
  }

  protected async _createDeployTransaction(
    contractParams: ContractDeployParams,
    args: Args,
    txOverrides: Overrides,
  ): Promise<TransactionRequest> {
    const factory = new this._hre.ethers.ContractFactory(contractParams.abi, contractParams.bytecode);

    return factory.getDeployTransaction(...args, txOverrides);
  }
}
