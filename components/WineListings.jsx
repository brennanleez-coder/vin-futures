"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ethers } from "ethers";
import WineMarketplaceABI from "@/abi/WineMarketplace.json";
import WineNFTABI from "@/abi/WineNFT.json";
import WineDistributorABI from "@/abi/WineDistributor.json";
import { useGlobalContext } from "@/context/GlobalContext";

const WINE_MARKETPLACE_ADDRESS =
    process.env.NEXT_PUBLIC_WINE_MARKETPLACE_ADDRESS;
const WINE_NFT_ADDRESS = process.env.NEXT_PUBLIC_WINE_NFT_ADDRESS;

const generatePriceHistory = (basePrice) => {
    return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        price:
            basePrice + Math.random() * 0.1 * basePrice * (Math.sin(i / 3) + 1),
    }));
};

export default function WinesPage() {
    const [selectedWine, setSelectedWine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wines, setWines] = useState([]);
    const { user, setUser } = useGlobalContext();
    const [isClient, setIsClient] = useState(false);

    const openModal = (wine) => {
        setSelectedWine(wine);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWine(null);
    };

    const checkBuyerOrSeller = async (address) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(
                process.env.NEXT_PUBLIC_RPC_URL
            );
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && user?.address) {
            checkBuyerOrSeller(user.address);
        }
    }, [user?.address, isClient]);

    // Move fetchListedNFTs outside useEffect so it can be reused
    const fetchListedNFTs = async () => {
        if (!window.ethereum) {
            console.error("Ethereum provider is not available.");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wineMarketplaceContract = new ethers.Contract(
            WINE_MARKETPLACE_ADDRESS,
            WineMarketplaceABI.abi,
            provider
        );
        const wineNFTContract = new ethers.Contract(
            WINE_NFT_ADDRESS,
            WineNFTABI.abi,
            provider
        );

        try {
            // Fetch all listed NFTs from the marketplace
            const listedNFTs = await wineMarketplaceContract.getAllListedNFTs();

            // Fetch metadata for each listed NFT
            const updatedWines = await Promise.all(
                listedNFTs.map(async (nft, index) => {
                    const wineMetadata = await wineNFTContract.getWineById(
                        nft.tokenId
                    ); // Fetch wine details
                    const priceHistory = generatePriceHistory(
                        parseFloat(ethers.utils.formatEther(nft.price))
                    );

                    return {
                        id: nft.tokenId.toString(),
                        price: ethers.utils.formatEther(nft.price),
                        seller: nft.seller,
                        name: wineMetadata.wineName,
                        description: wineMetadata.wineDescription,
                        grapeVariety: wineMetadata.grapeVariety,
                        vintage: wineMetadata.vintage,
                        numberOfBottles: wineMetadata.numberOfBottles,
                        region: "Unknown",
                        maturityDate: new Date(
                            wineMetadata.maturityDate * 1000
                        ).toLocaleDateString(),
                        image: `assets/WineNFT_${index + 1}.png`, // Replace with actual image logic
                        priceHistory,
                    };
                })
            );

            setWines(updatedWines);
        } catch (error) {
            console.error("Error fetching listed NFTs:", error);
        }
    };

    // Call fetchListedNFTs in useEffect
    useEffect(() => {
        fetchListedNFTs();
    }, []);

    const handleBuy = async (tokenId, price) => {
        if (!window.ethereum) {
            alert("Ethereum provider is not available");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const wineNFTContract = new ethers.Contract(
                WINE_NFT_ADDRESS,
                WineNFTABI.abi,
                signer
            );

            const marketplaceAddress =
                process.env.NEXT_PUBLIC_WINE_MARKETPLACE_ADDRESS;

            // Set approval for the marketplace to transfer NFTs
            const setApprovalTx = await wineNFTContract.setApprovalForAll(
                marketplaceAddress,
                true
            );
            await setApprovalTx.wait();

            const wineDistributorAddress =
                process.env.NEXT_PUBLIC_WINE_DISTRIBUTOR_ADDRESS;
            const wineDistributorContract = new ethers.Contract(
                wineDistributorAddress,
                WineDistributorABI.abi,
                signer
            );

            // Call the buyWine function in the WineDistributor contract
            const tx = await wineDistributorContract.buyWine(tokenId, {
                value: ethers.utils.parseEther(price.toString()),
            });
            await tx.wait();

            alert("NFT purchased successfully!");

            // Refresh the list of NFTs
            await fetchListedNFTs();
        } catch (error) {
            console.error("Error buying NFT:", error);
            alert("An error occurred while trying to buy the NFT.");
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                    Featured Wine NFTs
                </h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {wines.map((wine) => (
                        <Card
                            key={wine.id}
                            className="bg-white cursor-pointer"
                            onClick={() => openModal(wine)}
                        >
                            <CardHeader>
                                <CardTitle>{wine.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    alt={`Wine NFT ${wine.id}`}
                                    className="w-full h-48 object-cover rounded-md"
                                    height="200"
                                    src={wine.image}
                                    style={{
                                        aspectRatio: "300/200",
                                        objectFit: "contain",
                                    }}
                                    width="300"
                                />
                                <p className="mt-2 text-sm text-gray-600">
                                    Description: {wine.description}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Vintage: {wine.vintage}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Number of Bottles: {wine.numberOfBottles}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Maturity Date: {wine.maturityDate}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Seller: {wine.seller}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <span className="text-lg font-semibold text-blue-600">
                                    {wine.price} ETH
                                </span>
                                {user?.isBuyer ? (
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleBuy(wine.id, wine.price)
                                        }
                                    >
                                        Buy NFT
                                    </Button>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        You are not a buyer
                                    </p>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
