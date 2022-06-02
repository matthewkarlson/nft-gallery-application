import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import {NFTCard} from "./components/nftCard"
const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [endToken, setEndToken]= useState("");
  const fetchNFTs = async() => {
    let nfts;
    console.log("fetching NFTs");
    const baseURL = "https://eth-mainnet.alchemyapi.io/v2/3-RLVXblMaJw1FlRSntlx-EkUd7L5bCg/getNFTs/";

    if (!collection.length) {
      var requestOptions = {
        method: 'GET',
      };
      const fetchURL = `${baseURL}?owner=${wallet}`;
  
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }
  
    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)

    }
  }

  const fetchNFTsForCollection = async () => {
    if(collection.length){
      var requestOptions = {
        method: 'GET',
      };
      console.log("fetching NFTs");
      const baseURL = "https://eth-mainnet.alchemyapi.io/v2/3-RLVXblMaJw1FlRSntlx-EkUd7L5bCg/getNFTsForCollection/";
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${endToken}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      if(nfts){
        console.log("NFTs in collection:", nfts)
        setEndToken(nfts.nextToken)
        setNFTs(nfts.nfts)
      }
      console.log(endToken)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} onChange={(e)=>setWalletAddress(e.target.value)} value ={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input onChange={(e)=>setCollectionAddress(e.target.value)} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
           () => {  
            if (fetchForCollection) {
              setEndToken("");
              fetchNFTsForCollection()
            }else fetchNFTs()
          }
        }>Let's go! </button>
        <div class="space-x-4 flex flex-row"> 
        <button className={"basis-1/2 disabled:bg-slate-5 00 text-white bg-blue-400 px-8 py-2 mt-3 rounded-sm w-1/5"} onClick={
           () => {  
            if (fetchForCollection) {
              endToken = endToken -200;
              fetchNFTsForCollection()
            }else fetchNFTs()
          }
        }>Previous page </button>
                <button className={"basis-1/2 disabled:bg-slate-500 text-white bg-blue-400 px-8 py-2 mt-3 rounded-sm w-1/5"} onClick={
           () => {  
            if (fetchForCollection) {
              fetchNFTsForCollection()
            }else fetchNFTs()
          }
        }>Next page </button>
        </div>
        
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
