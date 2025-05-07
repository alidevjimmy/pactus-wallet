'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { searchIcon } from '@/assets';
import { useAccount } from '@/wallet/hooks/use-account';
import { useRouter } from 'next/navigation';
import Modal from '../modal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getAccountList } = useAccount();
  const router = useRouter();
  const accounts = getAccountList() || [];

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccountClick = (address: string) => {
    router.push(`/wallet?address=${address}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Accounts">
      <div className="flex flex-col gap-6">
        <div className="bg-[#1D2328] rounded-lg p-4">
          <div className="relative">
            <Image
              src={searchIcon}
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts by name or address..."
              className="w-full pl-10 pr-4 py-2 bg-[#2A2F36] text-[#D2D3E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CC99]"
              autoFocus
            />
          </div>
        </div>

        <div className="bg-[#1D2328] rounded-lg">
          <div className="p-4 border-b border-[#2C2D3C]">
            <h3 className="text-[#D2D3E0] text-sm font-medium">Search Results</h3>
          </div>
          <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-track-surface-medium scrollbar-thumb-border hover:scrollbar-thumb-text-tertiary scrollbar-track-rounded-sm scrollbar-thumb-rounded-sm">
            {filteredAccounts.length > 0 ? (
              <div className="divide-y divide-[#2C2D3C]">
                {filteredAccounts.map((account) => (
                  <button
                    key={account.address}
                    onClick={() => handleAccountClick(account.address)}
                    className="w-full px-4 py-3 text-left hover:bg-[#2A2F36] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{account.emoji}</span>
                      <div>
                        <div className="text-[#D2D3E0] font-medium">{account.name}</div>
                        <div className="text-[#858699] text-sm font-mono">{account.address}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[#858699]">
                No accounts found
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
