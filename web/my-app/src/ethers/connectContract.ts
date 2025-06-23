import { ethers,Contract,Signer } from "ethers";
import contractData from "../../../../hardhat/deployments/localhost/MyNFT.json";

const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcUrl = process.env.RPC_URL;

async function connectProvider() {
  try {
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable is not set");
    }
    if (!rpcUrl) {
      throw new Error("RPC_URL environment variable is not set");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer:Signer = await provider.getSigner(2);
    const contract:Contract = new Contract(contractAddress, contractData.abi, signer);
    return  Promise.resolve(contract);
  } catch (error) {
    console.error('Failed to connect to the contract:', error);
    return Promise.reject(error);
  }
}
export default connectProvider