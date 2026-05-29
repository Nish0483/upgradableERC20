const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ERC20v2 burn after upgrade", function () {
  it("reduces total supply by the burned amount", async function () {
    const [owner] = await ethers.getSigners();

    const ERC20v1 = await ethers.getContractFactory("ERC20v1");
    const proxy = await upgrades.deployProxy(ERC20v1, [owner.address], {
      kind: "uups",
    });
    await proxy.waitForDeployment();

    const ERC20v2 = await ethers.getContractFactory("ERC20v2");
    const token = await upgrades.upgradeProxy(
      await proxy.getAddress(),
      ERC20v2,
      { kind: "uups" }
    );

    const burnAmount = ethers.parseEther("100");
    const supplyBefore = await token.totalSupply();

    await token.burn(burnAmount);

    const supplyAfter = await token.totalSupply();
    expect(supplyAfter).to.equal(supplyBefore - burnAmount);
  });
});
