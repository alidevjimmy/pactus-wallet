import React, { useState } from 'react';
import './style.css';
import Image from 'next/image';
import { copyIcon, successIcon } from '@/assets';
import Modal from '../modal';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    hash: string;
    block: number;
    from: string;
    to: string;
    value: string;
    fee: string;
    memo?: string;
  };
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [copiedFields, setCopiedFields] = useState<{[key: string]: boolean}>({});

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopiedFields(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="transaction-modal__content">
        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Hash</span>
          <div className="transaction-modal__value-container">
            <span className="transaction-modal__value transaction-modal__value--hash">{transaction.hash}</span>
            <button
              className="transaction-modal__copy"
              onClick={() => handleCopy(transaction.hash, 'hash')}
              aria-label="Copy transaction hash"
            >
              <Image
                src={copiedFields['hash'] ? successIcon : copyIcon}
                alt={copiedFields['hash'] ? "Copied" : "Copy"}
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Block</span>
          <span className="transaction-modal__value">{formatNumber(transaction.block)}</span>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">From</span>
          <div className="transaction-modal__value-container">
            <span className="transaction-modal__value transaction-modal__value--address">{transaction.from}</span>
            <button
              className="transaction-modal__copy"
              onClick={() => handleCopy(transaction.from, 'from')}
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
          <span className="transaction-modal__label">To</span>
          <div className="transaction-modal__value-container">
            <span className="transaction-modal__value transaction-modal__value--address">{transaction.to}</span>
            <button
              className="transaction-modal__copy"
              onClick={() => handleCopy(transaction.to, 'to')}
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
          <span className="transaction-modal__label">Value</span>
          <span className="transaction-modal__value">{transaction.value}</span>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Fee</span>
          <span className="transaction-modal__value">{transaction.fee}</span>
        </div>

        <div className="transaction-modal__field">
          <span className="transaction-modal__label">Memo</span>
          <div className="transaction-modal__value-container">
            <span className="transaction-modal__value">{transaction.memo || '-'}</span>
            {transaction.memo && (
              <button
                className="transaction-modal__copy"
                onClick={() => handleCopy(transaction.memo!, 'memo')}
                aria-label="Copy memo"
              >
                <Image
                  src={copiedFields['memo'] ? successIcon : copyIcon}
                  alt={copiedFields['memo'] ? "Copied" : "Copy"}
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
