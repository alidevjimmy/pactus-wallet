'use client';
import React, { useState } from 'react';
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
      id: Date.now().toString(),
      title: node.title,
      address: node.address,
      ping: 'Connecting...',
      blockHeight: 0,
      enabled: true
    };

    setNodes(prev => [...prev, newNode]);

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

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const handleRefreshNode = async (nodeId: string) => {
    setRefreshingNodes(prev => ({ ...prev, [nodeId]: true }));

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
      setRefreshingNodes(prev => ({ ...prev, [nodeId]: false }));
    }, 1000);
  };

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
    <div className="w-full bg-surface-medium rounded-lg shadow-inner overflow-hidden">
      <div className="flex items-center justify-end gap-4 p-4 border-b border-[#1D2328]">
        <span className="text-[#858699] text-xs">
          {nodes.length} / <span className="text-[#4C4F6B]">50</span>
        </span>
        <div className="w-px h-5 bg-[#2C2D3C]"></div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1D2328] hover:bg-[#2A2F36] rounded-lg transition-colors"
          onClick={() => setShowAddNodeModal(true)}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33203 8H12.6654" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
          Add Node
        </button>
      </div>

      <div className="p-4">
        <div className="w-full rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr,2fr,100px,130px,120px] gap-4 px-4 py-3 text-[#858699] text-xs font-medium border-b border-[#1D2328]">
            <div>Title</div>
            <div>Address</div>
            <div>Ping</div>
            <div>Block Height</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-[#1D2328]">
            {nodes.map((node) => (
              <div key={node.id} className="grid grid-cols-[1fr,2fr,100px,130px,120px] gap-4 px-4 py-3 hover:bg-[#1D2328] transition-colors">
                <div className="flex items-center gap-2">
                    <button
                    className={`p-1 rounded-md transition-colors ${
                      refreshingNodes[node.id]
                        ? 'animate-spin'
                        : 'text-[#858699] hover:bg-[#2A2F36] hover:text-white'
                    }`}
                      title="Refresh Node"
                      onClick={() => handleRefreshNode(node.id)}
                      disabled={refreshingNodes[node.id]}
                    >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.7 2 18.9 3.9 20.6 6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2V6.8H17.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  <span className="text-[#D2D3E0] text-sm font-medium">{node.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CC99] to-[#009966] text-sm font-medium font-mono truncate">{node.address}</span>
                    <button
                    className="p-1 text-[#858699] hover:bg-[#2A2F36] hover:text-white rounded-md transition-colors"
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
                <div>
                  <span className="inline-block px-2 py-1 rounded-xl bg-[rgba(0,204,153,0.1)] text-[#00CC99] text-xs font-medium">
                    {node.ping}
                  </span>
                </div>
                <div>
                  <span className="inline-block px-2 py-1 rounded-xl bg-[rgba(62,116,255,0.1)] text-[#3E74FF] text-xs font-medium">
                    {formatNumber(node.blockHeight)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button
                    className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00CC99] focus:ring-offset-2 focus:ring-offset-[#15191C] ${
                      node.enabled ? 'bg-gradient-to-r from-[#00CC99] to-[#009966]' : 'bg-[rgba(255,255,255,0.1)]'
                    }`}
                      onClick={() => handleToggleNode(node.id)}
                      role="switch"
                      aria-checked={node.enabled}
                    >
                    <span
                      className={`absolute top-1 left-1 block w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        node.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                    </button>
                    <button
                    className="p-1.5 text-[#858699] hover:bg-[#2A2F36] hover:text-[#FF4940] rounded-md transition-colors"
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
