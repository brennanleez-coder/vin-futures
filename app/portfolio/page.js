"use client";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Page = () => {
  const [selectedWine, setSelectedWine] = useState(null);

  // Mock data
  const ownedWines = [
    {
      id: 1,
      name: "Chateau Digital Reserve",
      vintage: 2021,
      region: "Blockchain Valley",
      rarity: "Rare",
      rarityScore: 95,
      price: 1.2,
      image: "/assets/WineNFT_1.png",
    },
    {
      id: 2,
      name: "Pixel Pinot Noir",
      vintage: 2022,
      region: "Crypto Countryside",
      rarity: "Uncommon",
      rarityScore: 88,
      price: 0.8,
      image: "/assets/WineNFT_2.png",
    },
    {
      id: 3,
      name: "Ethereum Estate Cabernet",
      vintage: 2020,
      region: "DeFi Vineyards",
      rarity: "Common",
      rarityScore: 82,
      price: 0.5,
      image: "/assets/WineNFT_3.png",
    },
  ];

  const portfolioHistory = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: 2 + Math.random() * 0.5 * (Math.sin(i / 3) + 1),
  }));
  const totalValue = ownedWines.reduce((sum, wine) => sum + wine.price, 0);

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
          </div>

          {/* Responsive LineChart */}
          <div className="w-full flex items-center justify-center h-64"> {/* Adjusted height as needed */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart width={1400} height={280} data={portfolioHistory}>
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
          {ownedWines.map((wine) => (
            <div
              key={wine.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 relative">
                <h3 className="text-lg font-semibold text-gray-800">
                  {wine.name}
                </h3>
                <span
                  className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full ${
                    wine.rarity === "Rare"
                      ? "bg-red-100 text-red-800"
                      : wine.rarity === "Uncommon"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {wine.rarity}
                </span>
              </div>
              <div className="p-4">
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
                  Vintage: {wine.vintage}
                </p>
                <p className="text-sm text-gray-600">Region: {wine.region}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Rarity Score: {wine.rarityScore}/100
                </p>
              </div>
              <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                <span className="text-lg font-semibold text-purple-600">
                  {wine.price} ETH
                </span>
                <button
                  onClick={() => setSelectedWine(wine.id)}
                  className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-600 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
