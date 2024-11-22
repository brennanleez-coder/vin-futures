# Steps after compiling smart contracts
1. Deploy the smart contracts to the blockchain locally
2. Take the contract addresses and place into .env file, with the following names:
    NEXT_PUBLIC_WINE_NFT_ADDRESS,
    NEXT_PUBLIC_WINE_MARKETPLACE_ADDRESS,
    NEXT_PUBLIC_WINE_PRODUCER_ADDRESS,
    NEXT_PUBLIC_WINE_DISTRIBUTOR_ADDRESS
3. Add ABI files to the abi folder in root directory (WineDistributor.json, WineMarketplace.json, WineNFT.json and WineProducer.json)
4. Run the frontend (npm run dev)

# Steps to run the frontend
1. Install the dependencies
```bash
npm install
```
2. Run the frontend
```bash
npm run dev
```

