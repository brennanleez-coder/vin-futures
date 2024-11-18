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
  const [redeemWine, setRedeemWine] = useState(null);

  const today = new Date();
  const oneMonthFromToday = new Date();
  oneMonthFromToday.setMonth(today.getMonth() + 1);

  const oneWeekFromToday = new Date();
  oneWeekFromToday.setDate(today.getDate() + 7);

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
      maturityDate: oneMonthFromToday,
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
      maturityDate: oneWeekFromToday,
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
      maturityDate: today,
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

          <div className="w-full flex items-center justify-center h-64">
            {" "}
            {/* Adjusted height as needed */}
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
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                new Date(wine.maturityDate).toDateString() ===
                new Date().toDateString()
                  ? "border-4 border-green-500"
                  : new Date(wine.maturityDate) - new Date() <=
                      7 * 24 * 60 * 60 * 1000 &&
                    new Date(wine.maturityDate) - new Date() > 0
                  ? "border-4 border-yellow-500"
                  : new Date(wine.maturityDate) - new Date() <=
                      30 * 24 * 60 * 60 * 1000 &&
                    new Date(wine.maturityDate) - new Date() > 0
                  ? "border-4 border-blue-500"
                  : ""
              }`}
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
                <p
                  className={`text-sm mt-2 ${
                    new Date(wine.maturityDate).toDateString() ===
                    new Date().toDateString()
                      ? "text-green-600 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  Maturity Date: {wine.maturityDate.toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm font-bold text-purple-600">
                  Status:{" "}
                  {new Date(wine.maturityDate) <= new Date()
                    ? "Matured"
                    : "Not Matured"}
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
                {new Date(wine.maturityDate).toDateString() ===
                  new Date().toDateString() && (
                  <button
                    onClick={() => setRedeemWine(wine)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Redeem Now
                  </button>
                )}
              </div>
            </div>
          ))}
          {redeemWine && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Confirm Redemption
                  </h2>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to redeem{" "}
                    <strong>{redeemWine.name}</strong>?
                  </p>
                  <img
                    alt={`Wine NFT ${redeemWine.id}`}
                    className="w-full h-64 object-contain rounded-md mb-4"
                    src={redeemWine.image}
                  />
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => setRedeemWine(null)} // Close the modal
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert(`Redeemed ${redeemWine.name}`);
                      setRedeemWine(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wine Details Modal */}
          {selectedWine !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {ownedWines.find((w) => w.id === selectedWine)?.name}
                  </h2>
                </div>
                <div className="p-4">
                  <img
                    alt={`Wine NFT ${selectedWine}`}
                    className="w-full h-64 object-contain rounded-md mb-4"
                    src={ownedWines.find((w) => w.id === selectedWine)?.image}
                  />
                  <p className="text-sm text-gray-600">
                    Vintage:{" "}
                    {ownedWines.find((w) => w.id === selectedWine)?.vintage}
                  </p>
                  <p className="text-sm text-gray-600">
                    Region:{" "}
                    {ownedWines.find((w) => w.id === selectedWine)?.region}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rarity:{" "}
                    {ownedWines.find((w) => w.id === selectedWine)?.rarity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rarity Score:{" "}
                    {ownedWines.find((w) => w.id === selectedWine)?.rarityScore}
                    /100
                  </p>
                  <p className="text-lg font-semibold text-purple-600 mt-2">
                    Value:{" "}
                    {ownedWines.find((w) => w.id === selectedWine)?.price} ETH
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setSelectedWine(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
