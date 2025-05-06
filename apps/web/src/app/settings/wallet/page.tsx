'use client';
import React, { useState } from 'react';
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
    <div className="w-full bg-surface-medium rounded-lg shadow-inner overflow-hidden">
      <div className="flex items-center justify-end gap-4 p-4 border-b border-[#1D2328]">
        <span className="text-[#858699] text-xs">
          {accounts.length} / <span className="text-[#4C4F6B]">200</span>
        </span>
        <div className="w-px h-5 bg-[#2C2D3C]"></div>
        <button
          className="flex items-center gap-1.5 py-1.5 px-3 bg-[#1D2328] rounded-lg text-white text-xs hover:bg-[#2A2F36] transition-colors"
          onClick={() => setShowAddAccountModal(true)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33203 8H12.6654" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Account
        </button>
      </div>

      <div className="p-4">
        <div className="w-full rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr,3fr,1fr] gap-4 px-4 py-3 text-[#858699] text-xs font-medium border-b border-[#1D2328]">
            <div>Title</div>
            <div>Address</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-[#1D2328]">
            {accounts.map((account, index) => (
              <div key={index} className="grid grid-cols-[2fr,3fr,1fr] gap-4 px-4 py-3 hover:bg-[#1D2328] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{account.emoji}</span>
                  <span className="text-[#D2D3E0] text-sm">{account.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#858699] text-sm font-medium truncate bg-gradient-to-r from-[#00CC99] to-[#009966] bg-clip-text text-transparent">{account.address}</span>
                    <button
                    className="p-1 hover:bg-[#2A2F36] rounded-md transition-colors"
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
                <div className="flex items-center justify-end gap-2">
                    <button
                    className="p-1.5 hover:bg-[#2A2F36] rounded-md transition-colors"
                      title="View Private Key"
                      onClick={() => handleShowPrivateKey(account.address)}
                    >
                      <Image src={showPasswordIcon} alt="" width={20} height={20} />
                    </button>
                    <button
                    className="p-1.5 hover:bg-[#2A2F36] rounded-md transition-colors text-[#858699] hover:text-[#FF4940]"
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
