'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import Image from 'next/image';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (node: { title: string; address: string; isDefault?: boolean }) => void;
}

const AddNodeModal: React.FC<AddNodeModalProps> = ({ isOpen, onClose, onAddNode }) => {
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeAddress, setNodeAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState(false);

  const handleNodeTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeTitle(e.target.value);
    setError(null);
  };

  const handleNodeAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeAddress(e.target.value);
    setError(null);
    setPingStatus(null);
  };

  const validateNodeAddress = (address: string): boolean => {
    // Simple validation for host:port format
    const regex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:[0-9]+)?$/;
    return regex.test(address);
  };

  const handleRefreshPing = async () => {
    if (!nodeAddress.trim() || !validateNodeAddress(nodeAddress)) {
      setError('Please enter a valid node address first');
      return;
    }

    setIsRefreshing(true);
    setPingStatus(null);
    setError(null);

    try {
      // Simulate ping check - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPing = Math.floor(Math.random() * 100) + 20;
      setPingStatus(`${mockPing}ms`);
    } catch (err) {
      setError('Failed to connect to node');
      setPingStatus(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!nodeTitle.trim()) {
        setError('Node title is required');
        return;
      }

      if (!nodeAddress.trim()) {
        setError('Node address is required');
        return;
      }

      if (!validateNodeAddress(nodeAddress)) {
        setError('Invalid node address format. Use format: host.domain:port');
        return;
      }

      setIsSubmitting(true);

      // Add the node
      onAddNode({
        title: nodeTitle,
        address: nodeAddress,
        isDefault
      });

      // Success - reset form and close modal
      setNodeTitle('');
      setNodeAddress('');
      setPingStatus(null);
      setIsDefault(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setNodeTitle('');
    setNodeAddress('');
    setError(null);
    setPingStatus(null);
    setIsDefault(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Add Node">
      <form className="flex flex-col gap-6 w-full mt-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm text-[#858699]" htmlFor="nodeTitle">
            Title
          </label>
          <input
            id="nodeTitle"
            className="w-full rounded-lg bg-surface-medium px-4 py-2 text-sm text-text-secondary border border-transparent focus:border-primary focus:outline-none transition-colors"
            type="text"
            placeholder="Enter node title"
            value={nodeTitle}
            onChange={handleNodeTitleChange}
            aria-invalid={error ? "true" : "false"}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm text-[#858699]" htmlFor="nodeAddress">
            gRPC gateway node
          </label>
          <div className="flex items-center gap-2 w-full">
            <input
              id="nodeAddress"
              className="flex-1 rounded-lg bg-surface-medium px-4 py-2 text-sm text-text-secondary border border-transparent focus:border-primary focus:outline-none transition-colors"
              type="text"
              placeholder="host.domain:port"
              value={nodeAddress}
              onChange={handleNodeAddressChange}
              aria-invalid={error ? "true" : "false"}
            />
            <button
              type="button"
              className={`p-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-[#858699] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              onClick={handleRefreshPing}
              disabled={isRefreshing || !nodeAddress.trim()}
              title="Check connection"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.7 2 18.9 3.9 20.6 6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2V6.8H17.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {pingStatus && (
              <span className="inline-block px-2 py-1 rounded-xl bg-[rgba(15,239,158,0.1)] text-primary text-xs font-medium">
                {pingStatus}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {error && <p className="text-sm text-[#FF4940]" role="alert">{error}</p>}
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  isDefault ? 'bg-primary' : 'bg-[rgba(255,255,255,0.1)]'
                }`}
                onClick={() => setIsDefault(!isDefault)}
                title={isDefault ? 'Remove as default' : 'Set as default'}
                aria-label={isDefault ? 'Remove as default' : 'Set as default'}
                role="switch"
                aria-checked={isDefault}
              >
                <span
                  className={`absolute block w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    isDefault ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-sm text-[#858699]">Set as default</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary text-white text-sm font-semibold transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !nodeTitle.trim() || !nodeAddress.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Node'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddNodeModal;
