import { connectWallet } from '../lib/wallet';

const WalletButton = () => {
  const handleConnectWallet = async () => {
    const walletData = await connectWallet();
    if (walletData) {
      // Store wallet data in your app's state management (e.g., Redux, Context API)
      console.log('Wallet connected:', walletData);
    }
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleConnectWallet}
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;