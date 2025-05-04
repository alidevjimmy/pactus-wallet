'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import Image from 'next/image';
import { simpleLogo, hidePasswordIcon, showPasswordIcon } from '@/assets';
import { useAccount } from '@/wallet';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    from: string;
    to: string;
    amount: string;
    fee: string;
    memo: string;
    password: string;
  }) => void;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { accounts } = useAccount();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    fee: '',
    memo: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleMaxClick = () => {
    // TODO: Implement max amount calculation
    setFormData(prev => ({ ...prev, amount: '0' }));
  };

  const handleAutoFee = () => {
    // TODO: Implement automatic fee calculation
    setFormData(prev => ({ ...prev, fee: '0.001' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send">
      <form className="send-form" onSubmit={handleSubmit}>
        <div className="modal-input-container">
          <label className="modal-label" htmlFor="from">
            From
          </label>
          <select
            id="from"
            name="from"
            className="modal-input"
            value={formData.from}
            onChange={handleInputChange}
            required
          >
            <option value="">Select account</option>
            {accounts?.map(account => (
              <option key={account.address} value={account.address}>
                {account.label || account.address}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-input-container">
          <label className="modal-label" htmlFor="to">
            Receiver
          </label>
          <input
            id="to"
            name="to"
            type="text"
            className="modal-input"
            placeholder="Enter receiver address"
            value={formData.to}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="modal-input-container">
          <label className="modal-label" htmlFor="amount">
            Amount
          </label>
          <div className="input-with-icon">
            <Image
              src={simpleLogo}
              alt="PAC"
              width={20}
              height={20}
              className="input-icon"
            />
            <input
              id="amount"
              name="amount"
              type="text"
              className="modal-input with-icon"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="input-action-button"
              onClick={handleMaxClick}
            >
              Max
            </button>
          </div>
        </div>

        <div className="modal-input-container">
          <label className="modal-label" htmlFor="fee">
            Network Fee
          </label>
          <div className="input-with-icon">
            <Image
              src={simpleLogo}
              alt="PAC"
              width={20}
              height={20}
              className="input-icon"
            />
            <input
              id="fee"
              name="fee"
              type="text"
              className="modal-input with-icon"
              placeholder="0.001"
              value={formData.fee}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="input-action-button"
              onClick={handleAutoFee}
            >
              Auto
            </button>
          </div>
        </div>

        <div className="modal-input-container">
          <label className="modal-label" htmlFor="memo">
            Memo
          </label>
          <div className="input-with-counter">
            <input
              id="memo"
              name="memo"
              type="text"
              className="modal-input"
              placeholder="Enter memo (optional)"
              value={formData.memo}
              onChange={handleInputChange}
              maxLength={64}
            />
            <span className="char-counter">
              {formData.memo.length}/64
            </span>
          </div>
        </div>

        <div className="modal-input-container">
          <label className="modal-label" htmlFor="password">
            Password
          </label>
          <div className="input-with-icon password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="modal-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)}
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

        {error && (
          <p className="modal-error-text" role="alert">
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="submit"
            className="modal-button btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SendModal;
