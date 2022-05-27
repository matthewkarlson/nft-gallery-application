import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import {NFTCard} from "./components/nftCard"
const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const fetchNFTs = async() => {
    let nfts;
    console.log("fetching NFTs");
    const baseURL = "https://eth-mainnet.alchemyapi.io/v2/3-RLVXblMaJw1FlRSntlx-EkUd7L5bCg/getNFTs/";

    if(!collection.length){
      var requestOptions = {
        method: 'GET',
      };
      
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }else{
      console.log("fetching nfts for owned filtered by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }

    if(nfts){
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if(collection.length){
      var requestOptions = {
        method: 'GET',
      };
      const baseURL = "https://eth-mainnet.alchemyapi.io/v2/3-RLVXblMaJw1FlRSntlx-EkUd7L5bCg/getNFTsForCollection/";
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      if(nfts){
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div>
        <input onChange={(e)=>setWalletAddress(e.target.value)} value ={wallet} type ={"text"} placeholder="Your wallet address"></input>
        <input onChange={(e)=>setCollectionAddress(e.target.value)} value={collection} type ={"text"} placeholder="Collection address"></input>
        <label> <input onChange={(e) => {setFetchForCollection(e.target.checked)}} type={"checkbox"}></input>Fetch for Collection</label>
        <button onClick={
          () =>{
            if(fetchForCollection){
              fetchNFTsForCollection()
            }else fetchNFTs()
          }
        } > Let's go! </button>
      </div>
      <div>
        {
          NFTs.length && NFTs.map(nft => {
            return(<NFTCard nft={nft}></NFTCard>)
          })
        }
      </div>
    </div>
  )
}

export default Home
