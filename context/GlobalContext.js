'use client'
import React from "react";
import { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import WineNFTABI from "@/abi/WineNFT.json";
import WineMarketplaceABI from "@/abi/WineMarketplace.json";


require("dotenv").config();
const GlobalContext = React.createContext();

const LOCAL_RPC_URL = "http://localhost:8545";
const wineNftContractAddress =
  process.env.REACT_APP_WINE_NFT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

console.log("wineNftContractAddress:", wineNftContractAddress);
console.log("WineNFTABI:", WineNFTABI.abi);

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [winesRetrieved, setWinesRetrieved] = useState([]);
  const fetchWines = async () => {
    const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
    console.log("provider:", provider);
    const contract = new ethers.Contract(
      wineNftContractAddress,
      WineNFTABI.abi,
      provider
    );
    try {
      const allWines = await contract.getAllWines();
      const formattedWines = allWines.map((wine) => ({
        id: wine.wineId.toNumber(),
        producer: wine.producer,
        price: ethers.utils.formatEther(wine.price),
        vintage: wine.vintage,
        grapeVariety: wine.grapeVariety,
        numberOfBottles: wine.numberOfBottles,
        maturityDate: new Date(
          wine.maturityDate.toNumber() * 1000
        ).toLocaleDateString(),
        redeemed: wine.redeemed,
        owner: wine.owner,
      }));
      setWinesRetrieved(formattedWines);
      toast.success("Wines fetched successfully");
    } catch (error) {
      toast.error("Error fetching wines:", error);
    }
  };

  
  useEffect(() => {
    fetchWines();
  }, []);
  const value = {
    user,
    setUser,
    winesRetrieved
  };
  return (
      <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
