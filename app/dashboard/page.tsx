'use client';

import { useState } from 'react';

const VultisigConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [osmoBalance, setOsmoBalance] = useState(null);
  const [error, setError] = useState(null);

  const RPC_ENDPOINT = 'https://rpc.osmosis.zone';

  const connectVultisig = async () => {
    if (!window.vulticonnect) {
      setError("Vultisig Connect extension not found. Please install or enable it.");
      return;
    }

    try {
      // Trigger the connection flow
      const result = await window.vulticonnect.connect({
        chainId: 'osmosis-1', // Osmosis chain ID
        requiredMethods: ['cosmos_signTransaction'],
      });

      if (result && result.account) {
        setAccount(result.account);
        setIsConnected(true);
        fetchOsmoBalance(result.account.address); // Fetch balance after connection
      } else {
        throw new Error("Failed to retrieve account information.");
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to connect: ${err.message}`);
    }
  };

  const fetchOsmoBalance = async (address) => {
    try {
      const response = await fetch(`${RPC_ENDPOINT}/cosmos/bank/v1beta1/balances/${address}`);
      const data = await response.json();
      const osmo = data.balances.find((balance) => balance.denom === 'uosmo');
      setOsmoBalance((parseInt(osmo?.amount || '0') / 1e6).toFixed(6));
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch OSMO balance: ${err.message}`);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setOsmoBalance(null);
    setIsConnected(false);
  };

  return (
    <div className="vultisig-container">
      <h3 className="text-2xl font-semibold">Connect to Osmosis with Vultisig</h3>
      {isConnected ? (
        <div className="connected-state">
          <p>
            <strong>Connected Account:</strong> {account.address}
          </p>
          <p>
            <strong>OSMO Balance:</strong> {osmoBalance || 'Loading...'} OSMO
          </p>
          <button
            className="btn bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="btn bg-indigo-500 hover:bg-indigo-600 text-white rounded px-4 py-2"
          onClick={connectVultisig}
        >
          Connect Vultisig
        </button>
      )}
      {error && (
        <p className="text-red-500 mt-4">
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
};

export default VultisigConnect;
