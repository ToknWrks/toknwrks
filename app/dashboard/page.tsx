"use client";

import { useState, useEffect } from 'react';
import { enableKeplr, getAtomBalance, getAtomDelegations } from '/auth/Connect-Keplr/keplr.api';

export default function Connect() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [atomBalance, setAtomBalance] = useState<string | null>(null);
  const [atomPrice, setAtomPrice] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<any[] | null>(null);

  const handleKeplrConnect = async () => {
    if (isConnected) {
      // Disconnect logic
      setAccount(null);
      setAtomBalance(null);
      setDelegations(null);
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

  const fetchAtomPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=usd');
      const data = await response.json();
      setAtomPrice(data.cosmos.usd);
    } catch (error) {
      console.error('Failed to fetch ATOM price:', error);
    }
  };

  useEffect(() => {
    const fetchBalanceAndDelegations = async () => {
      if (account) {
        try {
          const balance = await getAtomBalance(account);
          setAtomBalance(balance);

          // Fetch delegations
          const delegations = await getAtomDelegations(account);
          setDelegations(delegations);

          // Fetch price and calculate USD value
          await fetchAtomPrice();
        } catch (error) {
          console.error('Failed to fetch Atom balance, delegations, or price:', error);
        }
      }
    };

    if (isConnected) {
      fetchBalanceAndDelegations();
    }
  }, [account, isConnected]);

  useEffect(() => {
    if (atomBalance && atomPrice) {
      const usdValueCalc = (parseFloat(atomBalance) * atomPrice).toFixed(2);
      setUsdValue(usdValueCalc);
    }
  }, [atomBalance, atomPrice]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              {/* Your title here */}
            </h1>
          </div>
          <form className="mx-auto max-w-[400px]" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-5">
              {isConnected && (
                <>
                  <div className="text-lg text-gray-700">
                    <strong>Balance:</strong> {atomBalance || 'Loading...'} ATOM
                  </div>
                  <div className="usd-display text-lg">
                    <strong>USD:</strong> ${usdValue || 'Loading...'}
                  </div>
                  <div className="text-lg text-gray-700 mt-4">
                    <strong>Delegations:</strong>
                    <ul className="list-disc ml-5">
                      {delegations && delegations.length > 0 ? (
                        delegations.map((delegation, index) => (
                          <li key={index}>
                            Validator: {delegation.delegation.validator_address}, Amount: {parseFloat(delegation.balance.amount) / 1e6} ATOM
                          </li>
                        ))
                      ) : (
                        <p>No delegations found</p>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 space-y-5">
              <button
                className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                onClick={handleKeplrConnect}
              >
                {isConnected ? 'Disconnect' : 'Connect Keplr'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
