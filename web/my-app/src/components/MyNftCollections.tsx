'use client';

import { useWallet } from "../hooks/useWallet";
import  connectProvider  from "../ethers/connectContract";
import fetchNFTMetadata from "../utils/fetchMetaData";
import {useEffect,useState} from 'react'
import { Contract } from "ethers";

export default function Dashboard() {
  const { account} = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const [nftList, setNftList] = useState<any[]>([]);

  useEffect(() => {
    const fetchContract = async () => {
      const _contract = await connectProvider();
      setContract(_contract);
    }
    fetchContract();
  },[])


    const queryNft = async () => {  
     try{
      console.log('account11',account)
      const res = await contract?.tokensOfOwner(account);
      const nfts = await Promise.all(res[1].map(async (uri: string) => {
        const metadata = await fetchNFTMetadata(uri);
        return {
          ...metadata,
          tokenId: res[0]
        };
      }));
      console.log('nfts',nfts)
      setNftList(nfts);
  
    } catch(e){
      console.error(e)
    }

  }

  useEffect(() => {
    if (account && contract) {
      queryNft();
    }
  }, [account, contract]);



  return (


    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" >
      {nftList.map((nft,index) => (
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center" key={index}>
        <img src={nft.imageUrl} alt="NFT Avatar" className="w-28 h-28 rounded-full border-4 border-indigo-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800">{nft.name}</h2>
        <p className="text-sm text-gray-500 truncate w-full text-center">{nft.description}</p>
        <p className="text-xs text-gray-400 mt-1">CyberAvatars Collection</p>
      </div>
      ))}
    
    </div>
  );
} 