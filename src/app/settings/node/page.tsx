import React, { useState } from 'react';
import Image from 'next/image';
import { formatNumber } from '@/lib/utils';
import { mockNodes } from '@/data/mockNodes';
import AddNodeModal from '@/components/AddNodeModal';
import ConfirmModal from '@/components/ConfirmModal';

const NodeManagerPage = () => {
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [nodes, setNodes] = useState(mockNodes);
  const [copiedAddresses, setCopiedAddresses] = useState<{[key: string]: boolean}>({});
  const [refreshingNodes, setRefreshingNodes] = useState<{[key: string]: boolean}>({});

  const handleRefreshNode = (id: string) => {
    // Implementation of handleRefreshNode
  };

  const handleCopyAddress = (address: string) => {
    // Implementation of handleCopyAddress
  };

  const handleAddNode = (node: any) => {
    // Implementation of handleAddNode
  };

  const handleDeleteClick = (id: string) => {
    // Implementation of handleDeleteClick
  };

  const handleDeleteConfirm = () => {
    // Implementation of handleDeleteConfirm
  };

  const handleToggleNode = (id: string) => {
    // Implementation of handleToggleNode
  };

  return (
    <div className="w-full bg-surface-medium rounded-lg shadow-inner overflow-hidden">
      <div className="flex items-center justify-end gap-4 p-4 border-b border-[#1D2328]">
        <span className="text-[#858699] text-xs">
          {nodes.length} / <span className="text-[#4C4F6B]">50</span>
        </span>
        <div className="w-px h-5 bg-[#2C2D3C]"></div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2A2F36] rounded-md transition-colors"
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
                      refreshingNodes[node.id] ? 'animate-spin' : 'hover:bg-[#2A2F36]'
                    }`}
                    title="Refresh Node"
                    onClick={() => handleRefreshNode(node.id)}
                    disabled={refreshingNodes[node.id]}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#858699]">
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.7 2 18.9 3.9 20.6 6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2V6.8H17.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="text-[#D2D3E0] text-sm">{node.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#858699] text-sm font-medium font-mono truncate">{node.address}</span>
                  <button
                    className="p-1 hover:bg-[#2A2F36] rounded-md transition-colors"
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
                  <span className="inline-block px-2 py-1 rounded-xl bg-[rgba(15,239,158,0.1)] text-primary text-xs font-medium">
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
                    className={`relative w-9 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                      node.enabled ? 'bg-primary' : 'bg-[rgba(255,255,255,0.1)]'
                    }`}
                    onClick={() => handleToggleNode(node.id)}
                    role="switch"
                    aria-checked={node.enabled}
                  >
                    <span
                      className={`absolute block w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        node.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button
                    className="p-1.5 hover:bg-[#2A2F36] rounded-md transition-colors text-[#858699] hover:text-[#FF4940]"
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
