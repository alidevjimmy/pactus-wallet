'use client';
import React, { useState } from 'react';
import Modal from '../modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4 p-4">
        <p className="text-text-secondary text-sm leading-relaxed m-0">{message}</p>
        <div className={`flex gap-2 mt-4 ${isDestructive ? 'justify-end' : 'justify-end'}`}>
          {!isDestructive && (
            <button
              type="button"
              className="flex px-3 py-2 justify-center items-center gap-2 rounded-sm bg-surface-medium border border-border-light text-text-secondary text-sm font-semibold transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`flex px-6 py-2.5 justify-center items-center gap-2 rounded-lg font-semibold text-white transition-all duration-300 ${
              isDestructive
                ? 'bg-gradient-to-r from-[#8B0000] to-[#FF0000] hover:from-[#6B0000] hover:to-[#CC0000] hover:-translate-y-0.5 disabled:from-[#A88B8B] disabled:to-[#FFA0A0] disabled:transform-none'
                : 'bg-gradient-to-r from-primary to-primary'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
