'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { copyIcon, successIcon } from '@/assets';
import ConfirmModal from '@/components/confirm-modal';
import AddNodeModal from '@/components/add-node-modal';

interface Node {
  id: string;
  title: string;
  address: string;
  ping: string;
  blockHeight: number | string;
  enabled: boolean;
  username?: string;
  password?: string;
}

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
  const [editingNode, setEditingNode] = useState<{id: string, field: 'title' | 'address'} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const savedNodes = localStorage.getItem('pactus-nodes');
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (e) {
        console.error('Failed to parse saved nodes:', e);
      }
    }
  }, []);

  // Save nodes to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('pactus-nodes', JSON.stringify(nodes));
    }
  }, [nodes, isClient]);

  const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 5000): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          ...options.headers,
          'Accept': 'application/json',
        },
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          throw new Error('Network error or CORS issue');
        }
      }
      throw error;
    }
  };

  const getBlockHeight = async (node: Node): Promise<number | string> => {
    try {
      // Ensure address has protocol and proper format
      let url = node.address;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
      }
      // Remove any trailing slashes
      url = url.replace(/\/+$/, '');

      const response = await fetch('/api/node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          method: 'pactus.blockchain.get_blockchain_info',
          params: {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Node error:', errorData);
        return 'Failed';
      }

      const data = await response.json();

      if (data.error) {
        console.error('Node error:', data.error);
        return 'Failed';
      }

      return data.result?.last_block_height || 'Failed';
    } catch (error) {
      console.error('Error getting block height:', error);
      return 'Failed';
    }
  };

  const measurePing = async (address: string, username?: string, password?: string): Promise<number> => {
    try {
      const startTime = performance.now();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      } as Record<string, string>;

      // Add Basic Auth if credentials are provided
      if (username && password) {
        const auth = btoa(`${username}:${password}`);
        headers['Authorization'] = `Basic ${auth}`;
      }

      // Ensure address has protocol and proper format
      let url = address;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
      }
      // Remove any trailing slashes
      url = url.replace(/\/+$/, '');

      await fetchWithTimeout(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'pactus.blockchain.get_block_height',
          params: {}
        })
      });
      const endTime = performance.now();
      return Math.round(endTime - startTime);
    } catch (error) {
      console.error('Error measuring ping:', error);
      return -1;
    }
  };

  // Initial ping and block height measurement for all nodes
  useEffect(() => {
    if (isClient) {
      const measureAllNodes = async () => {
        const updatedNodes = await Promise.all(
          nodes.map(async (node) => {
            const ping = await measurePing(node.address, node.username, node.password);
            const pingText = ping === -1 ? 'Failed' : `${ping}ms`;
            const blockHeight = await getBlockHeight(node);
            return { ...node, ping: pingText, blockHeight };
          })
        );
        setNodes(updatedNodes);
      };

      measureAllNodes();
    }
  }, [isClient]); // Only run when isClient changes

  const handleDeleteClick = (id: string) => {
    setSelectedNodeId(id);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedNodes = nodes.filter(node => node.id !== selectedNodeId);
    setNodes(updatedNodes);
    setShowDeleteConfirmModal(false);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddresses(prev => ({ ...prev, [address]: true }));
    setTimeout(() => {
      setCopiedAddresses(prev => ({ ...prev, [address]: false }));
    }, 2000);
  };

  const getPingColor = (ping: number): string => {
    if (ping === -1) return 'bg-[rgba(255,73,64,0.1)] text-[#FF4940]'; // Red for failed
    if (ping <= 100) return 'bg-[rgba(0,204,153,0.1)] text-[#00CC99]'; // Green for good
    if (ping <= 300) return 'bg-[rgba(255,171,0,0.1)] text-[#FFAB00]'; // Orange for medium
    if (ping <= 1000) return 'bg-[rgba(255,171,0,0.1)] text-[#FFAB00]'; // Orange for high
    return 'bg-[rgba(255,73,64,0.1)] text-[#FF4940]'; // Red for very high (>1000ms)
  };

  const handleRefreshNode = async (nodeId: string) => {
    setRefreshingNodes(prev => ({ ...prev, [nodeId]: true }));

    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const ping = await measurePing(node.address, node.username, node.password);
      const pingText = ping === -1 ? 'Failed' : `${ping}ms`;
      const blockHeight = await getBlockHeight(node);

      setNodes(prev =>
        prev.map(n =>
          n.id === nodeId
            ? {
                ...n,
                ping: pingText,
                blockHeight
              }
            : n
        )
      );
    }

    setRefreshingNodes(prev => ({ ...prev, [nodeId]: false }));
  };

  const handleAddNode = async (node: { title: string; address: string; username?: string; password?: string }) => {
    const newNode = {
      id: Date.now().toString(),
      title: node.title,
      address: node.address,
      username: node.username,
      password: node.password,
      ping: 'Connecting...',
      blockHeight: 0,
      enabled: true
    };

    setNodes(prev => [...prev, newNode]);

    const ping = await measurePing(node.address, node.username, node.password);
    const pingText = ping === -1 ? 'Failed' : `${ping}ms`;
    const blockHeight = await getBlockHeight(newNode);

    setNodes(prev =>
      prev.map(n =>
        n.id === newNode.id
          ? { ...n, ping: pingText, blockHeight }
          : n
      )
    );
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
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

  const handleEditStart = (nodeId: string, field: 'title' | 'address', currentValue: string) => {
    setEditingNode({ id: nodeId, field });
    setEditValue(currentValue || '');
  };

  const handleEditSave = async () => {
    if (!editingNode) return;

    // Don't allow empty titles or addresses
    if (!editValue.trim()) {
      return;
    }

    const updatedNodes = nodes.map(node =>
      node.id === editingNode.id
        ? { ...node, [editingNode.field]: editValue.trim() }
        : node
    );

    setNodes(updatedNodes);

    // If address was changed, refresh the ping
    if (editingNode.field === 'address') {
      const ping = await measurePing(editValue, nodes.find(n => n.id === editingNode.id)?.username, nodes.find(n => n.id === editingNode.id)?.password);
      const pingText = ping === -1 ? 'Failed' : `${ping}ms`;

      setNodes(prev =>
        prev.map(node =>
          node.id === editingNode.id
            ? { ...node, ping: pingText }
            : node
        )
      );
    }

    setEditingNode(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingNode(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

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
                  {editingNode?.id === node.id && editingNode.field === 'title' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onBlur={handleEditSave}
                      className="bg-[#2A2F36] text-[#D2D3E0] text-sm font-medium px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#00CC99]"
                      autoFocus
                      placeholder="Enter node title"
                    />
                  ) : (
                    <span
                      className="text-[#D2D3E0] text-sm font-medium cursor-pointer hover:text-white"
                      onClick={() => handleEditStart(node.id, 'title', node.title)}
                    >
                      {node.title || 'Untitled Node'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingNode?.id === node.id && editingNode.field === 'address' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onBlur={handleEditSave}
                      className="bg-[#2A2F36] text-transparent bg-clip-text bg-gradient-to-r from-[#00CC99] to-[#009966] text-sm font-medium font-mono px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#00CC99]"
                      autoFocus
                      placeholder="Enter node address (e.g., 192.168.1.1:8080 or node1.pactus.org:8080)"
                    />
                  ) : (
                    <span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CC99] to-[#009966] text-sm font-medium font-mono truncate cursor-pointer hover:opacity-80"
                      onClick={() => handleEditStart(node.id, 'address', node.address)}
                    >
                      {node.address || 'No address set'}
                    </span>
                  )}
                  <button
                    className="p-1 text-[#858699] hover:bg-[#2A2F36] hover:text-white rounded-md transition-colors"
                    onClick={() => handleCopyAddress(node.address)}
                    aria-label="Copy address to clipboard"
                    title="Copy address to clipboard"
                    disabled={!node.address}
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
                  <span className={`inline-block px-2 py-1 rounded-xl ${getPingColor(parseInt(node.ping))} text-xs font-medium`}>
                    {node.ping}
                  </span>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-xl ${
                    typeof node.blockHeight === 'number'
                      ? 'bg-[rgba(62,116,255,0.1)] text-[#3E74FF]'
                      : 'bg-[rgba(255,73,64,0.1)] text-[#FF4940]'
                  } text-xs font-medium`}>
                    {typeof node.blockHeight === 'number' ? formatNumber(node.blockHeight) : node.blockHeight}
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
