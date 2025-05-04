'use client';
import React, { useState } from 'react';
import './style.css';
import Image from 'next/image';
import { copyIcon, successIcon } from '@/assets';
import ConfirmModal from '@/components/confirm-modal';
import AddNodeModal from '@/components/add-node-modal';

// Mock data for demonstration
const mockNodes = [
  {
    id: '1',
    title: 'Main Node',
    address: 'node1.pactus.org:8080',
    ping: '45ms',
    blockHeight: 123456,
    enabled: true
  },
  {
    id: '2',
    title: 'Backup Node',
    address: 'node2.pactus.org:8080',
    ping: '78ms',
    blockHeight: 123455,
    enabled: false
  }
];

const NodeManagerPage = () => {
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [nodes, setNodes] = useState(mockNodes);
  const [copiedAddresses, setCopiedAddresses] = useState<{[key: string]: boolean}>({});
  const [refreshingNodes, setRefreshingNodes] = useState<{[key: string]: boolean}>({});

  const handleDeleteClick = (id: string) => {
    setSelectedNodeId(id);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = () => {
    setNodes(nodes.filter(node => node.id !== selectedNodeId));
    setShowDeleteConfirmModal(false);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddresses(prev => ({ ...prev, [address]: true }));
    setTimeout(() => {
      setCopiedAddresses(prev => ({ ...prev, [address]: false }));
    }, 2000);
  };

  const handleAddNode = (node: { title: string; address: string }) => {
    const newNode = {
      id: Date.now().toString(), // Generate a unique ID
      title: node.title,
      address: node.address,
      ping: 'Connecting...',
      blockHeight: 0,
      enabled: true
    };

    setNodes(prev => [...prev, newNode]);

    // Here you would normally connect to the node and update ping and blockHeight
    // For demonstration, we're just setting mock values after a delay
    setTimeout(() => {
      setNodes(prev =>
        prev.map(n =>
          n.id === newNode.id
            ? { ...n, ping: `${Math.floor(Math.random() * 100) + 20}ms`, blockHeight: 123456 }
            : n
        )
      );
    }, 2000);
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Handle refresh for a specific node
  const handleRefreshNode = async (nodeId: string) => {
    // Set refreshing state for this node
    setRefreshingNodes(prev => ({ ...prev, [nodeId]: true }));

    // Simulate API call to refresh node data
    // In real implementation, this would be an actual API call to get node status
    setTimeout(() => {
      setNodes(prev =>
        prev.map(node =>
          node.id === nodeId
            ? {
                ...node,
                ping: `${Math.floor(Math.random() * 100) + 20}ms`,
                blockHeight: node.blockHeight + Math.floor(Math.random() * 10) + 1
              }
            : node
        )
      );
      // Clear refreshing state
      setRefreshingNodes(prev => ({ ...prev, [nodeId]: false }));
    }, 1000);
  };

  // Handle toggle node enabled/disabled
  const handleToggleNode = (nodeId: string) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId
          ? { ...node, enabled: !node.enabled }
          : node
      )
    );
  };

  return (
    <div className="settings-content settings-content--full">
      <div className="account-header">
        <span className="account-count">{nodes.length} / <span className="account-count-max">50</span></span>
        <div className="account-separator"></div>
        <button className="add-account-button" onClick={() => setShowAddNodeModal(true)}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_841_2491)">
<path d="M14.9844 6.5V4.5C14.9844 2.888 14.0964 2 12.4844 2H4.48438C2.87238 2 1.98438 2.888 1.98438 4.5V6.5C1.98438 7.41067 2.27712 8.08133 2.81445 8.5C2.27712 8.91867 1.98438 9.58933 1.98438 10.5V12.5C1.98438 14.112 2.87238 15 4.48438 15H12.4844C14.0964 15 14.9844 14.112 14.9844 12.5V10.5C14.9844 9.58933 14.6916 8.91867 14.1543 8.5C14.6916 8.08133 14.9844 7.41067 14.9844 6.5ZM13.9844 10.5V12.5C13.9844 13.5513 13.5357 14 12.4844 14H4.48438C3.43304 14 2.98438 13.5513 2.98438 12.5V10.5C2.98438 9.44867 3.43304 9 4.48438 9H12.4844C13.5357 9 13.9844 9.44867 13.9844 10.5ZM4.48438 8C3.43304 8 2.98438 7.55133 2.98438 6.5V4.5C2.98438 3.44867 3.43304 3 4.48438 3H12.4844C13.5357 3 13.9844 3.44867 13.9844 4.5V6.5C13.9844 7.55133 13.5357 8 12.4844 8H4.48438ZM10.8177 5.50798C10.8177 5.87598 10.519 6.17464 10.151 6.17464C9.78304 6.17464 9.48438 5.87598 9.48438 5.50798C9.48438 5.13998 9.78304 4.84131 10.151 4.84131C10.519 4.84131 10.8177 5.13998 10.8177 5.50798ZM12.8177 5.50798C12.8177 5.87598 12.519 6.17464 12.151 6.17464C11.783 6.17464 11.4844 5.87598 11.4844 5.50798C11.4844 5.13998 11.783 4.84131 12.151 4.84131C12.519 4.84131 12.8177 5.13998 12.8177 5.50798ZM9.48438 11.5C9.48438 11.132 9.78304 10.8333 10.151 10.8333C10.519 10.8333 10.8177 11.132 10.8177 11.5C10.8177 11.868 10.519 12.1667 10.151 12.1667C9.78304 12.1667 9.48438 11.868 9.48438 11.5ZM11.4844 11.5C11.4844 11.132 11.783 10.8333 12.151 10.8333C12.519 10.8333 12.8177 11.132 12.8177 11.5C12.8177 11.868 12.519 12.1667 12.151 12.1667C11.783 12.1667 11.4844 11.868 11.4844 11.5Z" fill="#858699"/>
</g>
<defs>
<clipPath id="clip0_841_2491">
<rect width="16" height="16" fill="white" transform="translate(0.484375 0.5)"/>
</clipPath>
</defs>
</svg>

          Add Node
        </button>
      </div>

      <div className="settings-section node-manager">
        <div className="wallet-table">
          <div className="wallet-table-header">
            <div className="wallet-table-cell">Title</div>
            <div className="wallet-table-cell">Address</div>
            <div className="wallet-table-cell">Ping</div>
            <div className="wallet-table-cell">Block Height</div>
            <div className="wallet-table-cell wallet-table-cell--right">Action</div>
          </div>
          <div className="wallet-table-body">
            {nodes.map((node) => (
              <div key={node.id} className="wallet-table-row">
                <div className="wallet-table-cell">
                  <div className="account-title">
                    <button
                      className={`action-button action-button--refresh ${refreshingNodes[node.id] ? 'action-button--rotating' : ''}`}
                      title="Refresh Node"
                      onClick={() => handleRefreshNode(node.id)}
                      disabled={refreshingNodes[node.id]}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.7 2 18.9 3.9 20.6 6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2V6.8H17.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {node.title}
                  </div>
                </div>
                <div className="wallet-table-cell">
                  <div className="account-address-container">
                    <span className="account-address">{node.address}</span>
                    <button
                      className="copy-button"
                      onClick={() => handleCopyAddress(node.address)}
                      aria-label="Copy address to clipboard"
                      title="Copy address to clipboard"
                    >
                      <Image
                        src={copiedAddresses[node.address] ? successIcon : copyIcon}
                        alt={copiedAddresses[node.address] ? 'Copied successfully' : 'Copy to clipboard'}
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
                <div className="wallet-table-cell">
                  <span className="node-ping">{node.ping}</span>
                </div>
                <div className="wallet-table-cell">
                  <span className="node-block-height">{formatNumber(node.blockHeight)}</span>
                </div>
                <div className="wallet-table-cell wallet-table-cell--right">
                  <div className="account-actions">
                    <button
                      className={`switch-button ${node.enabled ? 'switch-button--enabled' : ''}`}
                      onClick={() => handleToggleNode(node.id)}
                      title={node.enabled ? 'Disable Node' : 'Enable Node'}
                      aria-label={node.enabled ? 'Disable Node' : 'Enable Node'}
                      role="switch"
                      aria-checked={node.enabled}
                    >
                      <div className="switch-button__track">
                        <div className="switch-button__thumb" />
                      </div>
                    </button>
                    <button
                      className="action-button"
                      title="Delete Node"
                      onClick={() => handleDeleteClick(node.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.8504 9.14001L18.2004 19.21C18.0904 20.78 18.0004 22 15.2104 22H8.79039C6.00039 22 5.91039 20.78 5.80039 19.21L5.15039 9.14001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddNodeModal
        isOpen={showAddNodeModal}
        onClose={() => setShowAddNodeModal(false)}
        onAddNode={handleAddNode}
      />

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Node"
        message="Are you sure you want to delete this node? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default NodeManagerPage;
