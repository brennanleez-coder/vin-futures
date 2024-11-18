"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { useGlobalContext } from "@/context/GlobalContext";

const generatePriceHistory = (basePrice) => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: basePrice + Math.random() * 0.1 * basePrice * (Math.sin(i / 3) + 1),
  }));
};

export default function WinesPage() {
  const [selectedWine, setSelectedWine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { winesRetrieved } = useGlobalContext();

  const winesWithPicture = winesRetrieved.map((wine, index) => {
    const priceHistory = generatePriceHistory(parseFloat(wine.price));
    return {
      ...wine,
      image: `assets/WineNFT_${index + 1}.png`,
      priceHistory,
    };
  });

  const openModal = (wine) => {
    console.log("Selected wine price history:", wine.priceHistory);
    setSelectedWine(wine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWine(null);
  };

  const handleBuy = () => {
    alert(`Successfully purchased ${selectedWine.name} for ${selectedWine.price} ETH!`);
    closeModal();
  };

  return (
    <>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Featured Wine NFTs</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {winesWithPicture.map((wine) => (
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
                  <p className="mt-2 text-sm text-gray-600">Vintage: {wine.vintage}</p>
                  <p className="text-sm text-gray-600">Region: {wine.region}</p>
                  <p className="text-sm text-gray-600">Maturity Date: {wine.maturityDate}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-lg font-semibold text-blue-600">{wine.price} ETH</span>
                  <Button variant="outline">Buy NFT</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {isModalOpen && selectedWine && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Price History for {selectedWine.name}
                </h2>
                {selectedWine.priceHistory && selectedWine.priceHistory.length > 0 ? (
                  <div style={{ width: "100%", height: 200 }}>
                    <LineChart width={400} height={200} data={selectedWine.priceHistory}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#3b82f6" />
                    </LineChart>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No price history available</p>
                )}
                <div className="flex justify-end mt-4 space-x-4">
                  <Button variant="destructive" onClick={closeModal}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={handleBuy}>
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
