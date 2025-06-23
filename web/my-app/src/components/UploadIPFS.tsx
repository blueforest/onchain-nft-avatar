"use client";

import { useState,useEffect } from "react";
import { pinata } from "@/utils/config";
import { useWallet } from "../hooks/useWallet";
import connectProvider from "../ethers/connectContract";

export  function UploadIPFS( {onSuccess}:{onSuccess:()=>void}) {
  const {  account  } = useWallet();
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>("");
  const [nftDesc, setNftDesc] = useState<string | null>("");
  
  interface NFTMetadata {
    name: string | null;
    description: string | null;
    image: string;
    external_url?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  }
  const uploadFile = async () => {
    if (!file) {
      throw new Error('No file selected');
    } 
    try {
      const urlRequest = await fetch("/api/url"); // Fetches the temporary upload URL
      const urlResponse = await urlRequest.json(); // Parse response
      const upload = await pinata.upload.public
        .file(file)
        .url(urlResponse.url); // Upload the file with the signed URL
      console.log(upload);
      setUploading(false);
      return Promise.resolve(upload)
    } catch (e) {
      return Promise.reject(e)
    }
  };

  const uploadJson = async (json:NFTMetadata) => {
    try {
      const urlRequest = await fetch("/api/url"); // Fetches the temporary upload URL
      const urlResponse = await urlRequest.json(); // Parse response
      const uploadJson = await pinata.upload.public.json({
        ...json
      }).name(`${nftName}.json`).url(urlResponse.url)
      return Promise.resolve(uploadJson)
    } catch (e) {
      console.log(e)
      return Promise.reject(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    // Check if file size exceeds 1MB
    if (file.size > 1024 * 1024) {
      alert('File size cannot exceed 1MB');
      e.target.value = ''; // Reset the input
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  // minting the nft
  const handleMint = async () => {
    try {
      setUploading(true);
      const uploadRes = await uploadFile()
      const imageCID = uploadRes.cid
      const uploadJsonRes = await uploadJson({
        "name": nftName,
        "description": nftDesc,
        "image": `ipfs://${imageCID}`,
        "external_url": "https://pinata.cloud"
      })
   
      const _contract = await connectProvider();
      const tokenURI = `ipfs://${uploadJsonRes.cid}`
      await _contract.mintAvatar(account,tokenURI)
      setUploading(false);
      onSuccess()
    } catch (e) {
      console.error(e)
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-6">
  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Mint Your NFT</h2>

  {/* Image Upload */}
  <div className="flex flex-col items-center">
    {previewUrl ? (
      <img
        src={previewUrl}
        alt="Preview"
        className="w-64 h-64 object-cover rounded-xl border-2 border-dashed border-indigo-500"
      />
    ) : (
      <label className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl text-gray-400 cursor-pointer hover:border-indigo-500 transition-all">
        <span>Click to upload image</span>
        <input type="file" className="hidden" onChange={handleChange} />
      </label>
    )}
  </div>

  {/* Name */}
  <input
    type="text"
    placeholder="NFT Name"
    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    value={nftName ?? ""}
    onChange={(e) => setNftName(e.target.value)}
  />

  {/* Description */}
  <textarea
    placeholder="Description"
    className="w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    value={nftDesc ?? ""}
    onChange={(e) => setNftDesc(e.target.value)}
  />

  {/* Mint Button */}
  <button
    onClick={handleMint}
    disabled={uploading}
    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50"
  >
    {uploading ? 'Minting...' : 'Upload and Mint NFT'}
  </button>
</div>

  );
}