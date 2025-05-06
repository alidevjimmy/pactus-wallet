// WalletProvider.tsx
'use client';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Wallet, WalletManager } from '@pactus-wallet/wallet';
import { NetworkType, NetworkValues, BrowserStorage, initWalletSDK } from '@pactus-wallet/wallet';
import type { WalletContextType } from '../types';
import { WalletStatus } from '../types';
import Loading from '@/components/loading';
import WalletLock from '@/components/wallet-lock';

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {
    /* Will be implemented in provider */
  },
  walletStatus: WalletStatus.WALLET_LOCKED,
  setWalletStatus: () => {
    /* Will be implemented in provider */
  },
  password: '',
  setPassword: () => {
    /* Will be implemented in provider */
  },
  mnemonic: '',
  setMnemonic: () => {
    /* Will be implemented in provider */
  },
  networkType: NetworkValues.MAINNET,
  setNetworkType: () => {
    /* Will be implemented in provider */
  },
  walletName: '',
  setWalletName: () => {
    /* Will be implemented in provider */
  },
  walletManager: null,
  isInitializingManager: true,
  managerError: null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletStatus, setWalletStatusState] = useState<WalletStatus>(WalletStatus.WALLET_LOCKED);
  const [password, setPasswordState] = useState<string>('');
  const [mnemonic, setMnemonicState] = useState<string>('');
  const [networkType, setNetworkTypeState] = useState<NetworkType>(NetworkValues.MAINNET);
  const [walletName, setWalletNameState] = useState<string>('');
  const [walletManager, setWalletManager] = useState<WalletManager | null>(null);
  const [isInitializingManager, setIsInitializingManager] = useState<boolean>(true);
  const [managerError, setManagerError] = useState<string | null>(null);
  const router = useRouter();

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Initialize wallet manager and handle stored wallet status
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // Initialize the wallet manager
        const manager = await setupWallet();
        setWalletManager(manager);
        setManagerError(null);

        // Load the first wallet
        const walletData = await manager.loadFirstWallet();

        // Get wallet status from storage
        const storedWalletStatus = localStorage.getItem('walletStatus') as WalletStatus;

        if (!walletData) {
          setWalletStatusState(WalletStatus.WALLET_LOCKED);
          router.replace('/get-started');
          setIsInitializingManager(false);
          return;
        }

        // Set the wallet data regardless of status
        const walletName = walletData.getName();
        setWalletNameState(walletName);
        setWallet(walletData);

        // Set the status after wallet is loaded
        if (storedWalletStatus === WalletStatus.WALLET_LOCKED ||
            storedWalletStatus === WalletStatus.WALLET_UNLOCKED) {
          setWalletStatusState(storedWalletStatus);
        } else {
          setWalletStatusState(WalletStatus.WALLET_LOCKED);
        }

        // Handle navigation
        if (window.location.pathname === '/get-started') {
          router.replace('/');
        }
      } catch (err) {
        console.error('Failed to initialize wallet:', err);
        setManagerError(err instanceof Error ? err.message : 'Failed to initialize wallet manager');
        setWalletStatusState(WalletStatus.WALLET_LOCKED);
        router.replace('/get-started');
      } finally {
        setIsInitializingManager(false);
      }
    };

    initializeWallet();
  }, [router]);

  // Update wallet status and handle navigation
  const setWalletStatus = async (value: WalletStatus) => {
    localStorage.setItem('walletStatus', value);
    setWalletStatusState(value);

    if (value === WalletStatus.WALLET_LOCKED) {
      // When locking, clear sensitive data but keep wallet instance
      setPasswordState('');
      setMnemonicState('');
    } else if (value === WalletStatus.WALLET_UNLOCKED && !wallet && walletManager) {
      try {
        const walletData = await walletManager.loadFirstWallet();
        if (walletData) {
          setWallet(walletData);
        } else {
          throw new Error('No wallet found');
        }
      } catch (error) {
        console.error('Failed to load wallet:', error);
        setWalletStatusState(WalletStatus.WALLET_LOCKED);
        setPasswordState('');
        setMnemonicState('');
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
        walletStatus,
        setWalletStatus,
        password,
        setPassword: setPasswordState,
        mnemonic,
        setMnemonic: setMnemonicState,
        networkType,
        setNetworkType: setNetworkTypeState,
        walletName,
        setWalletName: setWalletNameState,
        walletManager,
        isInitializingManager,
        managerError,
      }}
    >
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {walletStatus === WalletStatus.WALLET_LOCKED ? (
            <WalletLock />
          ) : (
            children
          )}
        </>
      )}
    </WalletContext.Provider>
  );
}
async function setupWallet(): Promise<WalletManager> {
  const storage = new BrowserStorage();
  const walletManager = await initWalletSDK(storage);
  return walletManager;
}
