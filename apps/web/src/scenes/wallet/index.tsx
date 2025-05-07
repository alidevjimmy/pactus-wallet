'use client';
import React, { Suspense, useState } from 'react';
import './style.css';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import Image from 'next/image';
import { copyIcon, showPasswordIcon, simpleLogo, successIcon, searchIcon, transactions } from '@/assets';
import SendPac from '@/components/send';
import BridgePac from '@/components/bridge';
import QRCode from 'react-qr-code';
import { useAccount, AddressInfo } from '@/wallet/hooks/use-account';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBalance } from '@/wallet/hooks/use-balance';
import ShowPrivateKeyModal from '@/components/password-modal';
import PrivateKeyDisplayModal from '@/components/address-infom-modal';
import TransactionsHistory from '@/components/transactions-history';
import DeleteAccountModal from '@/components/delete-account-modal';
import ConfirmModal from '@/components/confirm-modal';

const Wallet = () => {
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showDeletePasswordModal, setShowDeletePasswordModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [addressInfo, setAddressInfo] = useState<(AddressInfo & { privateKeyHex: string }) | null>(
    null
  );
  const { getAccountByAddress, deleteAccount } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams?.get('address') ?? '';
  const addressData = address ? getAccountByAddress(address) : null;
  const { balance } = useBalance(addressData?.address);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressData?.address ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowPrivateKey = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = (result: {
    privateKeyHex: string;
    address?: string;
    publicKey?: string;
    label?: string;
    path?: string;
  }) => {
    const addressInfo = {
      ...result,
      address: result.address ?? '',
      publicKey: result.publicKey ?? '',
      path: result.path ?? '',
      label: result.label ?? '',
    } as AddressInfo & { privateKeyHex: string };
    setAddressInfo(addressInfo);
    setShowPrivateKeyModal(true);
  };

  const handleDeleteClick = () => {
    if (addressData?.address) {
      setShowDeletePasswordModal(true);
    }
  };

  const handleDeletePasswordVerified = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (addressData?.address) {
        await deleteAccount(addressData.address);
        setShowDeleteConfirmModal(false);
        router.replace('/');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Suspense fallback={<div className="wallet__loading">Loading...</div>}>
      <main className="wallet">
        <Sidebar />
        <div className="wallet__content">
          <Header title={`🤝 ${addressData?.label ?? ''}`} />

          <section className="wallet__balance-card">
            <div className="wallet__balance-container">
              <div className="wallet__account-info">
                <div className="wallet__qr-code">
                  <QRCode
                    value={addressData?.address ?? ''}
                    size={214}
                    level="H"
                    aria-label="QR code for wallet address"
                  />
                </div>

                <div className="wallet__details">
                  <div className="balance-container">
                    <h2 className="wallet__balance-heading">Balance</h2>
                    <button className="wallet__show-private-key" onClick={handleShowPrivateKey}>
                      <Image src={showPasswordIcon} alt="" width={24} height={24} />
                    </button>
                    <button
                      className="wallet__delete-account"
                      onClick={handleDeleteClick}
                      aria-label="Delete account"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="#FF4940" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF4940" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.8504 9.14001L18.2004 19.21C18.0904 20.78 18.0004 22 15.2104 22H8.79039C6.00039 22 5.91039 20.78 5.80039 19.21L5.15039 9.14001" stroke="#FF4940" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.3301 16.5H13.6601" stroke="#FF4940" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 12.5H14.5" stroke="#FF4940" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>


                    </button>
                  </div>

                  <div className="wallet__balance-amount">
                    <Image src={simpleLogo} alt="Pactus logo" className="wallet__currency-icon" />
                    <p className="wallet__balance-value">{balance}</p>
                    <span className="wallet__currency-code">PAC</span>
                  </div>

                  <p className="wallet__balance-fiat">≈ 0 USD</p>

                  <div className="wallet__address-container">
                    <h3 className="wallet__address-label">Account Address:</h3>

                    <div className="wallet__address-row">
                      <span className="wallet__address-value text-truncate" id="wallet-address">
                        {addressData?.address ?? ''}
                      </span>
                      <button
                        className="wallet__copy-button"
                        onClick={handleCopy}
                        aria-label="Copy address to clipboard"
                        title="Copy address to clipboard"
                      >
                        <Image
                          src={copied ? successIcon : copyIcon}
                          alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                          width={25}
                          height={25}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="wallet__actions">
                    <SendPac />
                    <BridgePac />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="wallet__activity">
            <div className="wallet__activity-header">
              <h2 className="wallet__activity-title">Activity</h2>

              <div className="wallet__activity-search">
                <label htmlFor="search-account-transactions" className="visually-hidden">
                  Search transactions
                </label>
                <Image
                  src={searchIcon}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="wallet__search-icon"
                />
                <input
                  id="search-account-transactions"
                  className="wallet__search-input"
                  type="search"
                  placeholder="Search by tx hash or address"
                />
              </div>

              <div className="wallet__activity-filters">
                <button type="button" className="wallet__filter-button" aria-pressed="false">
                  1D
                </button>
                <button type="button" className="wallet__filter-button" aria-pressed="false">
                  7D
                </button>
                <button
                  type="button"
                  className="wallet__filter-button wallet__filter-button--active"
                  aria-pressed="true"
                >
                  All
                </button>
              </div>
            </div>

            <hr className="wallet__divider" />

            <div className="wallet__transactions-list">
              <TransactionsHistory transactions={transactions} height={'90%'} />
            </div>
          </section>
        </div>

        <ShowPrivateKeyModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onPasswordVerified={handlePasswordVerified}
          address={addressData?.address ?? ''}
        />

        {addressInfo && (
          <PrivateKeyDisplayModal
            isOpen={showPrivateKeyModal}
            onClose={() => setShowPrivateKeyModal(false)}
            addressInfo={addressInfo}
            privateKeyHex={addressInfo.privateKeyHex ?? ''}
          />
        )}

        <DeleteAccountModal
          isOpen={showDeletePasswordModal}
          onClose={() => setShowDeletePasswordModal(false)}
          onPasswordVerified={handleDeletePasswordVerified}
          address={addressData?.address ?? ''}
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
      </main>
    </Suspense>
  );
};

export default Wallet;
