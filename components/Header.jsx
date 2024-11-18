"use client";
import React, { useState, useEffect } from "react";
import { Grape, Home, Menu, ShoppingCart, User, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";
import WineMarketplaceABI from "@/abi/WineMarketplace.json";
import { ethers } from "ethers";

const LOCAL_RPC_URL = "http://localhost:8545";
const buyers = [];
const sellers = ["0x13e9b432c498500ab70c3628108085086d740df6"];

const Header = () => {
  const { user, setUser } = useGlobalContext();
  const [isClient, setIsClient] = useState(false); // Flag to ensure client-only rendering

  // Check if the current user is a buyer or seller
  const checkBuyerOrSeller = async (address) => {
    // const wineMarketplaceContractAddress =
    //     "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
    // const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
    // const contract = new ethers.Contract(
    //     wineMarketplaceContractAddress,
    //     WineMarketplaceABI.abi,
    //     provider
    // );
    // const isBuyer = await contract.isBuyer(address);
    // const isSeller = await contract.isSeller(address);
    // console.log("isBuyer:", isBuyer);
    // console.log("isSeller:", isSeller);
    // setUser({ ...user, isBuyer, isSeller });
    // console.log("User:", user);

    const isBuyer = buyers.includes(address);
    const isSeller = sellers.includes(address);
    setUser((prevUser) => ({
      ...prevUser,
      address,
      isBuyer,
      isSeller,
    }));

    console.log(`Address: ${address}`);
    console.log("isBuyer:", isBuyer);
    console.log("isSeller:", isSeller);
  };

  // Connect the user's wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUser({
          address: accounts[0],
        });
        await checkBuyerOrSeller(accounts[0]);
        toast.success("Wallet connected successfully!");
      } catch (error) {
        toast.error("Error connecting wallet:", error);
      }
    } else {
      toast.error("Please install MetaMask to connect your wallet.");
    }
  };

  // Ensure client-only rendering
  useEffect(() => {
    setIsClient(true); // This ensures we don't run dynamic logic during SSR
  }, []);

  useEffect(() => {
    if (isClient && user?.address) {
      checkBuyerOrSeller(user.address);
    }
  }, [user?.address, isClient]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center md:hidden">
        <Menu className="h-6 w-6 text-gray-600" />
      </div>
      <div className="flex-1 flex justify-end">
        {/* <Input className="max-w-md" placeholder="Search for Wine NFTs..." type="search" /> */}
        {isClient && user ? ( // Ensure the content only renders after the client is ready
          <span className="text-gray-800 font-semibold">{`${
            user?.isBuyer
              ? "Buyer"
              : user?.isSeller
              ? "Seller"
              : "Not a Buyer or Seller"
          } - Connected: ${user?.address.slice(0, 6)}...${user?.address.slice(
            -4
          )}`}</span>
        ) : (
          <Button
            className="ml-4"
            variant="outline"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
