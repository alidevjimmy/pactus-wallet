'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import Image from 'next/image';
import { copyIcon, successIcon, simpleLogo } from '@/assets';

interface TransactionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    amount: string;
    txHash: string;
    status: 'successful' | 'failed' | 'pending';
    date: string;
    recipient: string;
    networkFee: string;
  };
}

const TransactionResultModal: React.FC<TransactionResultModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const formatAmount = (amount: string) => {
    // Remove any existing negative sign and PAC suffix
    const cleanAmount = amount.replace(/^-/, '').replace(/\s*PAC$/, '');
    // Add negative sign and PAC with proper spacing
    return `-${cleanAmount} PAC`;
  };

  const handleViewOnPacviewer = () => {
    window.open(`https://pacviewer.com/transaction/${data.txHash}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sent">
      <div className="transaction-result__content">
        <div className="transaction-result__amount">
          {formatAmount(data.amount)}
        </div>

        <div className="transaction-result__details">
          <div className="transaction-result__field">
            <span className="transaction-result__label">Tx Hash</span>
            <div className="transaction-result__value-container">
              <span className="transaction-result__value transaction-result__value--hash">{data.txHash}</span>
              <button
                className="transaction-result__copy"
                onClick={() => handleCopy(data.txHash)}
                aria-label="Copy transaction hash"
              >
                <Image
                  src={isCopied ? successIcon : copyIcon}
                  alt={isCopied ? "Copied" : "Copy"}
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>

          <div className="transaction-result__field">
            <span className="transaction-result__label">Status</span>
            <span className={`transaction-result__value transaction-result__value--${data.status}`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>

          <div className="transaction-result__field">
            <span className="transaction-result__label">Date</span>
            <span className="transaction-result__value">{data.date}</span>
          </div>

          <div className="transaction-result__field">
            <span className="transaction-result__label">Recipient</span>
            <span className="transaction-result__value transaction-result__value--address">{data.recipient}</span>
          </div>

          <div className="transaction-result__field">
            <span className="transaction-result__label">Network fee</span>
            <div className="transaction-result__value-container">
              <div className="transaction-result__value-with-icon">
                <Image src={simpleLogo} alt="PAC" width={16} height={16} />
                <span className="transaction-result__value">{data.networkFee}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="transaction-result__actions">
          <button
            type="button"
            className="transaction-result__view-button"
            onClick={handleViewOnPacviewer}
          >
            View on Pacviewer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionResultModal;
