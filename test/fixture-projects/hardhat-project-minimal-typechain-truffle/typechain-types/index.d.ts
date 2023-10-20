/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ContractWithConstructorArgumentsContract } from "./ContractWithConstructorArguments";
import { ContractWithExternalLibraryContract } from "./ContractWithExternalLibrary";
import { ContractWithPayableConstructorContract } from "./ContractWithPayableConstructor";
import { Library1Contract } from "./Library1";
import { Library2Contract } from "./Library2";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "ContractWithConstructorArguments"): ContractWithConstructorArgumentsContract;
      require(name: "ContractWithExternalLibrary"): ContractWithExternalLibraryContract;
      require(name: "ContractWithPayableConstructor"): ContractWithPayableConstructorContract;
      require(name: "Library1"): Library1Contract;
      require(name: "Library2"): Library2Contract;
    }
  }
}

export {
  ContractWithConstructorArgumentsContract,
  ContractWithConstructorArgumentsInstance,
} from "./ContractWithConstructorArguments";
export {
  ContractWithExternalLibraryContract,
  ContractWithExternalLibraryInstance,
} from "./ContractWithExternalLibrary";
export {
  ContractWithPayableConstructorContract,
  ContractWithPayableConstructorInstance,
} from "./ContractWithPayableConstructor";
export { Library1Contract, Library1Instance } from "./Library1";
export { Library2Contract, Library2Instance } from "./Library2";
