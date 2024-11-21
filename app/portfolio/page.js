"use client";
import { useState, useEffect } from "react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ethers } from "ethers";
import WineNFTABI from "@/abi/WineNFT.json";

const WINE_NFT_ADDRESS = process.env.NEXT_PUBLIC_WINE_NFT_ADDRESS;

const Page = () => {
    const [ownedWines, setOwnedWines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);
    const [currentOwner, setCurrentOwner] = useState("");

    const portfolioHistory = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: 2 + Math.random() * 0.5 * (Math.sin(i / 3) + 1),
    }));

    const fetchOwnedNFTs = async () => {
        try {
            if (!window.ethereum) {
                console.error("Ethereum provider is not available.");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const wineNFTContract = new ethers.Contract(
                WINE_NFT_ADDRESS,
                WineNFTABI.abi,
                provider
            );

            const totalNFTs = await wineNFTContract.getTotalNFTs();
            const allWines = await wineNFTContract.getAllWines();
            console.log("All Wines:", allWines);
            const userWines = [];

            for (let tokenId = 0; tokenId < totalNFTs; tokenId++) {
                try {
                    const owner = await wineNFTContract.ownerOf(tokenId);
                    console.log("Owner of", tokenId, "is", owner);
                    if (owner.toLowerCase() === userAddress.toLowerCase()) {
                        const wineData = await wineNFTContract.getWineById(
                            tokenId
                        );

                        userWines.push({
                            id: wineData.wineId.toString(),
                            name: wineData.wineName,
                            description: wineData.wineDescription,
                            price: parseFloat(
                                ethers.utils.formatEther(wineData.price)
                            ),
                            vintage: wineData.vintage,
                            region: wineData.grapeVariety,
                            maturityDate: new Date(
                                wineData.maturityDate.toNumber() * 1000
                            ), // Convert BigNumber to Date
                            owner: owner,
                            image: `/assets/WineNFT_${tokenId}.png`,
                            producer: wineData.producer,
                            redeemed: wineData.redeemed,
                        });
                    }
                } catch (err) {
                    console.warn(
                        `Token ${tokenId} does not exist or cannot fetch owner.`
                    );
                }
            }

            setOwnedWines(userWines);
            const total = userWines.reduce((sum, wine) => sum + wine.price, 0);
            setTotalValue(total);
        } catch (error) {
            console.error("Error fetching owned NFTs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnedNFTs();
    }, []);

    const redeemWine = async (wineId) => {
        try {
            if (!window.ethereum) {
                alert("Ethereum provider is not available");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const wineNFTContract = new ethers.Contract(
                WINE_NFT_ADDRESS,
                WineNFTABI.abi,
                signer
            );

            const tx = await wineNFTContract.redeemWine(wineId);
            await tx.wait();

            alert("Wine redeemed successfully! Producer will be in contact with you for delivery.");
            setOwnedWines((prevWines) =>
                prevWines.map((wine) =>
                    wine.id === wineId ? { ...wine, redeemed: true } : wine
                )
            );
            await fetchOwnedNFTs();
        } catch (error) {
            console.error("Error redeeming wine:", error);
            alert("An error occurred while redeeming the wine.");
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Portfolio Overview
                    </h2>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {totalValue.toFixed(2)} ETH
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Owned NFTs</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {ownedWines.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Current Owner
                            </p>
                            <p className="text-sm text-purple-600 break-all">
                                {currentOwner}
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-center h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                width={1400}
                                height={280}
                                data={portfolioHistory}
                            >
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    My Wine NFTs
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <p>Loading NFTs...</p>
                    ) : ownedWines.length > 0 ? (
                        ownedWines.map((wine) => (
                            <div
                                key={wine.id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                                    new Date(wine.maturityDate) <= new Date()
                                        ? "border-4 border-green-500"
                                        : "border"
                                }`}
                            >
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {wine.name}
                                    </h3>
                                    <img
                                        alt={`Wine NFT ${wine.id}`}
                                        className="w-full h-48 object-cover rounded-md"
                                        src={wine.image}
                                        style={{
                                            aspectRatio: "300/200",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <p className="mt-2 text-sm text-gray-600">
                                        Vintage: {wine.vintage}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Region: {wine.region}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Producer: {wine.producer}
                                    </p>
                                    <p className="mt-2 text-sm font-bold text-purple-600">
                                        Price: {wine.price} ETH
                                    </p>
                                    <p
                                        className={`text-sm mt-2 ${
                                            new Date(wine.maturityDate) <=
                                            new Date()
                                                ? "text-green-600 font-bold"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        Maturity Date:{" "}
                                        {wine.maturityDate.toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => redeemWine(wine.id)}
                                        disabled={
                                            new Date(wine.maturityDate) >
                                                new Date() || wine.redeemed
                                        }
                                        className={`mt-4 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                                            new Date(wine.maturityDate) <=
                                                new Date() && !wine.redeemed
                                                ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                                                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                        }`}
                                    >
                                        {wine.redeemed ? "Redeemed" : "Redeem"}
                                    </button>
                                    {new Date(wine.maturityDate) > new Date() &&
                                        !wine.redeemed && (
                                            <p className="text-red-500 text-sm mt-2">
                                                Maturity Date not reached
                                            </p>
                                        )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No NFTs owned.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Page;
