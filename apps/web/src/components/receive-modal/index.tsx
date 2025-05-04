'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useAccount } from '@/wallet';
import QRCode from 'react-qr-code';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose }) => {
  const { getAccountList } = useAccount();
  const accounts = getAccountList();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.target.value);
  };

  const handleCopy = async () => {
    if (selectedAccount) {
      await navigator.clipboard.writeText(selectedAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive">
      <div className="receive-form">
        <div className="modal-input-container">
          <label className="modal-label" htmlFor="account">
            Account
          </label>
          <select
            id="account"
            className="modal-input"
            value={selectedAccount}
            onChange={handleAccountChange}
            required
          >
            <option value="">Select account</option>
            {accounts?.map(account => (
              <option key={account.address} value={account.address}>
                {account.emoji} {account.name}
              </option>
            ))}
          </select>
        </div>

        {selectedAccount && (
          <div className="qr-container">
            <div className="qr-code">
              <QRCode
                value={selectedAccount}
                size={240}
                level="H"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="account-info">
              <span className="account-name">
                {accounts.find(acc => acc.address === selectedAccount)?.name}
              </span>
              <div className="address-container">
                <span className="address">{selectedAccount}</span>
                <button
                  type="button"
                  className="copy-button"
                  onClick={handleCopy}
                  aria-label="Copy address"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReceiveModal;
