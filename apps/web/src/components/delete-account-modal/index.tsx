'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { hidePasswordIcon, showPasswordIcon } from '@/assets';
import Image from 'next/image';
import { useAccount } from '@/wallet';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordVerified: () => void;
  address: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onPasswordVerified,
  address,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { getAddressInfo } = useAccount();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await getAddressInfo(password, address);
      onPasswordVerified();
      setPassword('');
      setShowPassword(false);
      onClose();
    } catch (err) {
      console.error('Error verifying password:', err);
      setError('Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Password">
      <form
        className="delete-account-form"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="modal-input-container">
          <label
            className="modal-label"
            htmlFor="password"
          >
            To delete this account, please enter your master password.
          </label>

          <div className="relative w-full">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full h-[60px] rounded-lg bg-surface-medium px-4 pr-12 text-[#D2D3E0] text-base font-normal ${error ? 'border border-[#FF4940]' : 'border border-transparent'} focus:border-[#00CC99] focus:outline-none transition-colors placeholder:text-[#4C4F6B]`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#2A2F36] rounded-md transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Image
                src={showPassword ? hidePasswordIcon : showPasswordIcon}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>

        <div className="delete-account-actions">
          {error && (
            <p id="password-error" className="modal-error-text" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="modal-button btn btn-danger"
            style={{ marginLeft: 'auto' }}
            disabled={isSubmitting || !password.trim()}
          >
            {isSubmitting ? 'Verifying...' : 'Delete Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
