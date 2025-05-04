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

          <div className="input-MasterPassword">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              style={{ border: error ? '1px var(--color-error) solid' : 'none' }}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
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
