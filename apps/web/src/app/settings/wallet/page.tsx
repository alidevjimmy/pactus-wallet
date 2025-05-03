'use client';
import React from 'react';
import './style.css';

const WalletManagerPage = () => {
  return (
    <div className="settings-content settings-content--full">
      <div className="account-header">
        <span className="account-count">1 / <span className="account-count-max">200</span></span>
        <div className="account-separator"></div>
        <button className="add-account-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33203 8H12.6654" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Account
        </button>
      </div>

      <div className="settings-section">

      </div>
    </div>
  );
};

export default WalletManagerPage;
