import { expect, assert } from "chai";
import { ethers,deployments,network,getNamedAccounts } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";

describe("MyNFT", function () {
    let myNFTContract: any;
    let owner: any;
    let user0: any;
    let thirdAccount: any;

    beforeEach(async () => {
        await deployments.fixture(["MyNFT"]);
        const {deployer,user,user2} = await getNamedAccounts();
        owner = deployer;
        user0 = user;
        thirdAccount = user2;
        const deployment = await deployments.get("MyNFT");
        myNFTContract = await ethers.getContractAt("MyNFT",deployment.address);
    });
    
    it("should mint and return the correct tokenURI",async()=>{
         const tokenURI = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN15ZyT4K4JYZxY5X5x5x5";
        const tx = await myNFTContract.mintAvatar(owner,tokenURI);
        await tx.wait();
        const tokenURIFromContract = await myNFTContract.tokenURI(0);
        await expect(await myNFTContract.ownerOf(0)).to.equal(owner);
        await expect(tokenURIFromContract).to.equal(tokenURI);
    });

    // 查询owner所持有的nft
    it("should return the correct tokenIds for the owner",async()=>{
        const tokenURI = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN15ZyT4K4JYZxY5";
      
        // 给user0 mint一个nft
        const tx1 = await myNFTContract.mintAvatar(user0,tokenURI);
        await tx1.wait();

        // 给owner mint一个nft
        const tx = await myNFTContract.mintAvatar(owner,tokenURI);
        await tx.wait();

        // 给user0 再次 mint一个nft
           const tokenURI1 = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN15ZyT4K4JY1";
      
        const tx2 = await myNFTContract.mintAvatar(user0,tokenURI1);
        await tx2.wait();

        // const ethersUser0 = await ethers.getSigner(user0);
        const tokenIds = await myNFTContract.tokensOfOwner(user0);

        await expect(tokenIds[0]).to.deep.equal([0,2]);
        await expect(tokenIds[1]).to.deep.equal([tokenURI,tokenURI1]);
    });


    // test safeTransferFrom
    it("test safeTransferFrom,if user has only one nft",async() => {

        const tokenURI = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN15ZyT4K4JYZxY5";
      
        // 给user0 mint一个nft
        const tx1 = await myNFTContract.mintAvatar(owner,tokenURI);
        await tx1.wait();

        await myNFTContract.safeTransferFrom(owner,user0,0);

        await expect(await myNFTContract.ownerOf(0)).to.equal(user0);


    })


      it("test safeTransferFrom,if user has multiple nft",async() => {

        const tokenURI1 = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN1";

        // 给user0 mint 2个nft
        const tx1 = await myNFTContract.mintAvatar(owner,tokenURI1);
        await tx1.wait();
        const tokenURI2 = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN2";
        const tx2 = await myNFTContract.mintAvatar(owner,tokenURI2);
        await tx2.wait();

        await myNFTContract.safeTransferFrom(owner,user0,0);
        // user0 是否已收到
        await expect(await myNFTContract.ownerOf(0)).to.equal(user0);

        // owner的nft个数是多少
        const balance = await myNFTContract.balanceOf(owner)
        await expect(balance).to.equal(1)

        // owner的tokenUrl
        const uri = await myNFTContract.tokenURI(1)
        await expect(uri).to.equal(tokenURI2)
    })

    // approve
    it("should get the correct approve", async ()=> {
      const tokenURI = "ipfs://QmS4ghgMgfFvqPjB4WKXHaN15ZyT4K4JYZxY5";
      const tx1 = await myNFTContract.mintAvatar(owner,tokenURI);
      await tx1.wait();

      await myNFTContract.approve(user0,0);
      const approved = await myNFTContract.getApproved(0);
      await expect(approved).to.equal(user0)


      // test user 转移nft
      const ethersUser0 = await ethers.getSigner(user0);
      const tx3 = await myNFTContract.connect(ethersUser0).safeTransferFrom(owner,thirdAccount,0);
      await tx3.wait();
      
      const nowOwner = await myNFTContract.ownerOf(0);
      await expect(nowOwner).to.equal(thirdAccount)
    })




    
})