import { ethers,Contract,Signer } from "ethers";
import contractData from "../abi/MyNFT.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

async function connectProvider() {
  try {
    if (!contractAddress) {
      throw new Error("CONTRACT_ADDRESS environment variable is not set");
    }
    if (!rpcUrl) {
      throw new Error("RPC_URL environment variable is not set");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer:Signer = await provider.getSigner();
    const contract:Contract = new Contract(contractAddress, contractData.abi, signer);
    
    console.log('contract',contract)
    return  Promise.resolve(contract);
  } catch (error) {
    console.error('Failed to connect to the contract:', error);
    return Promise.reject(error);
  }
}
export default connectProvider