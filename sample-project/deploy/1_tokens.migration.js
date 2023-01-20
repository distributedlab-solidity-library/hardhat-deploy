// First you have to import all the contracts and external libraries that you want to deploy
const ERC20 = artifacts.require("ERC20Mock");
const TokenBalance = artifacts.require("TokenBalance");
const TransparentUpgradeableProxy = artifacts.require(
  "TransparentUpgradeableProxy"
);

// Do not use this address! Only for demonstration purposes!
const proxyAdmin = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

/**
 * This anonymous function is used by the deployer instance to perform a sequence of steps defined by the user.
 * @param deployer instance of the Deployer class that implements deployment and linking functionality.
 * @param logger instance of the Logger class that implements logging functionality.
 * @param verifier instance of the Verifier class that implements verifying and
 * linking proxy to implementation functionality.
 * @returns {Promise<void>} asynchronous function to perform the migration, which will be called by the plugin.
 */
module.exports = async (deployer, logger, verifier) => {
  // Firstly we need to deploy the external library
  const tokenBalance = await deployer.deploy(TokenBalance);
  // Secondly, link it to the contract metaclass that uses it
  await deployer.link(TokenBalance, ERC20);
  // Next step is to deploy the token with the linked library.
  const token = await deployer.deploy(ERC20);
  // Finally, let's deploy TransparentUpgradeableProxy for this token
  const proxy = await deployer.deployProxy(
    TransparentUpgradeableProxy,
    token.address,
    token.address,
    proxyAdmin,
    []
  );

  // TODO: finalize message
  /*
   * Under the hood the `deployer.deployProxy(...)` function will call `linkProxyToImplementation`
   * function, to automatically verify that this contract is a proxy on etherscan.
   * If you deploy the contract with this function on blockscout, you will get the following message:
   * -- Possibly you are trying to verify a contract on a blockscout! --
   * */

  // If you do not want to use `deployer.deployProxy(...)` function, you could use the
  // `verifier.linkProxyToImplementation()` function individually.
  // Example:
  // const proxy = await deployer.deploy(TransparentUpgradeableProxy, token.address, proxyAdmin, []);
  // await deployer.linkProxyToImplementation(proxy.address, token.address);

  // An example of the transaction that the user wants to execute exactly after deployment

  // To be able to call the implementation through the proxy you should use `.at(...)` function
  const tokenAtProxy = await ERC20.at(proxy.address);

  // Log the data about the transaction after its confirmation.
  logger.logTransaction(
    await tokenAtProxy.initialize("Token1", "SWT1"),
    `Initialize ERC20Mock`
  );

  logger.logTransaction(
    await tokenAtProxy.mint(token.address, 100000000),
    `Mint token for itself`
  );

  // Log the contracts in an assembled table
  logger.logContracts(
    ["Token", token.address],
    ["Token proxy", proxy.address],
    ["TokenBalanceLib", tokenBalance.address]
  );
};
