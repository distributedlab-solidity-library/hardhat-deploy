import { BaseContract, Interface } from "ethers";

import { HardhatRuntimeEnvironment } from "hardhat/types";

import { Adapter } from "./Adapter";
import { EthersInjectHelper } from "./EthersInjectHelper";

import { MinimalContract } from "../MinimalContract";

import { bytecodeToString, catchError, getSignerHelper } from "../../utils";

import { EthersFactory } from "../../types/adapter";
import { OverridesAndLibs } from "../../types/deployer";

import { ArtifactProcessor } from "../../tools/storage/ArtifactProcessor";

@catchError
export class EthersAdapter extends Adapter {
  private static _processedClasses = new Set<string>();

  private _injectHelper: EthersInjectHelper;

  constructor(_hre: HardhatRuntimeEnvironment) {
    super(_hre);
    this._injectHelper = new EthersInjectHelper(_hre);
  }

  public async fromInstance<A, I>(instance: EthersFactory<A, I>): Promise<MinimalContract> {
    return new MinimalContract(
      this._hre,
      this.getRawBytecode(instance),
      this.getInterface(instance),
      this.getContractName(instance),
    );
  }

  public async toInstance<A, I>(
    instance: EthersFactory<A, I>,
    address: string,
    parameters: OverridesAndLibs,
  ): Promise<I> {
    const signer = await getSignerHelper(this._hre, parameters.from);

    const contract = new BaseContract(address, this.getInterface(instance), signer);

    const contractName = this.getContractName(instance);

    if (!EthersAdapter._processedClasses.has(contractName)) {
      EthersAdapter._processedClasses.add(contractName);

      this._injectHelper.overrideConnectMethod(instance, contractName);
    }

    return this._injectHelper.insertHandlers(contract, contractName, parameters) as unknown as I;
  }

  public getInterface<A, I>(instance: EthersFactory<A, I>): Interface {
    return Interface.from(instance.abi);
  }

  public getRawBytecode<A, I>(instance: EthersFactory<A, I>): string {
    return bytecodeToString(instance.bytecode);
  }

  public getContractName<A, I>(instance: EthersFactory<A, I>): string {
    try {
      return ArtifactProcessor.tryGetContractName(this.getRawBytecode(instance));
    } catch {
      return "Unknown Contract";
    }
  }
}
