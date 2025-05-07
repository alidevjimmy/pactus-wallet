'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import { useAccount } from '@/wallet';
import { hidePasswordIcon, showPasswordIcon, emojis } from '@/assets';
import Image from 'next/image';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAddress, error, clearError } = useAccount();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearError();
  };

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value);
    clearError();
  };

  const handleEmojiSelect = (emoji: string) => {
    setAccountName(prevName => prevName + emoji);
    clearError();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createAddress(accountName, password);

      // Success - reset form and close modal
      setAccountName('');
      setPassword('');
      setShowPassword(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Account">
      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="bg-[#1D2328] rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <label className="block text-[#858699] text-sm mb-2" htmlFor="accountName">
                Label
              </label>
              <input
                id="accountName"
                className="w-full rounded-md bg-[#2A2F36] px-4 py-2 text-[#D2D3E0] text-sm border-none outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#00CC99]"
                type="text"
                placeholder="Enter account name"
                value={accountName}
                onChange={handleAccountNameChange}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "account-error" : undefined}
              />
            </div>

            <div className="flex flex-wrap gap-2 p-2 bg-[#2A2F36] rounded-lg max-h-[180px] overflow-y-auto" role="group" aria-label="Emoji selector">
              {emojis.map((emoji, index) => (
                <button
                  key={`${index}-emoji`}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 text-xl hover:bg-[#1D2328] rounded-md transition-colors"
                  aria-label={`Insert emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1D2328] rounded-lg p-4">
          <div className="relative w-full">
            <label className="block text-[#858699] text-sm mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full rounded-md bg-[#2A2F36] px-4 py-2 pr-12 text-[#D2D3E0] text-sm border-none outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[#00CC99] ${error ? 'ring-2 ring-[#FF4940]' : ''}`}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#1D2328] rounded-md transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Image
                  src={showPassword ? hidePasswordIcon : showPasswordIcon}
                  alt=""
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {error && (
            <p id="password-error" className="text-[#FF4940] text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="flex px-6 py-2.5 justify-center items-center gap-2 rounded-lg font-semibold text-white bg-gradient-to-r from-[#00CC99] to-[#009966] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ml-auto"
            disabled={isSubmitting || !accountName.trim() || !password.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
