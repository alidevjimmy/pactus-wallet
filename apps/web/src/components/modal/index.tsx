'use client';
import React, { useEffect, useRef, useState, useId } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const titleId = useId();

  // Handle modal visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';

      // Focus trap setup - focus first focusable element
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 50);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle clicks outside of the modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-[rgba(29,35,40,0.75)] backdrop-blur-sm flex items-center justify-center z-[99999] transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOutsideClick}
      role="presentation"
    >
      <div
        className={`w-[90%] max-w-[600px] rounded-lg bg-[#1D2328] shadow-[0px_20px_24px_-4px_rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] relative z-[100000] backdrop-blur-md overflow-hidden transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : '-translate-y-5'
        }`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#2C2D3C]">
          <h2 id={titleId} className="text-text-primary text-lg font-semibold m-0">
            {title}
          </h2>
          {showCloseButton && (
            <button
              className="bg-transparent border-none text-text-tertiary text-lg cursor-pointer w-6 h-6 flex items-center justify-center p-0 rounded-full transition-colors hover:text-text-primary hover:bg-surface-light focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </header>
        <div className="p-6 max-h-[calc(80vh-80px)] overflow-y-auto scrollbar-thin scrollbar-track-surface-medium scrollbar-thumb-border hover:scrollbar-thumb-text-tertiary scrollbar-track-rounded-sm scrollbar-thumb-rounded-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

// Utility classes for modal buttons and inputs that can be used by child components
export const modalUtilityClasses = {
  button: "flex px-3 py-2 justify-center items-center gap-2 rounded-sm bg-gradient-to-r from-primary to-primary text-text-primary text-center text-sm font-semibold leading-normal border-none cursor-pointer shadow-button transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  buttonSecondary: "bg-surface-medium border border-border-light text-text-secondary",
  inputContainer: "relative w-full mb-4",
  input: "w-full rounded-md bg-surface-medium px-4 py-2 text-text-secondary text-sm border-none outline-none transition-shadow duration-200 focus:shadow-[0_0_0_1px_var(--color-primary)]",
  label: "block text-text-secondary text-sm mb-2",
  errorText: "text-error text-xs mt-1"
};

export default Modal;
