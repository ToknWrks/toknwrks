'use client';

import { useState, useEffect } from 'react';
import { enableKeplr, getAtomBalance, getAtomDelegations, getAtomRewards, claimRewards } from '@/auth/connect-keplr/keplr.api';

const Connect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [atomBalance, setAtomBalance] = useState<string | null>(null);
  const [atomPrice, setAtomPrice] = useState<number | null>(null);
  const [totalValueUSD, setTotalValueUSD] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<any[] | null>(null);
  const [validatorRewards, setValidatorRewards] = useState<any[]>([]);
  const [totalStaked, setTotalStaked] = useState<number | null>(0);
  const [validatorNames, setValidatorNames] = useState<{ [key: string]: string }>({});
  const [totalUnclaimedRewards, setTotalUnclaimedRewards] = useState<number | null>(null);

  const handleKeplrConnect = async () => {
    if (isConnected) {
      setAccount(null);
      setAtomBalance(null);
      setDelegations(null);
      setValidatorRewards([]);
      setTotalStaked(0);
      setTotalUnclaimedRewards(null);
      setIsConnected(false);
      return;
    }

    try {
      const address = await enableKeplr();
      if (address) {
        setAccount(address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Keplr Connection Error:', error);
    }
  };

  const handleClaimRewards = async () => {
    if (!account) return;
    try {
      await claimRewards(account);
      alert('Rewards claimed successfully!');
      setTotalUnclaimedRewards(0); // Reset total rewards after claiming
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    }
  };

  const fetchAtomPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=usd');
      const data = await response.json();
      setAtomPrice(data.cosmos.usd);
    } catch (error) {
      console.error('Failed to fetch ATOM price:', error);
    }
  };

  const fetchValidatorName = async (validatorAddress: string) => {
    try {
      const response = await fetch(`https://lcd-cosmoshub.keplr.app/cosmos/staking/v1beta1/validators/${validatorAddress}`);
      const data = await response.json();
      return data.validator.description.moniker;
    } catch (error) {
      console.error(`Failed to fetch validator name for ${validatorAddress}:`, error);
      return 'Unknown Validator';
    }
  };

  const fetchAllValidatorNames = async (validators: any[]) => {
    const names: { [key: string]: string } = {};
    for (const validator of validators) {
      const name = await fetchValidatorName(validator.validator);
      names[validator.validator] = name;
    }
    setValidatorNames(names);
  };

  useEffect(() => {
    const fetchBalanceAndDelegations = async () => {
      if (account) {
        try {
          const balance = await getAtomBalance(account);
          setAtomBalance(balance);

          const delegationsWithNames = await getAtomDelegations(account);
          if (delegationsWithNames) {
            setDelegations(delegationsWithNames);

            const totalStakedAmount = delegationsWithNames.reduce((sum: number, delegation: any) => {
              return sum + parseFloat(delegation.amount);
            }, 0);
            setTotalStaked(totalStakedAmount);

            const rewards = await getAtomRewards(account);
            let totalRewards = 0;

            const rewardsByValidator = rewards
              .map((validatorReward: any) => {
                const totalValidatorReward = validatorReward.reward?.reduce((acc: number, reward: any) => {
                  return acc + parseFloat(reward.amount) / 1e14;
                }, 0) || 0;

                totalRewards += totalValidatorReward; // Accumulate total rewards

                return totalValidatorReward > 0
                  ? { validator: validatorReward.validator_address, reward: totalValidatorReward.toFixed(6) }
                  : null;
              })
              .filter(Boolean);

            setValidatorRewards(rewardsByValidator);
            setTotalUnclaimedRewards(totalRewards); // Set total unclaimed rewards
            await fetchAllValidatorNames(rewardsByValidator);
          } else {
            setValidatorRewards([]);
            setTotalUnclaimedRewards(0);
          }

          await fetchAtomPrice();
        } catch (error) {
          console.error('Failed to fetch Atom balance, delegations, or rewards:', error);
        }
      }
    };

    if (isConnected) {
      fetchBalanceAndDelegations();
    }
  }, [account, isConnected]);

  useEffect(() => {
    if (atomBalance && atomPrice !== null) {
      const balanceInNumber = parseFloat(atomBalance || '0');
      const totalStakedValue = (totalStaked || 0) * atomPrice;
      const availableValue = balanceInNumber * atomPrice;
      setTotalValueUSD((totalStakedValue + availableValue).toFixed(2));
    }
  }, [atomBalance, atomPrice, totalStaked]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h3 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              
            </h3>
          </div>
          {isConnected && (
            <div className="space-y-5">
              <div className="usd-display text-lg">
                <strong>Total Value</strong> ${totalValueUSD || 'Loading...'}
              </div>
              <div className="text-lg text-gray-700">
                <strong>Available:</strong> {atomBalance || 'Loading...'} ATOM | ${(parseFloat(atomBalance || '0') * (atomPrice || 0)).toFixed(2) || 'Loading...'}
              </div>
              <div className="text-lg text-gray-700 mt-4">
                <strong>Staked ATOM:</strong> {totalStaked !== null ? totalStaked.toFixed(6) : 'Loading...'} ATOM | {totalStaked !== null ? `$${(totalStaked * (atomPrice || 0)).toFixed(2)}` : 'Loading...'}
              </div>

              <div className="mt-8 relative">
                <h2 className="text-lg font-semibold">
                  Rewards by Delegation ({totalUnclaimedRewards || 'Loading...'} ATOM)
                </h2>
                <ul className="space-y-4 mt-4">
                  {validatorRewards.map((reward, index) => (
                    <li
                      key={index}
                      className="p-4 rounded-lg shadow bg-gray-800 text-white"
                    >
                      <div className="text-lg font-semibold">
                        Validator: {validatorNames[reward.validator] || 'Loading...'}
                      </div>
                      <div>
                        <strong>Rewards:</strong> {reward.reward} ATOM
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="claim bg-gradient-to-t from-indigo-600 to-indigo-500 text-white hover:bg-indigo-600 mt-6 rounded-md"
                  onClick={handleClaimRewards}
                >
                  Claim
                </button>
              </div>
            </div>
          )}
          <div className="mt-6">
            <button
              className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 text-white"
              onClick={handleKeplrConnect}
            >
              {isConnected ? 'Disconnect' : 'Connect Keplr'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connect;
