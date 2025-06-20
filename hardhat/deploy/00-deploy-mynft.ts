async function deployMyNFT({
  getNamedAccounts,
  deployments,
  ethers
}: {
  getNamedAccounts: any;
  deployments: any;
  ethers: any;
}) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigners();
  console.log("Deploying MyNFT contract with the owner:", deployer);
  // from参数指定了部署合约的账户地址
  // 这里使用deployer账户作为部署者
  // deployer是通过getNamedAccounts()获取的默认部署账户
  await deploy("MyNFT", {
    from: deployer,
    args: [deployer],
    log: true,
  });
}

export default deployMyNFT;
deployMyNFT.tags = ["MyNFT"];
