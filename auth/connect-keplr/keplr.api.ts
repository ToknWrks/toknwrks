'use client';

import { Keplr } from '@keplr-wallet/types';
import cosmosHubChainInfo from '../chain-info/cosmos-hub.chain-info';

const getKeplr = (): Keplr | undefined => {
  if (typeof window !== 'undefined' && window.keplr) {
    return window.keplr as Keplr;
  }
  return undefined;
};

const enableKeplr = async () => {
  const keplr = getKeplr();

  if (!keplr) {
    alert('Keplr Wallet not found. Please install the extension.');
    return null;
  }

  // Request chain access
  await keplr.enable(cosmosHubChainInfo.chainId);
  const offlineSigner = keplr.getOfflineSigner(cosmosHubChainInfo.chainId);
  const accounts = await offlineSigner.getAccounts();

  return accounts.length ? accounts[0].address : null;
};

const getKeplrAccount = async () => {
  const keplr = getKeplr();
  if (!keplr) return null;

  const offlineSigner = keplr.getOfflineSigner(cosmosHubChainInfo.chainId);
  const accounts = await offlineSigner.getAccounts();

  return accounts.length ? accounts[0].address : null;
};

 // Request Atom Balance 
export const getAtomBalance = async (address: string): Promise<string | null> => {
  const response = await fetch(`https://lcd-cosmoshub.keplr.app/cosmos/bank/v1beta1/balances/${address}`);
  if (!response.ok) {
    console.error('Failed to fetch balance:', response.statusText);
    return null;
  }

  const data = await response.json();
  const atomBalance = data.balances.find((balance: any) => balance.denom === 'uatom');
  
  return atomBalance ? (parseFloat(atomBalance.amount) / 1e6).toFixed(2) : '0';
};

export const connectKeplr = async () => {
  const keplr = getKeplr();
  if (!keplr) {
    alert('Please install Keplr Wallet');
    return;
  }

  await keplr.enable(cosmosHubChainInfo.chainId);
  const key = await keplr.getKey(cosmosHubChainInfo.chainId);

  return key.address;
};

// Retrieve list of Atom Delegations 
export const getAtomDelegations = async (address: string): Promise<any[] | null> => {
  if (!address) return null;

  try {
    const response = await fetch(`https://lcd-cosmoshub.keplr.app/cosmos/staking/v1beta1/delegations/${address}`);

    if (!response.ok) {
      console.error('Failed to fetch ATOM delegations:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Check if delegation responses are available
    if (!data.delegation_responses) {
      console.error('No delegation data found:', data);
      return null;
    }

    return data.delegation_responses;
  } catch (error) {
    console.error('Error fetching ATOM delegations:', error);
    return null;
  }
};


export { enableKeplr, getKeplrAccount };



