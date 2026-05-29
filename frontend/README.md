# ERC20 Token Frontend

A simple React application to interact with your upgradeable ERC20 token contract.

## Features

- **MetaMask Wallet Connection**: Connect your MetaMask wallet to interact with the contract
- **Display Wallet Address**: Shows your connected wallet address
- **Token Balance Display**: View your current token balance
- **Mint Tokens (Owner Only)**: Mint new tokens to any address (restricted to contract owner)
- **Burn Tokens (V2 Feature)**: Burn your tokens - demonstrates the new Version 2 functionality

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Update Contract Address**:
   - Open `frontend/src/App.js`
   - Replace `YOUR_CONTRACT_ADDRESS_HERE` with your deployed contract address from the deployment script
   - The address is logged when you run `npm run deploy` in the main project

3. **Start the Application**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   - The app will open at `http://localhost:3000`

## Usage

1. Click "Connect MetaMask" to connect your wallet
2. Your wallet address and token balance will be displayed
3. If you are the contract owner, you can mint tokens to any address
4. Any user can burn their own tokens (V2 feature)

## Contract ABI

The app uses a minimal ABI with the following functions:
- `balanceOf(address owner)` - Get token balance
- `mint(address to, uint256 amount)` - Mint tokens (owner only)
- `burn(uint256 amount)` - Burn tokens (V2 feature)
- `owner()` - Get contract owner
- `decimals()` - Get token decimals
- `symbol()` - Get token symbol
- `name()` - Get token name

## Important Notes

- Make sure MetaMask is installed in your browser
- Ensure you're connected to the correct network (same as your deployed contract)
- The contract address must be updated before the app will work
- Minting is restricted to the contract owner only
- Burning is available to all token holders (V2 feature)
