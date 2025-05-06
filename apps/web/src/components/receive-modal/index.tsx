'use client';
import React, { useState } from 'react';
import Modal from '../modal';
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
      <div className="flex flex-col gap-6 w-full p-6 rounded-lg">
        <div className="relative w-full">
          <label className="block text-text-secondary text-sm mb-2" htmlFor="account">
            Account
          </label>
          <select
            id="account"
            className="w-full rounded-md bg-surface-medium px-4 py-2 text-text-secondary text-sm border-none outline-none transition-shadow duration-200 focus:shadow-[0_0_0_1px_var(--color-primary)]"
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
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg">
            <div className="p-4 rounded-md">
              <QRCode
                value={selectedAccount}
                size={240}
                level="H"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="text-lg font-medium text-text-primary">
                {accounts.find(acc => acc.address === selectedAccount)?.name}
              </span>
              <div className="flex items-center justify-between gap-2 w-full p-2 px-4 bg-background rounded-md">
                <span className="font-mono text-sm text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                  {selectedAccount}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 bg-transparent border-none rounded text-sm font-medium cursor-pointer transition-opacity duration-200 hover:opacity-80 active:scale-98 bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent whitespace-nowrap ml-auto"
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
