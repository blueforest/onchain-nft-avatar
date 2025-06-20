# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

| **模块**   | **描述**                                   | **涉及 ERC721 概念**           |
| :--------- | :----------------------------------------- | :----------------------------- |
| 铸造 NFT   | 用户调用 mint 铸造头像 NFT                 | safeMint，tokenURI             |
| 查询头像   | 根据地址查看当前持有头像                   | ownerOf，balanceOf             |
| 转让头像   | 用户可转移头像给他人                       | transferFrom, safeTransferFrom |
| 授权操作   | 用户可授权他人操作其头像                   | approve / setApprovalForAll    |
| 链上事件   | NFT 转移时触发事件                         | Transfer 事件监听              |
| 元数据托管 | 使用 IPFS 上传头像 JSON + 图片             | 结合 tokenURI()                |
| 前端界面   | React/Vue 展示头像、mint、授权、转移等操作 | ethers.js 合约                 |
