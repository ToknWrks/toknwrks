import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BalanceContextType {
  atomBalance: string | null;
  setAtomBalance: (balance: string) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [atomBalance, setAtomBalance] = useState<string | null>(null);

  return (
    <BalanceContext.Provider value={{ atomBalance, setAtomBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
