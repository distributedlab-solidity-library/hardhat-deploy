/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Contract, ContractFactory, ContractTransactionResponse, Interface } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Library1, Library1Interface } from "../../Contracts2.sol/Library1";

const _abi = [
  {
    inputs: [],
    name: "lib",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6093610024600b82828239805160001a607314601757fe5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c806392801230146038575b600080fd5b603e6054565b6040518082815260200191505060405180910390f35b6000600190509056fea264697066735822122003b115e75cf592450f0afcd802789bd090ec00f93ab3d27a3784e04c6d4fcce364736f6c63430007030033";

type Library1ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: Library1ConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class Library1__factory extends ContractFactory {
  constructor(...args: Library1ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string },
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Library1 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Library1__factory {
    return super.connect(runner) as Library1__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Library1Interface {
    return new Interface(_abi) as Library1Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): Library1 {
    return new Contract(address, _abi, runner) as unknown as Library1;
  }
}
