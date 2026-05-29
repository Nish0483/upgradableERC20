import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x7CAbF9CA3a38D1e8282ce68c3f52208d8fbe04A9"; // the proxy address used here which will be permanent even after upgrade
const CONTRACT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function owner() view returns (address)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const checkIfWalletConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await loadNetworkInfo();
          await loadContractData(accounts[0]);
        }
      }
    } catch (error) {
      console.error("Error checking wallet:", error);
      setError("Failed to check wallet connection");
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await loadNetworkInfo();
        await loadContractData(accounts[0]);
        setError("");
      } else {
        setError("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance("0");
    setIsOwner(false);
    setOwnerAddress("");
    setTokenSymbol("");
    setTokenName("");
    setNetworkName("");
    setChainId("");
    setError("");
  };

  const loadNetworkInfo = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());
      
      const networkNames = {
        "11155111": "Sepolia",
        "1": "Ethereum Mainnet",
        "5": "Goerli",
        "137": "Polygon",
        "80001": "Mumbai",
        "56": "BSC",
        "97": "BSC Testnet"
      };
      setNetworkName(networkNames[network.chainId.toString()] || `Chain ID: ${network.chainId.toString()}`);
    } catch (error) {
      console.error("Error loading network info:", error);
    }
  };

  const loadContractData = async (userAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const [userBalance, ownerAddr, symbol, name] = await Promise.all([
        contract.balanceOf(userAddress),
        contract.owner(),
        contract.symbol(),
        contract.name()
      ]);
      
      setBalance(ethers.formatEther(userBalance));
      setIsOwner(ownerAddr.toLowerCase() === userAddress.toLowerCase());
      setOwnerAddress(ownerAddr);
      setTokenSymbol(symbol);
      setTokenName(name);
    } catch (error) {
      console.error("Error loading contract data:", error);
      setError("Failed to load contract data. Make sure you are in seploia network");
    }
  };

  const refreshBalance = async () => {
    if (account) {
      await loadContractData(account);
    }
  };

  const handleMint = async () => {
    if (!mintAddress || !mintAmount) {
      setError("Please fill in all mint fields");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const amountWei = ethers.parseEther(mintAmount);
      const tx = await contract.mint(mintAddress, amountWei);
      await tx.wait();
      
      setMintAmount("");
      setMintAddress("");
      await refreshBalance();
      alert("Tokens minted successfully!");
    } catch (error) {
      console.error("Error minting:", error);
      setError("Failed to mint tokens. Make sure you are the owner.");
    } finally {
      setLoading(false);
    }
  };

  const handleBurn = async () => {
    if (!burnAmount) {
      setError("Please enter burn amount");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const amountWei = ethers.parseEther(burnAmount);
      const tx = await contract.burn(amountWei);
      await tx.wait();
      
      setBurnAmount("");
      await refreshBalance();
      alert("Tokens burned successfully!");
    } catch (error) {
      console.error("Error burning:", error);
      setError("Failed to burn tokens. Make sure you have sufficient balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        {error && <div className="error">{error}</div>}
        
        <div className="card">
          <h2>Wallet Connection</h2>
          {account ? (
            <div className="wallet-info">
              <p><strong>Connected Address:</strong></p>
              <p className="address">{account}</p>
              <p><strong>Network:</strong> {networkName} (Chain ID: {chainId})</p>
              <p><strong>Your Balance:</strong> {balance} {tokenSymbol}</p>
              {isOwner && <p className="owner-badge">You are the Owner</p>}
              <button onClick={disconnectWallet} className="connect-btn">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              Connect MetaMask
            </button>
          )}
        </div>

        {account && (
          <>
            <div className="card">
              <h2>Token Info</h2>
              <p><strong>Name:</strong> {tokenName}</p>
              <p><strong>Symbol:</strong> {tokenSymbol}</p>
              <p><strong>Contract Address(proxy):</strong> {CONTRACT_ADDRESS}</p>
              <p><strong>Owner Address:</strong> {ownerAddress}</p>
            </div>

            {isOwner && (
              <div className="card">
                <h2>Mint Tokens (Owner Only) V1</h2>
                <div className="form-group">
                  <label>Recipient Address:</label>
                  <input
                    type="text"
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="Amount to mint"
                  />
                </div>
                <button onClick={handleMint} disabled={loading} className="action-btn">
                  {loading ? "Processing..." : "Mint Tokens"}
                </button>
              </div>
            )}

            <div className="card v2-feature">
              <h2>Burn Tokens (V2 Feature)</h2>
              <div className="form-group">
                <label>Amount to Burn:</label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="Amount to burn"
                />
              </div>
              <button onClick={handleBurn} disabled={loading} className="action-btn burn-btn">
                {loading ? "Processing..." : "Burn Tokens"}
              </button>
            </div>

            <button onClick={refreshBalance} className="refresh-btn">
              Refresh Balance
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
