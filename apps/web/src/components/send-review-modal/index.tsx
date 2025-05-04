'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../modal';
import './style.css';
import Image from 'next/image';
import { simpleLogo, copyIcon, successIcon } from '@/assets';
import TransactionResultModal from '../transaction-result-modal';

interface SendReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBack: () => void;
  onCancel: () => void;
  data: {
    from: string;
    to: string;
    amount: string;
    fee: string;
    memo: string;
    signature?: string;
  };
  isSubmitting: boolean;
}

const COUNTDOWN_START = 10;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 15; // For a circle with radius 15

const SendReviewModal: React.FC<SendReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onBack,
  onCancel,
  data,
  isSubmitting
}) => {
  const [copiedFields, setCopiedFields] = useState<{[key: string]: boolean}>({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [transactionResult, setTransactionResult] = useState({
    amount: '',
    txHash: '',
    status: 'successful' as const,
    date: '',
    recipient: '',
    networkFee: ''
  });

  const resetStates = () => {
    setIsConfirming(false);
    setCountdown(COUNTDOWN_START);
    setCopiedFields({});
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const handleModalClose = () => {
    resetStates();
    setShowResult(false);
    onClose();
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopiedFields(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const handleConfirmClick = () => {
    if (isConfirming) {
      // If already confirming, this is a cancel action
      resetStates();
      onCancel();
    } else {
      // Start confirming
      setIsConfirming(true);
      onConfirm();
      // Start countdown
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            setIsConfirming(false);
            // Show the transaction result
            const now = new Date();
            setTransactionResult({
              amount: `-${data.amount}`,
              txHash: 'tx' + Math.random().toString(36).substring(2, 15),
              status: 'successful',
              date: now.toLocaleString(),
              recipient: data.to,
              networkFee: data.fee
            });
            setShowResult(true);
            return COUNTDOWN_START;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleBack = () => {
    resetStates();
    onBack();
  };

  // Reset states when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetStates();
      setShowResult(false);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const getCircleOffset = () => {
    const progress = (COUNTDOWN_START - countdown) / COUNTDOWN_START;
    return CIRCLE_CIRCUMFERENCE * (1 - progress);
  };

  if (showResult) {
    return (
      <TransactionResultModal
        isOpen={isOpen}
        onClose={handleModalClose}
        data={transactionResult}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Review Transaction">
      <div className="transaction-modal__content">
        <div className="transaction-modal__field">
          <span className="transaction-modal__label">From</span>
          <div className="transaction-modal__value-container">
            <span className="transaction-modal__value transaction-modal__value--address">{data.from}</span>
            <button
              className="transaction-modal__copy"
              onClick={() => handleCopy(data.from, 'from')}
              aria-label="Copy sender address"
            >
              <Image
                src={copiedFields['from'] ? successIcon : copyIcon}
                alt={copiedFields['from'] ? "Copied" : "Copy"}
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Receiver</span>
          <div className="transaction-modal__value-container">
            <span className="transaction-modal__value transaction-modal__value--address">{data.to}</span>
            <button
              className="transaction-modal__copy"
              onClick={() => handleCopy(data.to, 'to')}
              aria-label="Copy receiver address"
            >
              <Image
                src={copiedFields['to'] ? successIcon : copyIcon}
                alt={copiedFields['to'] ? "Copied" : "Copy"}
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Amount</span>
          <div className="transaction-modal__value-container">
            <div className="transaction-modal__value-with-icon">
              <Image src={simpleLogo} alt="PAC" width={20} height={20} />
              <span className="transaction-modal__value">{data.amount} PAC</span>
            </div>
          </div>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Network Fee</span>
          <div className="transaction-modal__value-container">
            <div className="transaction-modal__value-with-icon">
              <Image src={simpleLogo} alt="PAC" width={20} height={20} />
              <span className="transaction-modal__value">{data.fee} PAC</span>
            </div>
          </div>
        </div>

        {data.memo && (
          <div className="transaction-modal__field">
            <span className="transaction-modal__label">Memo</span>
            <span className="transaction-modal__value">{data.memo}</span>
          </div>
        )}

        {data.signature && (
          <div className="transaction-modal__field">
            <span className="transaction-modal__label">Signature</span>
            <div className="transaction-modal__value-container">
              <span className="transaction-modal__value transaction-modal__value--hash">{data.signature}</span>
              <button
                className="transaction-modal__copy"
                onClick={() => handleCopy(data.signature, 'signature')}
                aria-label="Copy signature"
              >
                <Image
                  src={copiedFields['signature'] ? successIcon : copyIcon}
                  alt={copiedFields['signature'] ? "Copied" : "Copy"}
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        )}

        <div className="transaction-modal__actions">
          <button
            type="button"
            className="modal-button btn-secondary"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </button>
          <div className="countdown-container">
            {isConfirming && (
              <div className="countdown">
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <defs>
                    <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#00E8A2' }} />
                      <stop offset="100%" style={{ stopColor: '#00B37D' }} />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    className="countdown-circle-bg"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    className="countdown-circle"
                    style={{
                      strokeDasharray: CIRCLE_CIRCUMFERENCE,
                      strokeDashoffset: getCircleOffset()
                    }}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="central"
                    className="countdown-number"
                  >
                    {countdown}
                  </text>
                </svg>
              </div>
            )}
            <button
              type="button"
              className={`modal-button ${isConfirming ? 'btn-cancel' : 'btn-primary'}`}
              onClick={handleConfirmClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : isConfirming ? 'Cancel' : 'Confirm & Send'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SendReviewModal;
