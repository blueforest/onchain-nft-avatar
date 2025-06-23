// const ipfsUri = "ipfs://bafkreiapydjfihjaj4kcxlgcdk54onpsvvebj4noimms3knby3525gaqiq";

// 替换成 HTTP 网关地址
function ipfsToHttp(ipfsUri: string) {
  // gateway.pinata.cloud
  // https://ipfs.io/ipfs/
  return ipfsUri.replace(/^ipfs:\/\//, 'https://gateway.pinata.cloud/ipfs/');
}

async function fetchNFTMetadata(ipfsUri: string) {
  const url = ipfsToHttp(ipfsUri);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch metadata");

  const metadata = await response.json();
  console.log("Metadata:", metadata);

  // 提取 image 字段，并转换成 HTTP 链接
  const imageUrl = ipfsToHttp(metadata.image);
  console.log("Image URL:", imageUrl);

  return {
    ...metadata,
    imageUrl
  };
}

export default fetchNFTMetadata;