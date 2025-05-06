import React, { useState } from 'react';
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">Hash</span>
          <div className="flex items-center gap-2">
            <span className="text-text-primary text-sm font-medium break-all font-mono bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              {transaction.hash}
            </span>
            <button
              className="bg-transparent border-none p-1 cursor-pointer rounded-full transition-colors hover:bg-surface-light flex items-center justify-center"
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

        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">Block</span>
          <span className="text-text-primary text-sm font-medium break-all">
            {formatNumber(transaction.block)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">From</span>
          <div className="flex items-center gap-2">
            <span className="text-text-primary text-sm font-medium break-all font-mono bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              {transaction.from}
            </span>
            <button
              className="bg-transparent border-none p-1 cursor-pointer rounded-full transition-colors hover:bg-surface-light flex items-center justify-center"
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

        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">To</span>
          <div className="flex items-center gap-2">
            <span className="text-text-primary text-sm font-medium break-all font-mono bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              {transaction.to}
            </span>
            <button
              className="bg-transparent border-none p-1 cursor-pointer rounded-full transition-colors hover:bg-surface-light flex items-center justify-center"
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

        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">Value</span>
          <span className="text-text-primary text-sm font-medium break-all">
            {transaction.value}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">Fee</span>
          <span className="text-text-primary text-sm font-medium break-all">
            {transaction.fee}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-sm font-medium">Memo</span>
          <div className="flex items-center gap-2">
            <span className="text-text-primary text-sm font-medium break-all">
              {transaction.memo || '-'}
            </span>
            {transaction.memo && (
              <button
                className="bg-transparent border-none p-1 cursor-pointer rounded-full transition-colors hover:bg-surface-light flex items-center justify-center"
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
