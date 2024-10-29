// utils/cosmos.js
import { Keplr } from '@keplr-wallet/types';
import { CosmosSDK } from '@cosmjs/cosmos';

const CHAIN_ID = 'cosmoshub-4'; // Update with your desired chain ID
const ATOM_DENOM = 'uatom';

const getKeplr = async () => {
  if (!window.keplr) {
    alert('Please install Keplr Wallet');
    return null;
  }
  return window.keplr as Keplr;
};

const get Cosmos = async (keplr: Keplr) => {
  const chainId = CHAIN_ID;
  const rpcEndpoint = `https://${chainId}.api.cosmos.network/`;
  return new CosmosSDK(rpcEndpoint, chainId);
};

const getAtomBalance = async (cosmos: CosmosSDK, address: string) => {
  const balance = await cosmos.bank.balance(address, ATOM_DENOM);
  return balance.amount.toString();
};

export const connectKeplrAndQueryBalance = async () => {
  const keplr = await getKeplr();
  if (!keplr) return null;

  await keplr.enable(CHAIN_ID);
  const cosmos = await getCosmos(keplr);
  const address = keplr.keyRing.getKey(CHAIN_ID).address;
  const balance = await getAtomBalance(cosmos, address);
  return balance;
};