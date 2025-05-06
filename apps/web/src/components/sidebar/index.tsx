'use client';
import React, { useState } from 'react';
import './style.css';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  documentationIcon,
  FAQsIcon,
  gradientArrowToRightIcon,
  gradientCopyIcon,
  lockIcon,
  overviewIcon,
  plusIcon,
  ReportIcon,
  searchIcon,
  settingsIcon,
  activityIcon,
} from '@/assets';
import BorderBeam from '../border-beam';
import { useWallet } from '@/wallet';
import { useAccount } from '@/wallet/hooks/use-account';
import AddAccountModal from '../add-account-modal';
import FAQModal from '../faq-modal';
import { WalletStatus } from '@/wallet/types';

// External links
const REPOSITORY_URL = 'https://github.com/pactus-project/pactus-wallet/issues/new/choose';

const Sidebar = () => {
  const { wallet, setWalletStatus } = useWallet();
  const { getAccountList } = useAccount();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const navigate = useRouter().push;

  const handleLockWallet = () => {
    setWalletStatus(WalletStatus.WALLET_LOCKED);
  };

  const openAddAccountModal = () => {
    setIsAddAccountModalOpen(true);
  };

  const closeAddAccountModal = () => {
    setIsAddAccountModalOpen(false);
  };

  const openFAQModal = () => {
    setIsFAQModalOpen(true);
  };

  const closeFAQModal = () => {
    setIsFAQModalOpen(false);
  };

  const parseRoute = (route: string) => {
    const [path, queryString] = route.split('?');
    const queryParams = new URLSearchParams(queryString);
    return { path, queryParams };
  };

  const isActiveRoute = (route: string) => {
    // Special case for settings routes
    if (route === '/settings/general') {
      return pathname?.includes('/settings');
    }

    const { path, queryParams } = parseRoute(route);
    if (pathname !== path) return false;
    for (const [key, value] of queryParams) {
      if (searchParams?.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__wallet-info">
          <span className="sidebar__wallet-emoji">😀</span>
          <h2 className="sidebar__wallet-name">{wallet?.getName()}</h2>
          <button
            type="button"
            onClick={handleLockWallet}
            className="sidebar__lock-button"
            aria-label="Lock wallet"
          >
            <Image src={lockIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar__actions">
          <button
            type="button"
            className="sidebar__action-button sidebar__add-button"
            onClick={openAddAccountModal}
            aria-label="Add new account"
          >
            <Image src={plusIcon} alt="" aria-hidden="true" width={15} height={15} />
            <span>Add Account</span>
          </button>

          <button
            type="button"
            className="sidebar__action-button sidebar__search-button"
            aria-label="Search accounts"
          >
            <Image src={searchIcon} alt="" aria-hidden="true" width={16} height={16} />
          </button>
        </div>
      </div>

      <nav className="sidebar__nav">
        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/') ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => navigate('/')}
          aria-current={isActiveRoute('/') ? 'page' : undefined}
        >
          <Image src={overviewIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Overview</span>
        </button>

        <div className="sidebar__accounts">
          <div className="sidebar__accounts-divider">
            <hr />
            <div className="sidebar__account-list">
              {getAccountList()?.map((item, i) => (
                <button
                  type="button"
                  className={`sidebar__account-item ${isActiveRoute(`/wallet?address=${item?.address}`) ? 'sidebar__account-item--active' : ''}`}
                  onClick={() => navigate(`/wallet?address=${item?.address}`)}
                  key={`${i}-account`}
                  aria-current={
                    isActiveRoute(`/wallet?address=${item?.address}`) ? 'page' : undefined
                  }
                >
                  <span className="sidebar__account-emoji">{item.emoji}</span>
                  <span className="sidebar__account-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/activity') ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => navigate('/activity')}
          aria-current={isActiveRoute('/activity') ? 'page' : undefined}
        >
          <Image src={activityIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Activity</span>
        </button>
      </nav>

      <div className="sidebar__footer">
        <Link
          href="/settings/general"
          className={`sidebar__nav-item ${isActiveRoute('/settings/general') ? 'sidebar__nav-item--active' : ''}`}
        >
          <Image src={settingsIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Settings</span>
        </Link>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/documentation') ? 'sidebar__nav-item--active' : ''}`}
          aria-current={isActiveRoute('/documentation') ? 'page' : undefined}
        >
          <Image src={documentationIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Documentation</span>
        </button>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/frequently-asked-questions') ? 'sidebar__nav-item--active' : ''}`}
          onClick={openFAQModal}
          aria-current={isActiveRoute('/frequently-asked-questions') ? 'page' : undefined}
        >
          <Image src={FAQsIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">FAQs</span>
        </button>

        <button
          type="button"
          className={`sidebar__nav-item ${isActiveRoute('/report-bug') ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => window.open(REPOSITORY_URL, '_blank')}
          aria-current={isActiveRoute('/report-bug') ? 'page' : undefined}
        >
          <Image src={ReportIcon} alt="" aria-hidden="true" />
          <span className="sidebar__nav-label">Report Bug</span>
        </button>

        <div id="contributing-parent" className="sidebar__contributing">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0013 1.66675C5.41797 1.66675 1.66797 5.41675 1.66797 10.0001C1.66797 14.5834 5.41797 18.3334 10.0013 18.3334C14.5846 18.3334 18.3346 14.5834 18.3346 10.0001C18.3346 5.41675 14.5846 1.66675 10.0013 1.66675Z" stroke="url(#paint0_linear_1234_1234)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66797 10.0001C6.66797 13.3334 8.0013 15.0001 10.0013 15.0001C11.918 15.0001 13.3346 13.3334 13.3346 10.0001C13.3346 6.66675 11.918 5.00008 10.0013 5.00008C8.0013 5.00008 6.66797 6.66675 6.66797 10.0001Z" stroke="url(#paint1_linear_1234_1234)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33203 10H16.6654" stroke="url(#paint2_linear_1234_1234)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear_1234_1234" x1="1.66797" y1="1.66675" x2="18.3346" y2="18.3334" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00CC99"/>
                <stop offset="1" stopColor="#009966"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1234_1234" x1="6.66797" y1="5.00008" x2="13.3346" y2="15.0001" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00CC99"/>
                <stop offset="1" stopColor="#009966"/>
              </linearGradient>
              <linearGradient id="paint2_linear_1234_1234" x1="3.33203" y1="10" x2="16.6654" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00CC99"/>
                <stop offset="1" stopColor="#009966"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="sidebar__contributing-content">
            <h4 className="sidebar__contributing-title">Contributing</h4>
            <p className="sidebar__contributing-description">
              You can contribute to the Pactus wallet project at any time.
            </p>
            <a
              href="https://github.com/pactus-project/pactus-wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar__contributing-link"
            >
              Join <Image src={gradientArrowToRightIcon} alt="" aria-hidden="true" />
            </a>
          </div>
          <BorderBeam duration={4} size={100} parentId="contributing-parent" />
        </div>
      </div>

      <AddAccountModal isOpen={isAddAccountModalOpen} onClose={closeAddAccountModal} />
      <FAQModal isOpen={isFAQModalOpen} onClose={closeFAQModal} />
    </aside>
  );
};

export default Sidebar;
