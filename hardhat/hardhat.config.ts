import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
const config: HardhatUserConfig = {
  // defaultNetwork:"hardhat",
  solidity: "0.8.28",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
    user2: {
      default: 2,
    },
  },
  networks:{
    // sepolia:{

    // },
    localhost:{
      url:'http://localhost:8546',
      chainId: 31337
    }
  }
};

export default config;
