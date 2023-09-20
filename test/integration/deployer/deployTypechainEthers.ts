import { expect } from "chai";

import { useEnvironment } from "../../helpers";

import { Deployer } from "../../../src/deployer/Deployer";
import { PluginName } from "../../../src/types/migrations";

import { ZeroAddress } from "ethers";
import { ArtifactsParser } from "../../../src/parser/ArtifactsParser";
import { TransactionStorage } from "../../../src/tools/storage/TransactionStorage";
import {
  ContractWithConstructorArguments__factory,
  ContractWithExternalLibrary__factory,
  Library1__factory,
  Library2__factory,
} from "../../fixture-projects/hardhat-project-minimal-typechain-ethers/typechain-types";

describe("deployer", () => {
  describe("deploy()", () => {
    useEnvironment("minimal-typechain-ethers");

    let deployer: Deployer;

    beforeEach("setup", async function () {
      deployer = new Deployer(this.hre, PluginName.ETHERS);

      await new ArtifactsParser(this.hre).parseArtifacts();

      TransactionStorage.getInstance().init(this.hre);
      TransactionStorage.getInstance().clear();
    });

    it("should deploy contract with constructor arguments", async function () {
      const contract = await deployer.deploy(ContractWithConstructorArguments__factory, ["test"], {});

      const name = await contract.name();

      expect(name).to.equal("test");
    });

    it("should revert if artifact is not a contract", async function () {
      await expect(deployer.deploy(null as any, [], {})).to.be.rejected;
    });

    it("should deploy library separately", async function () {
      await expect(deployer.deploy(Library1__factory, [])).to.be.not.rejected;
    });

    it("should deploy contract with provided libraries", async function () {
      await expect(
        deployer.deploy(ContractWithExternalLibrary__factory, [], {
          libraries: {
            "contracts/Contracts.sol:Library1": ZeroAddress,
            "contracts/Contracts.sol:Library2": ZeroAddress,
          },
        }),
      ).to.be.not.rejected;
    });

    it("should not deploy if bytecode was not linked", async function () {
      await expect(deployer.deploy(ContractWithExternalLibrary__factory, [], {})).to.be.rejected;
    });

    it("should deploy contract with memorized libraries", async function () {
      await expect(deployer.deploy(ContractWithExternalLibrary__factory, [], {})).to.be.rejected;

      await deployer.deploy(Library1__factory, []);
      await deployer.deploy(Library2__factory, []);
      await deployer.deploy(ContractWithExternalLibrary__factory, [], {});

      await expect(deployer.deploy(ContractWithExternalLibrary__factory, [], {})).to.be.not.rejected;
    });
  });
});
