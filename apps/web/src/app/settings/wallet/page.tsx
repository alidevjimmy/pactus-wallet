'use client';
import React, { useState } from 'react';
import './style.css';
import { showPasswordIcon, copyIcon, successIcon } from '@/assets';
import Image from 'next/image';
import ShowPrivateKeyModal from '@/components/password-modal';
import PrivateKeyDisplayModal from '@/components/address-infom-modal';
import AddAccountModal from '@/components/add-account-modal';
import ConfirmModal from '@/components/confirm-modal';
import DeleteAccountModal from '@/components/delete-account-modal';
import { useAccount } from '@/wallet';
import type { AddressInfo } from '@/wallet/hooks/use-account';

const WalletManagerPage = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showDeletePasswordModal, setShowDeletePasswordModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const { getAccountList, deleteAccount } = useAccount();
  const accounts = getAccountList();
  const [copiedAddresses, setCopiedAddresses] = useState<{[key: string]: boolean}>({});

  const handleShowPrivateKey = (address: string) => {
    setSelectedAddress(address);
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = async (result: {
    privateKeyHex: string;
    address?: string;
    publicKey?: string;
    label?: string;
    path?: string;
  }) => {
    const info = {
      ...result,
      address: result.address ?? '',
      publicKey: result.publicKey ?? '',
      path: result.path ?? '',
      label: result.label ?? '',
      privateKeyHex: result.privateKeyHex
    };
    setAddressInfo(info);
    setShowPrivateKeyModal(true);
  };

  const handleDeleteClick = (address: string) => {
    setSelectedAddress(address);
    setShowDeletePasswordModal(true);
  };

  const handleDeletePasswordVerified = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAccount(selectedAddress);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
      // TODO: Show error message to user
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddresses(prev => ({ ...prev, [address]: true }));
    setTimeout(() => {
      setCopiedAddresses(prev => ({ ...prev, [address]: false }));
    }, 2000);
  };

  return (
    <div className="settings-content settings-content--full">
      <div className="account-header">
        <span className="account-count">{accounts.length} / <span className="account-count-max">200</span></span>
        <div className="account-separator"></div>
        <button className="add-account-button" onClick={() => setShowAddAccountModal(true)}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33203 8H12.6654" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Account
        </button>
      </div>

      <div className="settings-section">
        <div className="wallet-table">
          <div className="wallet-table-header">
            <div className="wallet-table-cell">Title</div>
            <div className="wallet-table-cell">Address</div>
            <div className="wallet-table-cell wallet-table-cell--right">Action</div>
          </div>
          <div className="wallet-table-body">
            {accounts.map((account, index) => (
              <div key={index} className="wallet-table-row">
                <div className="wallet-table-cell">
                  <div className="account-title">
                    <span className="account-emoji">{account.emoji}</span>
                    {account.name}
                  </div>
                </div>
                <div className="wallet-table-cell">
                  <div className="account-address-container">
                    <span className="account-address">{account.address}</span>
                    <button
                      className="copy-button"
                      onClick={() => handleCopyAddress(account.address)}
                      aria-label="Copy address to clipboard"
                      title="Copy address to clipboard"
                    >
                      <Image
                        src={copiedAddresses[account.address] ? successIcon : copyIcon}
                        alt={copiedAddresses[account.address] ? 'Copied successfully' : 'Copy to clipboard'}
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
                <div className="wallet-table-cell wallet-table-cell--right">
                  <div className="account-actions">
                    <button
                      className="action-button"
                      title="View Private Key"
                      onClick={() => handleShowPrivateKey(account.address)}
                    >
                      <Image src={showPasswordIcon} alt="" width={20} height={20} />
                    </button>
                    <button
                      className="action-button"
                      title="Delete Account"
                      onClick={() => handleDeleteClick(account.address)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.8504 9.14001L18.2004 19.21C18.0904 20.78 18.0004 22 15.2104 22H8.79039C6.00039 22 5.91039 20.78 5.80039 19.21L5.15039 9.14001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShowPrivateKeyModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordVerified={handlePasswordVerified}
        address={selectedAddress}
      />

      {addressInfo && (
        <PrivateKeyDisplayModal
          isOpen={showPrivateKeyModal}
          onClose={() => setShowPrivateKeyModal(false)}
          addressInfo={addressInfo}
          privateKeyHex={addressInfo.privateKeyHex}
        />
      )}

      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeletePasswordModal}
        onClose={() => setShowDeletePasswordModal(false)}
        onPasswordVerified={handleDeletePasswordVerified}
        address={selectedAddress}
      />

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default WalletManagerPage;
