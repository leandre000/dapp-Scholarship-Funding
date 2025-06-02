const Scholarship = artifacts.require("Scholarship");

module.exports = function(deployer) {
    deployer.deploy(Scholarship);
};