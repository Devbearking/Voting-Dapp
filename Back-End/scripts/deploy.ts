import { ethers } from "hardhat";

async function main() {

  const lockedAmount = ethers.parseEther("0.001");

  const votingContract = await ethers.deployContract("Voting");

  await votingContract.waitForDeployment();

  console.log(
    `Voting with ${ethers.formatEther(
      lockedAmount
    )}ETH deployed to ${votingContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
