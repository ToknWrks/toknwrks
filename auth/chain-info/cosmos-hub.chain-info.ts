// chain-info.ts

interface ChainInfo {
  chainId: string;
  chainName: string;
  rpcEndpoint: string;
  restEndpoint: string;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
  bip44: {
    coinType: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
  };
  currencies: [
    {
      coinDenom: string;
      coinMinimalDenom: string;
      coinDecimals: number;
    }
  ];
  feeCurrencies: [
    {
      coinDenom: string;
      coinMinimalDenom: string;
      coinDecimals: number;
    }
  ];
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
}

const cosmosHubChainInfo: ChainInfo = {
  chainId: 'cosmoshub-4',
  chainName: 'Cosmos Hub',
  rpcEndpoint: 'https://lcd-cosmoshub.keplr.app',
  restEndpoint: 'https://lcd-cosmoshub.keplr.app/rest',
  stakeCurrency: {
    coinDenom: 'ATOM',
    coinMinimalDenom: 'uatom',
    coinDecimals: 6,
  },
  bip44: {
    coinType: 118, // Cosmos Hub coin type
  },
  bech32Config: {
    bech32PrefixAccAddr: 'cosmos',
    bech32PrefixAccPub: 'cosmospub',
    bech32PrefixValAddr: 'cosmosvaloper',
    bech32PrefixValPub: 'cosmosvaloperpub',
  },
  currencies: [
    {
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
    },
  ],
  gasPriceStep: {
    low: 0.01, // 0.01 uatom per gas unit (adjust according to market conditions)
    average: 0.025, // 0.025 uatom per gas unit (adjust according to market conditions)
    high: 0.05, // 0.05 uatom per gas unit (adjust according to market conditions)
  },
};

export default cosmosHubChainInfo;