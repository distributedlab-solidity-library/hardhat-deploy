/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface Library1Contract extends Truffle.Contract<Library1Instance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<Library1Instance>;
}

type AllEvents = never;

export interface Library1Instance extends Truffle.ContractInstance {
  lib(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  methods: {
    lib(txDetails?: Truffle.TransactionDetails): Promise<BN>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void,
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(event: string, callback: (error: Error, event: EventData) => void): Promise<EventData[]>;
}
