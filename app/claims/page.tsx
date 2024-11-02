"use client";

import { useState, useEffect } from "react";
import { enableKeplr } from "@/auth/connect-keplr/keplr.api";

const Connect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [rewardClaims, setRewardClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleKeplrConnect = async () => {
    if (isConnected) {
      setAccount(null);
      setRewardClaims([]);
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
      console.error("Keplr Connection Error:", error);
    }
  };

  const fetchAtomPriceHistory = async () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - 200 * 24 * 60 * 60 * 1000).getTime() / 1000;
    const endDate = currentDate.getTime() / 1000;

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/cosmos/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`
      );

      const data = await response.json();
      console.log("Price History Data:", data);
      return data.prices;
    } catch (error) {
      console.error("Failed to fetch ATOM price history:", error);
      return [];
    }
  };

  const fetchRewardClaimTransactionsWithUSDValue = async () => {
    if (!account) return;

    setLoading(true);
    const priceHistory: [number, number][] = await fetchAtomPriceHistory();

    try {
      const response = await fetch(
        `https://api.cosmos.network/cosmos/tx/v1beta1/txs?events=message.sender='${account}'`
      );
      if (!response.ok) throw new Error(`Error fetching transactions: ${response.status}`);
      const data = await response.json();
      console.log("Claim Transactions Data:", data);

      const claims = data.txs
        .filter((tx: any) =>
          tx.body.messages.some(
            (msg: any) =>
              msg["@type"] === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
          )
        )
        .map((tx: any) => {
          const claimMessage = tx.body.messages.find(
            (msg: any) =>
              msg["@type"] === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
          );

          const claimDate = new Date(tx.timestamp);
          const closestPrice = priceHistory.reduce(
            (prev: [number, number], curr: [number, number]) =>
              Math.abs(curr[0] - claimDate.getTime()) <
              Math.abs(prev[0] - claimDate.getTime())
                ? curr
                : prev
          );

          const amountClaimedInATOM = parseFloat(
            claimMessage.amount?.[0]?.amount || "0"
          ) / 1e6;
          const usdValueAtClaim = (amountClaimedInATOM * closestPrice[1]).toFixed(2);

          return {
            date: claimDate.toLocaleString(),
            amountClaimed: amountClaimedInATOM,
            usdValueAtClaim,
            validator: claimMessage.validator_address,
          };
        });

      console.log("Processed Claims:", claims);
      setRewardClaims(claims);
    } catch (error) {
      console.error("Failed to fetch reward claim transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchRewardClaimTransactionsWithUSDValue();
    }
  }, [account, isConnected]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="text-center">
            <h3 className="text-3xl font-semibold">Claimed Rewards</h3>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {rewardClaims.map((claim, index) => (
                <li key={index} className="mt-4 text-gray-800">
                  Date: {claim.date}, Claimed: {claim.amountClaimed} ATOM, USD Value: $
                  {claim.usdValueAtClaim}, Validator: {claim.validator}
                </li>
              ))}
            </ul>
          )}
          <button
            className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 text-white hover:bg-indigo-600 mt-6"
            onClick={handleKeplrConnect}
          >
            {isConnected ? "Disconnect" : "Connect Keplr"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Connect;
