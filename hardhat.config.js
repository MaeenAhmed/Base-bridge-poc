require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // لإدارة مفتاح API

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: process.env.SEPOLIA_RPC_URL,
      },
    },
  },
};
