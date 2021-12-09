var CrowndFunding = artifacts.require('./CrowdFunding.sol');

module.exports = function (deployer) {
    deployer.deploy(CrowndFunding);
};
