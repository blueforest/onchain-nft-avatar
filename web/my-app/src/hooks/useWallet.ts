'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  account: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useWallet = () => {
  
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    balance: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // 检查MetaMask是否已安装
  const checkIfMetaMaskInstalled = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return true;
    }
    return false;
  }, []);

  // 获取当前账户信息
  const getAccountInfo = useCallback(async (provider: ethers.BrowserProvider) => {
    try {
      const accounts = await provider.send('eth_accounts', []);
      console.log(accounts)
      if (accounts.length > 0) {
        const account = accounts[0];
        const network = await provider.getNetwork();
        const signer = await provider.getSigner(); 
        
        console.log('network signer',account)
        const balance = await provider.getBalance(account);
        console.log('balance',balance)
 
        setWalletState(prev => ({
          ...prev,
          account,
          balance: ethers.formatEther(balance),
          chainId: Number(network.chainId),
          isConnected: true,
          error: null,
        }));
      } else {
        setWalletState(prev => ({
          ...prev,
          account: null,
          balance: null,
          chainId: null,
          isConnected: false,
        }));
      }
    } catch (error) {
      console.error('Error getting account info:', error);
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to get account information',
      }));
    }
  }, []);

  // 连接MetaMask钱包
  const connectWallet = useCallback(async () => {
    if (!checkIfMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask first.',
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // 请求连接钱包
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        await getAccountInfo(provider);
      } else {
        setWalletState(prev => ({
          ...prev,
          isConnecting: false,
        }));
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect wallet',
        isConnecting: false,
      }));
    }
  }, [checkIfMetaMaskInstalled, getAccountInfo]);

  // 断开连接
  const disconnectWallet = useCallback(() => {
    setWalletState(prev => ({
      ...prev,
      account: null,
      balance: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    }));
  }, []);

  // 初始化逻辑
  useEffect(() => {

    // 确保在客户端环境
    if (typeof window === 'undefined') {
      return;
    }
    
    const initializeWallet = async () => {
      try {
        if (!checkIfMetaMaskInstalled()) {
          // MetaMask 未安装，直接设置为已初始化
          setWalletState(prev => ({ ...prev }));
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            getAccountInfo(provider);
          }
        };

        const handleChainChanged = () => {
          getAccountInfo(provider);
        };

        // 监听事件
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        // 获取初始账户信息
        await getAccountInfo(provider);

        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      } catch (error) {
        console.error('Error initializing wallet:', error);
        // 即使出错也要设置为已初始化
        setWalletState(prev => ({ ...prev }));
      }
    };

    initializeWallet();
  }, []); // 移除所有依赖项，只在组件挂载时执行一次

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    checkIfMetaMaskInstalled,
  };
};