'use client';
import React from 'react';
import './style.css';

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="settings__sidebar">
      <button
        className={`settings__nav-item ${activeTab === 'general' ? 'settings__nav-item--active' : ''}`}
        onClick={() => onTabChange('general')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_282_1344)">
            <path d="M10.6654 5.33334H5.33203V10.6667H10.6654V5.33334Z" stroke="#858699" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.33203 14.6667C4.43203 14.6667 5.33203 13.7667 5.33203 12.6667V10.6667H3.33203C2.23203 10.6667 1.33203 11.5667 1.33203 12.6667C1.33203 13.7667 2.23203 14.6667 3.33203 14.6667Z" stroke="#858699" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.33203 5.33334H5.33203V3.33334C5.33203 2.23334 4.43203 1.33334 3.33203 1.33334C2.23203 1.33334 1.33203 2.23334 1.33203 3.33334C1.33203 4.43334 2.23203 5.33334 3.33203 5.33334Z" stroke="#858699" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.668 5.33334H12.668C13.768 5.33334 14.668 4.43334 14.668 3.33334C14.668 2.23334 13.768 1.33334 12.668 1.33334C11.568 1.33334 10.668 2.23334 10.668 3.33334V5.33334Z" stroke="#858699" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.668 14.6667C13.768 14.6667 14.668 13.7667 14.668 12.6667C14.668 11.5667 13.768 10.6667 12.668 10.6667H10.668V12.6667C10.668 13.7667 11.568 14.6667 12.668 14.6667Z" stroke="#858699" stroke-width="0.875" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_282_1344">
            <rect width="16" height="16" fill="white"/>
            </clipPath>
            </defs>
        </svg>

        <span>General</span>
      </button>

      <button
        className={`settings__nav-item ${activeTab === 'wallet' ? 'settings__nav-item--active' : ''}`}
        onClick={() => onTabChange('wallet')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_282_1351)">
        <path d="M12.028 9.03333C11.748 9.30666 11.588 9.7 11.628 10.12C11.688 10.84 12.348 11.3667 13.068 11.3667H14.3346V12.16C14.3346 13.54 13.208 14.6667 11.828 14.6667H4.17464C2.79464 14.6667 1.66797 13.54 1.66797 12.16V7.67335C1.66797 6.29335 2.79464 5.16667 4.17464 5.16667H11.828C13.208 5.16667 14.3346 6.29335 14.3346 7.67335V8.63335H12.988C12.6146 8.63335 12.2746 8.78 12.028 9.03333Z" stroke="#858699" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.66797 8.27334V5.22671C1.66797 4.43337 2.15464 3.72668 2.89464 3.44668L8.18797 1.44668C9.01464 1.13334 9.9013 1.7467 9.9013 2.63336V5.16669" stroke="#858699" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.0386 9.31344V10.6868C15.0386 11.0535 14.7452 11.3535 14.3719 11.3668H13.0652C12.3452 11.3668 11.6852 10.8401 11.6252 10.1201C11.5852 9.70012 11.7452 9.30679 12.0252 9.03345C12.2719 8.78012 12.6119 8.63347 12.9852 8.63347H14.3719C14.7452 8.6468 15.0386 8.94677 15.0386 9.31344Z" stroke="#858699" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.66602 8H9.33268" stroke="#858699" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <clipPath id="clip0_282_1351">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>

        <span>Wallet Manager</span>
      </button>

      <button
        className={`settings__nav-item ${activeTab === 'node' ? 'settings__nav-item--active' : ''}`}
        onClick={() => onTabChange('node')}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_282_1358)">
        <path d="M14.5 6V4C14.5 2.388 13.612 1.5 12 1.5H4C2.388 1.5 1.5 2.388 1.5 4V6C1.5 6.91067 1.79274 7.58133 2.33008 8C1.79274 8.41867 1.5 9.08933 1.5 10V12C1.5 13.612 2.388 14.5 4 14.5H12C13.612 14.5 14.5 13.612 14.5 12V10C14.5 9.08933 14.2073 8.41867 13.6699 8C14.2073 7.58133 14.5 6.91067 14.5 6ZM13.5 10V12C13.5 13.0513 13.0513 13.5 12 13.5H4C2.94867 13.5 2.5 13.0513 2.5 12V10C2.5 8.94867 2.94867 8.5 4 8.5H12C13.0513 8.5 13.5 8.94867 13.5 10ZM4 7.5C2.94867 7.5 2.5 7.05133 2.5 6V4C2.5 2.94867 2.94867 2.5 4 2.5H12C13.0513 2.5 13.5 2.94867 13.5 4V6C13.5 7.05133 13.0513 7.5 12 7.5H4ZM10.3333 5.00798C10.3333 5.37598 10.0347 5.67464 9.66667 5.67464C9.29867 5.67464 9 5.37598 9 5.00798C9 4.63998 9.29867 4.34131 9.66667 4.34131C10.0347 4.34131 10.3333 4.63998 10.3333 5.00798ZM12.3333 5.00798C12.3333 5.37598 12.0347 5.67464 11.6667 5.67464C11.2987 5.67464 11 5.37598 11 5.00798C11 4.63998 11.2987 4.34131 11.6667 4.34131C12.0347 4.34131 12.3333 4.63998 12.3333 5.00798ZM9 11C9 10.632 9.29867 10.3333 9.66667 10.3333C10.0347 10.3333 10.3333 10.632 10.3333 11C10.3333 11.368 10.0347 11.6667 9.66667 11.6667C9.29867 11.6667 9 11.368 9 11ZM11 11C11 10.632 11.2987 10.3333 11.6667 10.3333C12.0347 10.3333 12.3333 10.632 12.3333 11C12.3333 11.368 12.0347 11.6667 11.6667 11.6667C11.2987 11.6667 11 11.368 11 11Z" fill="#858699"/>
        </g>
        <defs>
        <clipPath id="clip0_282_1358">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
        </svg>

        <span>Node Manager</span>
      </button>
    </div>
  );
};

export default SettingsSidebar;
