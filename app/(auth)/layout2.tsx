"use client"

// app/layout.tsx
import type { ReactNode } from 'react';
import { connectKeplr, getKeplrAccount } from '../(auth)/connect-keplr/keplr.api';
import { useState, useEffect } from 'react';
import PageIllustration from "@/components/page-illustration";


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      const keplrAccount = await getKeplrAccount();
      if (keplrAccount) setAccount(keplrAccount[0].address);
    };
    fetchAccount();
  }, []);

  const handleConnectKeplr = async () => {
    setConnecting(true);
    try {
      const { account } = await connectKeplr();
      setAccount(account);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div>
      <header>
        {account ? (
          <p>Connected as {account}</p>
        ) : (
          <button onClick={handleConnectKeplr} disabled={connecting}>
            {connecting ? 'Connecting...' : 'Connect Keplr'}
          </button>
        )}
      </header>
         <main className="relative flex grow flex-col">
      <PageIllustration multiple />

      {children}
    </main>
    </div>
  );
};

export default Layout;