import { HardhatRuntimeEnvironment } from "hardhat/types";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

const TruffleDeployer = require("@truffle/deployer");
const TruffleReporter = require("@truffle/reporters").migrationsV5;
import { Verifier } from "../verifier/verifier";
import { pluginName } from "../constants";

const Web3 = require("web3");

export class Deployer {
  readonly _hre: HardhatRuntimeEnvironment;
  private reporter: any;
  private deployer: any;
  private verifier: Verifier | undefined;

  constructor(hre_: HardhatRuntimeEnvironment) {
    this._hre = hre_;
  }

  async startMigration(verify: boolean, confirmations = 0) {
    try {
      const web3 = new Web3(this._hre.network.provider);
      const chainId = await web3.eth.getChainId();
      const networkType = await web3.eth.net.getNetworkType();

      this.reporter = new TruffleReporter();
      this.deployer = new TruffleDeployer({
        logger: console,
        confirmations: confirmations,
        provider: web3.currentProvider,
        networks: { chainId: networkType },
        network: "",
        network_id: chainId,
      });

      if (verify) {
        this.verifier = new Verifier(this._hre);
      }

      this.reporter.confirmations = confirmations;
      this.reporter.setMigration({ dryRun: false });
      this.reporter.setDeployer(this.deployer);

      this.reporter.listen();
      this.deployer.start();

      this.reporter.preMigrate({
        isFirst: true,
        file: "Contracts:",
        network: networkType,
        networkId: chainId,
        blockLimit: (await web3.eth.getBlock("latest")).gasLimit,
      });
    } catch (e: any) {
      throw new NomicLabsHardhatPluginError(pluginName, e.message);
    }
  }

  async link(Library: any, ...Contracts: any) {
    try {
      const library = Library.contractName ? await Library.deployed() : Library;

      for (const Contract of Contracts) {
        this.reporter.linking({
          libraryName: Library.contractName,
          libraryAddress: Library.address,
          contractName: Contract.contractName,
          contractAddress: Contract.contractAddress,
        });

        await Contract.link(library);
      }
    } catch (e: any) {
      throw new NomicLabsHardhatPluginError(pluginName, e.message);
    }
  }

  async deploy(Instance: any, ...args: any) {
    let instance;

    try {
      instance = await this.deployer.deploy(Instance, ...args);

      Instance.setAsDeployed(instance);

      if (this.verifier) {
        await this.verifier.verify([instance, ...args]);
      }

      return instance;
    } catch (e: any) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log(`Contract at ${instance.address} already verified.`);
        return instance;
      } else {
        throw new NomicLabsHardhatPluginError(pluginName, e.message);
      }
    }
  }

  async finishMigration() {
    try {
      this.reporter.postMigrate({
        isLast: true,
      });

      this.deployer.finish();
    } catch (e: any) {
      throw new NomicLabsHardhatPluginError(pluginName, e.message);
    }
  }
}
