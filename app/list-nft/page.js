"use client"
import { useState, useEffect } from "react"
import { Grape, Home, Menu, ShoppingCart, User, Wine, Upload } from 'lucide-react'
import Link from "next/link"
import { useGlobalContext } from "@/context/GlobalContext";
import {toast } from "react-toastify";

const Page = () => {
  const { winesRetrieved, setWinesRetrieved } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vintage: "",
    region: "",
    price: "",
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
      
    //   const priceInWei = ethers.utils.parseEther(formData.price);
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //   const contract = new ethers.Contract(
    //     process.env.REACT_APP_WINE_NFT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    //     WineNFTABI.abi,
    //     signer
    //   );

    //   const tx = await contract.listWine(
    //     formData.name,
    //     formData.description,
    //     parseInt(formData.vintage),
    //     formData.region,
    //     priceInWei
    //   );

    //   await tx.wait(); // Wait for the transaction to be mined

      const newWine = {
        id: winesRetrieved.length + 1,
        producer: "xxxxx", // adjust based on the smart contract logic
        price: formData.price,
        vintage: formData.vintage,
        grapeVariety: formData.description,
        numberOfBottles: 1,
        maturityDate: new Date().toLocaleDateString(),
        redeemed: false,
        owner: "xxxx" // await signer.getAddress(),
      };

      setWinesRetrieved((prev) => [...prev, newWine]);
      toast.success("Wine NFT listed successfully!");
      setFormData({ name: "", description: "", vintage: "", region: "", price: "" }); 
      print(winesRetrieved)
    } catch (error) {
      console.error("Error listing NFT:", error);
      toast.error("Failed to list Wine NFT. Please try again.");
    }
  };
  useEffect(() => {
    console.log("Updated winesRetrieved:", winesRetrieved);
  }, [winesRetrieved]);


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                NFT Details
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    NFT Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g. Chateau Digital Reserve 2023"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g. 2023"
                  />
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    id="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g. Blockchain Valley"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g. 0.5"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    // type="submit"
                    disabled={!formData.name || !formData.description || !formData.vintage || !formData.region || !formData.price}
                    onClick={handleSubmit}
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
