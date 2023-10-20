/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface ContractWithExternalLibraryInterface extends Interface {
  getFunction(nameOrSignature: "lib" | "lib2" | "lib3" | "lib4"): FunctionFragment;

  encodeFunctionData(functionFragment: "lib", values?: undefined): string;
  encodeFunctionData(functionFragment: "lib2", values?: undefined): string;
  encodeFunctionData(functionFragment: "lib3", values?: undefined): string;
  encodeFunctionData(functionFragment: "lib4", values?: undefined): string;

  decodeFunctionResult(functionFragment: "lib", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lib2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lib3", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lib4", data: BytesLike): Result;
}

export interface ContractWithExternalLibrary extends BaseContract {
  connect(runner?: ContractRunner | null): ContractWithExternalLibrary;
  waitForDeployment(): Promise<this>;

  interface: ContractWithExternalLibraryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>,
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>,
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;

  lib: TypedContractMethod<[], [bigint], "view">;

  lib2: TypedContractMethod<[], [bigint], "view">;

  lib3: TypedContractMethod<[], [bigint], "view">;

  lib4: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

  getFunction(nameOrSignature: "lib"): TypedContractMethod<[], [bigint], "view">;
  getFunction(nameOrSignature: "lib2"): TypedContractMethod<[], [bigint], "view">;
  getFunction(nameOrSignature: "lib3"): TypedContractMethod<[], [bigint], "view">;
  getFunction(nameOrSignature: "lib4"): TypedContractMethod<[], [bigint], "view">;

  filters: {};
}
