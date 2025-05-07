'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import { useAccount } from '@/wallet';
import QRCode from 'react-qr-code';
import { copyIcon, successIcon } from '@/assets';
import Image from 'next/image';

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
      <div className="flex flex-col gap-4">
        <div className="bg-[#1D2328] rounded-lg p-4">
          <div className="relative w-full">
            <label className="block text-[#858699] text-sm mb-2" htmlFor="account">
              Account
            </label>
            <select
              id="account"
              className="w-full rounded-md bg-[#2A2F36] px-4 py-2 pr-10 text-[#D2D3E0] text-sm border-none outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#00CC99] appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23858699%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]"
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
        </div>

        {selectedAccount && (
          <div className="bg-[#1D2328] rounded-lg p-4">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCode
                  value={selectedAccount}
                  size={240}
                  level="H"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-lg font-medium text-[#D2D3E0]">
                  {accounts.find(acc => acc.address === selectedAccount)?.name}
                </span>
                <div className="flex items-center justify-between gap-2 w-full p-3 bg-[#2A2F36] rounded-lg">
                  <span className="font-mono text-sm text-[#858699] overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                    {selectedAccount}
                  </span>
                  <button
                    type="button"
                    className="p-2 bg-transparent border-none rounded-md text-[#858699] hover:bg-[#1D2328] hover:text-white transition-colors"
                    onClick={handleCopy}
                    aria-label="Copy address"
                  >
                    <Image
                      src={copied ? successIcon : copyIcon}
                      alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReceiveModal;
