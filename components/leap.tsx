// components/Swaps.js
import { useEffect, useRef, useState } from 'react'
import '@leapwallet/elements'

// Extend the Window interface to include LeapElements
declare global {
  interface Window {
    LeapElements: any;
  }
}

interface Chain {
  chainId: string;
  assetDenoms: string[];
}

interface DefaultValues {
  sourceChainId: string;
  sourceAsset: string;
  destinationChainId: string;
  destinationAsset: string;
}

interface SwapsProps {
  clientId?: string;
  integratorId?: string;
  isTestnet?: boolean;
  allowedSourceChains?: Chain[];
  allowedDestinationChains?: Chain[];
  defaultValues?: DefaultValues;
}

const Swaps: React.FC<SwapsProps> = ({
  clientId = 'your-client-id',
  integratorId = 'your-integrator-id',
  isTestnet = false,
  allowedSourceChains = [
    {
      chainId: 'cosmoshub-4',
      assetDenoms: ['uatom'],
    },
  ],
  allowedDestinationChains = [
    {
      chainId: 'osmosis-1',
      assetDenoms: ['uosmo'],
    },
  ],
  defaultValues = {
    sourceChainId: 'cosmoshub-4',
    sourceAsset: 'uatom',
    destinationChainId: 'osmosis-1',
    destinationAsset: 'uosmo',
  },
}) => {
  const [isElementsReady, setIsElementsReady] = useState(false)
  const isElementsMounted = useRef(false)

  const connectWallet = () => {
    // trigger your dApp's connect wallet flow
  }

  const [connectedWalletType, setConnectedWalletType] = useState(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.LeapElements) {
      console.log('LeapElements is already loaded')
      setIsElementsReady(true)
      setConnectedWalletType(window.LeapElements.WalletType.LEAP)
      return
    }

    const onLoadCallback = () => {
      console.log('LeapElements has loaded')
      setIsElementsReady(true)
      setConnectedWalletType(window.LeapElements.WalletType.LEAP)
    }
    window.addEventListener('@leapwallet/elements:load', onLoadCallback)

    // Fallback to manually set isElementsReady if the event listener does not work
    setTimeout(() => {
      if (!isElementsReady && window.LeapElements) {
        console.log('Fallback: Manually setting isElementsReady')
        setIsElementsReady(true)
        setConnectedWalletType(window.LeapElements.WalletType.LEAP)
      }
    }, 5000)

    return () => {
      window.removeEventListener('@leapwallet/elements:load', onLoadCallback)
    }
  }, [isElementsReady])

  useEffect(() => {
    if (isElementsReady && !isElementsMounted.current) {
      isElementsMounted.current = true
      try {
        console.log('Mounting LeapElements with the following props:', {
          connectWallet,
          connectedWalletType,
          isTestnet,
          allowedSourceChains,
          allowedDestinationChains,
          defaultValues,
          clientId,
          integratorId,
        })
        window.LeapElements?.mount({
          connectWallet,
          connectedWalletType,
          isTestnet,
          element: {
            name: 'aggregated-swaps',
            props: {
              allowedSourceChains,
              allowedDestinationChains,
              defaultValues,
            },
          },
          enableSmartSwap: true,
          clientId,
          integratorId,
          elementsRoot: '#leap-elements-container',
        })
        console.log('LeapElements mounted successfully')
      } catch (error) {
        console.error('Error mounting LeapElements:', error)
      }
    } else {
      console.log('isElementsReady:', isElementsReady, 'isElementsMounted.current:', isElementsMounted.current)
    }
  }, [
    connectWallet,
    connectedWalletType,
    isElementsReady,
    allowedSourceChains,
    allowedDestinationChains,
    defaultValues,
    clientId,
    integratorId,
    isTestnet,
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...')
        const response = await fetch('/api/leap');
        if (!response.ok) {
          if (response.status === 500) {
            console.error('Internal Server Error: Please try again later.');
          } else {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
        }
        const data = await response.json();
        console.log('Data fetched from API:', data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchData();
  }, [])

  return isElementsReady ? (
    <div
      id="leap-elements-container"
      className="leap-ui dark h-full w-full rounded-xl"
    />
  ) : (
    <p>Loading...</p>
  )
}

export default Swaps
