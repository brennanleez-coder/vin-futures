'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import WineProducerABI from "@/abi/WineProducer.json";
import WineMarketplaceABI from "@/abi/WineMarketplace.json";
import WineNFTABI from "@/abi/WineNFT.json";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    wineName: '',
    wineDescription: '',
    vintage: '',
    price: '',
    grapeVariety: '',
    numberOfBottles: '',
    maturityDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!window.ethereum) {
        toast.error("Ethereum provider is not available.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const wineNFTAddress = process.env.NEXT_PUBLIC_WINE_NFT_ADDRESS;
      const wineMarketplaceAddress = process.env.NEXT_PUBLIC_WINE_MARKETPLACE_ADDRESS; 
      const wineProducerAddress = process.env.NEXT_PUBLIC_WINE_PRODUCER_ADDRESS; 

      const wineProducerContract = new ethers.Contract(
        wineProducerAddress,
        WineProducerABI.abi,
        signer
      );

      const priceInWei = ethers.utils.parseEther(formData.price);
      const vintage = parseInt(formData.vintage);
      const grapeVariety = formData.grapeVariety;
      const numberOfBottles = parseInt(formData.numberOfBottles);
      const maturityDate = Math.floor(new Date(formData.maturityDate).getTime() / 1000);

      const tx = await wineProducerContract.createWineNFT(
        formData.wineName,
        formData.wineDescription,
        priceInWei,
        vintage,
        grapeVariety,
        numberOfBottles,
        maturityDate,
        { value: ethers.utils.parseEther("0.01"), gasLimit: 1000000 }
      );

      const receipt = await tx.wait();
      const wineNFTCreatedEvent = receipt.events.find((event) => event.event === "WineNFTCreated");
      if (!wineNFTCreatedEvent) {
        throw new Error("WineNFTCreated event not found in transaction receipt.");
      }
      const wineId = wineNFTCreatedEvent.args.wineId.toNumber();

      console.log("Minted Wine NFT with Token ID:", wineId);

      const wineMarketplaceContract = new ethers.Contract(
        wineMarketplaceAddress,
        WineMarketplaceABI.abi,
        signer
      );

      const wineNFTContract = new ethers.Contract(
        wineNFTAddress,
        WineNFTABI.abi,
        signer
      );

      await wineNFTContract.approve(wineMarketplaceAddress, wineId);
      console.log(`Approved WineMarketplace to manage token ID: ${wineId}`);

      const listTx = await wineMarketplaceContract.listNFT(wineId, priceInWei);
      await listTx.wait();

      toast.success("Wine NFT successfully created and listed!");
    } catch (error) {
      console.error("Error creating and listing NFT:", error);
      toast.error("An error occurred while creating the NFT. Check the console for details.");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Create Wine NFT
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="wineName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Wine Name
                  </label>
                  <input
                    type="text"
                    name="wineName"
                    id="wineName"
                    value={formData.wineName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                    placeholder="e.g. Chateau Digital Reserve 2023"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wineDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Wine Description
                  </label>
                  <textarea
                    id="wineDescription"
                    name="wineDescription"
                    rows={3}
                    value={formData.wineDescription}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                    placeholder="Describe your Wine NFT"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="vintage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Vintage
                  </label>
                  <input
                    type="number"
                    name="vintage"
                    id="vintage"
                    value={formData.vintage}
                    onChange={handleChange}
                    min="1900"
                    max="2099"
                    step="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                    placeholder="e.g. 2023"
                  />
                </div>

                <div>
                  <label
                    htmlFor="grapeVariety"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grape Variety
                  </label>
                  <input
                    type="text"
                    name="grapeVariety"
                    id="grapeVariety"
                    value={formData.grapeVariety}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                    placeholder="e.g. Merlot"
                  />
                </div>

                <div>
                  <label
                    htmlFor="numberOfBottles"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Bottles
                  </label>
                  <input
                    type="number"
                    name="numberOfBottles"
                    id="numberOfBottles"
                    value={formData.numberOfBottles}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                    placeholder="e.g. 100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="maturityDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maturity Date
                  </label>
                  <input
                    type="date"
                    name="maturityDate"
                    id="maturityDate"
                    value={formData.maturityDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2"
                    placeholder="e.g. 0.5"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={
                      !formData.wineName ||
                      !formData.wineDescription ||
                      !formData.vintage ||
                      !formData.price ||
                      !formData.grapeVariety ||
                      !formData.numberOfBottles ||
                      !formData.maturityDate
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    List NFT for Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
