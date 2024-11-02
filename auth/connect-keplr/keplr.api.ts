'use client';

import { Keplr } from '@keplr-wallet/types';
import cosmosHubChainInfo from '../chain-info/cosmos-hub.chain-info';
import { SigningStargateClient } from '@cosmjs/stargate';

interface Reward {
  validator_address: string;
  reward: { amount: string; denom: string }[];
}

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

  await keplr.enable(cosmosHubChainInfo.chainId);
  const offlineSigner = keplr.getOfflineSigner(cosmosHubChainInfo.chainId);
  const accounts = await offlineSigner.getAccounts();

  return accounts.length ? accounts[0].address : null;
};

export const getAtomBalance = async (address: string): Promise<string | null> => {
  const response = await fetch(`https://lcd-cosmoshub.keplr.app/cosmos/bank/v1beta1/balances/${address}`);
  if (!response.ok) {
    console.error('Failed to fetch balance:', response.statusText);
    return null;
  }

  const data = await response.json();
  const atomBalance = data.balances.find((balance: any) => balance.denom === 'uatom');
  
  return atomBalance ? (parseFloat(atomBalance.amount) / 1e6).toFixed(1.9) : '0';
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

export const getAtomDelegations = async (address: string) => {
  try {
    const response = await fetch(
      `https://lcd-cosmoshub.keplr.app/cosmos/staking/v1beta1/delegations/${address}`
    );
    const delegationData = await response.json();

    console.log('Delegation response:', delegationData);

    const delegationsWithNames = await Promise.all(
      delegationData.delegation_responses.map(async (delegation: any) => {
        const validatorAddress = delegation.delegation.validator_address;
        const validatorResponse = await fetch(
          `https://lcd-cosmoshub.keplr.app/cosmos/staking/v1beta1/validators/${validatorAddress}`
        );
        const validatorData = await validatorResponse.json();
        const validatorName = validatorData.validator.description.moniker;

        console.log('Validator info:', validatorData);

        const amount = (parseFloat(delegation.balance.amount) / 1e6).toFixed(2);
        console.log('Delegation amount:', amount);

        return {
          amount,
          validatorAddress,
          validatorName,
        };
      })
    );

    return delegationsWithNames;
  } catch (error) {
    console.error('Error fetching Atom delegations:', error);
    return null;
  }
};

export async function getAtomRewards(address: string) {
  try {
    const response = await fetch(
      `https://lcd-cosmoshub.keplr.app/cosmos/distribution/v1beta1/delegators/${address}/rewards`
    );
    const data = await response.json();
    return data.rewards || [];
  } catch (error) {
    console.error("Failed to fetch staking rewards:", error);
    return [];
  }
}

export const getDelegationsWithRewards = async (address: string) => {
  const delegationsWithNames = await getAtomDelegations(address);
  const rewards = await getAtomRewards(address);

  if (delegationsWithNames && rewards) {
    return delegationsWithNames.map((delegation) => {
      const validatorRewards = rewards.find((reward: Reward) => reward.validator_address === delegation.validatorAddress);

      if (!validatorRewards || !validatorRewards.reward || !validatorRewards.reward[0]) {
        console.error('Invalid reward data');
        return { ...delegation, rewards: '0' };
      }

      const rewardAmount = validatorRewards.reward[0].amount;
      console.log('Reward amount:', rewardAmount);

      try {
        const parsedRewardAmount = parseFloat(rewardAmount) / 1e6;
        console.log('Parsed reward amount:', parsedRewardAmount);
        return { ...delegation, rewards: parsedRewardAmount.toFixed(6) };
      } catch (error) {
        console.error('Error parsing reward amount:', error);
        return { ...delegation, rewards: '0' };
      }
    });
  }

  return null;
};

// Claim Rewards Function
export const claimRewards = async (account: string) => {
  try {
    // Ensure Keplr is available
    if (!window.keplr) {
      throw new Error('Keplr extension is not available');
    }

    // Enable Keplr and get access to the Cosmos Hub
    await window.keplr.enable(cosmosHubChainInfo.chainId);
    const offlineSigner = window.keplr.getOfflineSigner(cosmosHubChainInfo.chainId);
    
    // Use the RPC URL from cosmosHubChainInfo
    const client = await SigningStargateClient.connectWithSigner(cosmosHubChainInfo.rpcEndpoint, offlineSigner);

    // Fetch the list of rewards to claim
    const rewards = await getAtomRewards(account);
    const rewardsToClaim = rewards.filter((reward: Reward) => reward.reward.length > 0);

    if (rewardsToClaim.length === 0) {
      console.log('No rewards available to claim.');
      return;
    }

    // Prepare the messages for claiming rewards
    const messages = rewardsToClaim.map((reward: Reward) => ({
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: {
        delegatorAddress: account,
        validatorAddress: reward.validator_address,
      },
    }));

    // Broadcast the transaction to claim rewards
    const fee = {
      amount: [{ denom: 'uatom', amount: '5000' }],
      gas: '200000',
    };
    const result = await client.signAndBroadcast(account, messages, fee);

    if (result.code === 0) {
      console.log('Rewards claimed successfully!');
    } else {
      console.error('Failed to claim rewards:', result.rawLog);
    }
  } catch (error) {
    console.error('Error claiming rewards:', error);
    throw new Error('Failed to claim rewards.');
  }
};

export { enableKeplr };
