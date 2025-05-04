'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
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
      <form className="add-node-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="modal-input-container">
          <label className="modal-label" htmlFor="nodeTitle">
            Title
          </label>
          <input
            id="nodeTitle"
            className="modal-input"
            type="text"
            placeholder="Enter node title"
            value={nodeTitle}
            onChange={handleNodeTitleChange}
            aria-invalid={error ? "true" : "false"}
          />
        </div>

        <div className="modal-input-container">
          <label className="modal-label" htmlFor="nodeAddress">
            gRPC gateway node
          </label>
          <div className="node-address-input-group">
            <input
              id="nodeAddress"
              className="modal-input"
              type="text"
              placeholder="host.domain:port"
              value={nodeAddress}
              onChange={handleNodeAddressChange}
              aria-invalid={error ? "true" : "false"}
            />
            <button
              type="button"
              className={`action-button action-button--refresh ${isRefreshing ? 'action-button--rotating' : ''}`}
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
              <span className="node-ping-status">
                {pingStatus}
              </span>
            )}
          </div>
        </div>

        <div className="add-node-actions">
          {error && <p className="modal-error-text" role="alert">{error}</p>}
          <div className="add-node-actions-right">
            <div className="default-node-switch">
              <button
                type="button"
                className={`switch-button ${isDefault ? 'switch-button--enabled' : ''}`}
                onClick={() => setIsDefault(!isDefault)}
                title={isDefault ? 'Remove as default' : 'Set as default'}
                aria-label={isDefault ? 'Remove as default' : 'Set as default'}
                role="switch"
                aria-checked={isDefault}
              >
                <div className="switch-button__track">
                  <div className="switch-button__thumb" />
                </div>
              </button>
              <span className="default-node-label">Set as default</span>
            </div>
            <button
              type="submit"
              className="modal-button btn btn-primary"
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
