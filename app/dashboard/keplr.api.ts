import { Keplr } from '@keplr-wallet/types';

// Function to enable Keplr wallet
const enableKeplr = async () => {
  if (typeof window !== 'undefined' && window.keplr) {
    try {
      await window.keplr.enable('cosmoshub-4'); // Replace 'cosmoshub-4' with your app's chain ID
      console.log("Keplr enabled");
    } catch (error) {
      console.error("Keplr enable error:", error);
    }
  } else {
    alert('Please install Keplr wallet extension');
  }
};

// Function to get the Keplr account
const getKeplrAccount = async () => {
  if (typeof window !== 'undefined' && window.keplr) {
    try {
      const offlineSigner = window.keplr.getOfflineSigner('cosmoshub-4');
      const accounts = await offlineSigner.getAccounts();
      return accounts[0];
    } catch (error) {
      console.error("Keplr account error:", error);
    }
  }
  return null;
};

// Function to get Keplr account balance
const getKeplrBalance = async (account: any) => {
  if (typeof window !== 'undefined' && window.keplr) {
    try {
      const balance = await window.keplr.getBalance(account.address, 'uatom');
      return balance;
    } catch (error) {
      console.error("Keplr balance error:", error);
    }
  }
  return null;
};

// Define `window.keplr` type globally to avoid TypeScript errors
declare global {
  interface Window {
    keplr: Keplr; // Specific type from `@keplr-wallet/types`
  }
}

export { enableKeplr, getKeplrAccount, getKeplrBalance };
