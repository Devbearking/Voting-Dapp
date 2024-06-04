import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";



const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      chainId: 59141,
      url: `https://linea-sepolia.infura.io/v3/b06dfd372c964ac49e93c1a14362badf`,
      accounts: ['c6495ca2c9efa14d4fc7942558d5f48fd0f08321c37d948f5f56b3d7d45e3b27'],
    },
  },
};

export default config;