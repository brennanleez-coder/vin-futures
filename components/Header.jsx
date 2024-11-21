"use client";
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";
import WineMarketplaceABI from "@/abi/WineMarketplace.json";
import { ethers } from "ethers";

const LOCAL_RPC_URL = "http://localhost:8545";
const WINE_MARKETPLACE_ADDRESS = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

const Header = () => {
  const { user, setUser } = useGlobalContext();
  const [isClient, setIsClient] = useState(false);

  const checkBuyerOrSeller = async (address) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
      const contract = new ethers.Contract(
        WINE_MARKETPLACE_ADDRESS,
        WineMarketplaceABI.abi,
        provider
      );

      const isBuyer = await contract.isBuyer(address);
      const isSeller = await contract.isSeller(address);

      setUser({ address, isBuyer, isSeller });
      console.log("User Roles:", { address, isBuyer, isSeller });
    } catch (error) {
      console.error("Error checking roles:", error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          WINE_MARKETPLACE_ADDRESS,
          WineMarketplaceABI.abi,
          signer
        );

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = accounts[0];

        await checkBuyerOrSeller(userAddress);

        toast.success("Wallet connected successfully!");
      } catch (error) {
        toast.error("Error connecting wallet.");
        console.error("Error:", error);
      }
    } else {
      toast.error("Please install MetaMask to connect your wallet.");
    }
  };

  // Ensure client-only rendering
  useEffect(() => {
    setIsClient(true);
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
        {isClient && user ? (
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
