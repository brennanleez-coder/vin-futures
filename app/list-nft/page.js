'use client';
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

// Import contract ABIs
import WineProducerABI from "@/abi/WineProducer.json";
import WineMarketplaceABI from "@/abi/WineMarketplace.json";
import WineNFTABI from "@/abi/WineNFT.json";

const Page = () => {
  const { winesRetrieved, setWinesRetrieved } = useGlobalContext();
  const router = useRouter();

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
      if (!window.ethereum) {
        toast.error("Ethereum provider is not available.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const wineProducerAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"; // Change accordingly
      const wineMarketplaceAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Change accordingly

      // Connect to the WineProducer contract
      const wineProducerContract = new ethers.Contract(
        wineProducerAddress,
        WineProducerABI.abi,
        signer
      );

      // Call createWineNFT in WineProducer.sol
      const priceInWei = ethers.utils.parseEther(formData.price);
      const vintage = parseInt(formData.vintage);
      const numberOfBottles = 1; // This can be dynamic if required
      const maturityDate = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 365; // 1 year from now

      const tx = await wineProducerContract.createWineNFT(
        priceInWei,
        vintage,
        formData.description,
        numberOfBottles,
        maturityDate,
        { value: priceInWei, gasLimit : 500000 } // Pass ETH to create the NFT
      );

      await tx.wait(); // Wait for the transaction to be mined

      // Connect to the WineMarketplace contract
      const wineMarketplaceContract = new ethers.Contract(
        wineMarketplaceAddress,
        WineMarketplaceABI.abi,
        signer
      );

      // List the NFT in WineMarketplace
      const listTx = await wineMarketplaceContract.listNFT(
        tx, // wineId
        priceInWei // price to list the NFT for
      );

      await listTx.wait(); // Wait for the transaction to be mined

      // Add the new wine to the local state
      const newWine = {
        id: wineId, // Assuming wineId returned from contract is the unique identifier
        producer: await signer.getAddress(),
        price: formData.price,
        vintage: formData.vintage,
        grapeVariety: formData.description,
        numberOfBottles: numberOfBottles,
        maturityDate: new Date(maturityDate * 1000).toLocaleDateString(),
        redeemed: false,
        owner: await signer.getAddress(),
      };

      setWinesRetrieved((prev) => [...prev, newWine]);
      toast.success("Wine NFT listed successfully!");
      setFormData({ name: "", description: "", vintage: "", region: "", price: "" });
      router.push("/"); // Redirect to home page

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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">NFT Details</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">NFT Name</label>
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
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
                  <label htmlFor="vintage" className="block text-sm font-medium text-gray-700">Vintage</label>
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
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (ETH)</label>
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
                    type="submit"
                    disabled={!formData.name || !formData.description || !formData.vintage || !formData.region || !formData.price}
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
