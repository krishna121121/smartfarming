module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545,        // Standard Ganache port (default: none)
      network_id: "*",   // Any network (default: none)
    },
  },

  // Specify the version of Solidity used in the contract
  compilers: {
    solc: {
      version: "0.8.0", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {       // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },

  // Configure Truffle to save deployment artifacts in a specific folder (optional)
  // contracts_build_directory: "./client/src/contracts", // for frontend setup, if needed
};
