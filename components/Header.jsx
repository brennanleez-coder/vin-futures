'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Grape, Home, Menu, ShoppingCart, User, Wine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useGlobalContext } from '@/context/GlobalContext';
const Header = () => {
    const { user, setUser } = useGlobalContext()

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setUser(accounts[0]);
                console.log(accounts[0]);
            } catch (error) {
                console.error("Connection error:", error);
            }
        } else {
            toast.error("Please install MetaMask to connect your wallet.");
        }
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center md:hidden">
                <Menu className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 flex justify-end">
                {/* <Input className="max-w-md" placeholder="Search for Wine NFTs..." type="search" /> */}
                {user ? (
                    <span className="text-gray-800 font-semibold">{`Connected: ${user.slice(0, 6)}...${user.slice(-4)}`}</span>
                ) : (
                    <Button className="ml-4" variant="outline" onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Header;
