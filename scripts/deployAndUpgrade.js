const { ethers, upgrades } = require("hardhat");

async function main() {
   const network = await ethers.provider.getNetwork();
  console.log("Deploying to network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  // --- DEPLOY V1 ---
  const ERC20v1 = await ethers.getContractFactory("ERC20v1");
  const [deployer] = await ethers.getSigners();
  const contract = await upgrades.deployProxy(ERC20v1, [deployer.address], { kind: "uups" });
  await contract.waitForDeployment();
  const proxyAddress = await contract.getAddress();
  console.log("V1 Proxy deployed to:", proxyAddress);
  const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("implimentation address:",implAddress);

  // --- UPGRADE TO V2  ---
  const ERC20v2 = await ethers.getContractFactory("ERC20v2");
  console.log("Upgrading logic contract...");
  
  // Directly passes the reference from step 1
  const upgraded = await upgrades.upgradeProxy(proxyAddress, ERC20v2, { kind: "uups" });
  await upgraded.waitForDeployment();
  
  const newImplAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Successfully upgraded ")
  console.log("New implementation (V2) deployed to:", newImplAddress);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
