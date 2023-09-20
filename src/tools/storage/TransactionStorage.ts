import { existsSync, readFileSync, writeFileSync } from "fs";

import { HardhatRuntimeEnvironment } from "hardhat/types";

import { MigrateError } from "../../errors";
import { ContractDeploymentTransactionInterestedValues } from "../../types/transaction-storage";

import { catchError, JSONConvertor, resolvePathToFile } from "../../utils";

@catchError
export class TransactionStorage {
  private static instance: TransactionStorage;

  private readonly _fileName = ".transaction_storage.json";
  private _filePath = "";
  private state: Record<string, string> = {};
  private _hre: HardhatRuntimeEnvironment = {} as HardhatRuntimeEnvironment;

  private constructor() {}

  public init(_hre: HardhatRuntimeEnvironment) {
    this._hre = _hre;

    this._filePath = resolvePathToFile(_hre.config.migrate.pathToMigrations, this._fileName);

    if (this._stateExistsOnFile()) {
      this.state = this._readStateFromFile();
    } else {
      this.clear();
    }
  }

  public static getInstance(): TransactionStorage {
    if (!TransactionStorage.instance) {
      TransactionStorage.instance = new TransactionStorage();
    }

    return TransactionStorage.instance;
  }

  public saveDeploymentTransaction(args: ContractDeploymentTransactionInterestedValues, address: string) {
    const hash = this._createHash(args);

    if (this.state[hash]) {
      if (this.state[hash] !== address) {
        throw new MigrateError(`Transaction with hash ${hash} already exists in storage`);
      }

      return;
    }

    this._addValueToState(hash, address);
  }

  public saveDeploymentTransactionByName(contractName: string, address: string) {
    if (this.state[contractName]) {
      if (this.state[contractName] !== address) {
        throw new MigrateError(`Transaction with name ${contractName} already exists in storage`);
      }

      return;
    }

    this._addValueToState(contractName, address);
  }

  public getDeploymentTransaction(args: ContractDeploymentTransactionInterestedValues): string | undefined {
    const hash = this._createHash(args);

    return this.state[hash];
  }

  public getDeploymentTransactionByName(contractName: string): string | undefined {
    return this.state[contractName];
  }

  public clear() {
    this.state = {};

    this._saveStateToFile();
  }

  private _addValueToState(hash: string, address: string) {
    this.state[hash] = address;

    this._saveStateToFile();
  }

  private _createHash({ data, from, chainId }: ContractDeploymentTransactionInterestedValues): string {
    return this._hre.ethers.id(this._toJSON({ data, from, chainId }));
  }

  private _stateExistsOnFile(): boolean {
    return existsSync(this._filePath);
  }

  private _saveStateToFile() {
    const fileContent = this._toJSON(this.state);

    writeFileSync(this._filePath, fileContent, {
      flag: "w",
      encoding: "utf8",
    });
  }

  private _readStateFromFile(): Record<string, string> {
    const fileContent = readFileSync(this._filePath, {
      encoding: "utf8",
    });

    return JSON.parse(fileContent);
  }

  private _toJSON(data: any): string {
    return JSON.stringify(data, JSONConvertor);
  }
}
