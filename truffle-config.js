const path = require("path");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            // from: "0x2EAe40dC37BeD7A1f49F4662e9750014dffd5E02"
        }
    },
    compilers: {
        solc: {
            version: "^0.8.10"
        }
    }
};
