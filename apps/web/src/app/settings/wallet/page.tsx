'use client';
import React, { useState } from 'react';
import { useWallet } from '@/wallet';
import './style.css';

const WalletManagerPage = () => {
  const { wallet } = useWallet();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  return (
    <div className="settings-content settings-content--full">
      <div className="settings-section">
        <h3 className="settings-section__title">Wallet Information</h3>
        <div className="settings-section__content">
          <div className="wallet-info">
            <div className="wallet-info__item">
              <span className="wallet-info__label">Name</span>
              <span className="wallet-info__value">{wallet?.getName()}</span>
            </div>
            <div className="wallet-info__item">
              <span className="wallet-info__label">Created Date</span>
              <span className="wallet-info__value">March 14, 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section__title">Security</h3>
        <div className="settings-section__content">
          <button
            className="settings-button"
            onClick={() => setIsChangingPassword(true)}
          >
            Change Password
          </button>
          <button
            className="settings-button settings-button--danger"
          >
            Delete Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletManagerPage;
