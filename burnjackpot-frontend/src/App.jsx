import { useState, useEffect } from "react";
import { connectWallet, getBurnJackpotContract } from "./web3";
import { ethers } from "ethers";

function App() {
  const [signer, setSigner] = useState(null);
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [burnPrice, setBurnPrice] = useState("0.00");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    (async () => {
      const provider = connectWallet().catch(() => null);
      if (provider) {
        setSigner(provider);
        const contract = getBurnJackpotContract(provider);
        const price = await contract.burnPrice();
        setBurnPrice(ethers.utils.formatEther(price));
      }
    })();
  }, []);

  const handleBurn = async () => {
    if (!signer) return alert("Connecte ton wallet d'abord");
    const contract = getBurnJackpotContract(signer);
    const tx = await contract.burnNFT(nftAddress, tokenId, {
      value: ethers.utils.parseEther(burnPrice),
    });
    setTxHash(tx.hash);
    await tx.wait();
    alert("NFT brûlé ! Tx hash : " + tx.hash);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Burn & Jackpot</h1>
      <button
        onClick={async () => setSigner(await connectWallet())}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {signer ? "Wallet connecté" : "Connecter mon wallet"}
      </button>

      <div>
        <label>Adresse du contrat NFT</label>
        <input
          type="text"
          value={nftAddress}
          onChange={e => setNftAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label>Token ID</label>
        <input
          type="number"
          value={tokenId}
          onChange={e => setTokenId(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <p>Prix de brûlure : {burnPrice} ETH</p>
      </div>
      <button
        onClick={handleBurn}
        className="w-full px-4 py-2 bg-red-600 text-white rounded mt-2"
      >
        Brûler le NFT
      </button>

      {txHash && (
        <p className="mt-4">
          Tx hash :{" "}
          <a
            href={`https://explorer.berachain.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
