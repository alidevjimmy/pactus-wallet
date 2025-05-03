'use client';
import React, { Suspense } from 'react';
import './style.css';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import RefetchBalance from '@/components/refetch';
import Image from 'next/image';
import { searchIcon, simpleLogo, transactions } from '@/assets';
import SendPac from '@/components/send';
import ReceivePac from '@/components/receive';
import BridgePac from '@/components/bridge';
import { useBalance } from '@/wallet/hooks/use-balance';
import TransactionsHistory from '@/components/transactions-history';

const Dashboard = () => {
  const { balance } = useBalance();
  return (
    <Suspense
      fallback={
        <div className="dashboard__loading" aria-label="Loading dashboard">
          <span className="visually-hidden">Loading dashboard content</span>
          Loading...
        </div>
      }
    >
      <main className="dashboard">
        <Sidebar />
        <div className="dashboard__content">
          <Header title="Overview" />

          <section className="dashboard__summary">
            <div className="dashboard__balance-container">
              <div className="dashboard__balance-section">
                <div className="dashboard__balance-header">
                  <h2 className="dashboard__balance-title">Total Balance</h2>
                  <RefetchBalance />
                </div>

                <div className="dashboard__balance-amount">
                  <Image src={simpleLogo} alt="Pactus logo" className="wallet__currency-icon" />

                  <p className="dashboard__balance-value">{balance}</p>
                  <span className="dashboard__balance-currency">PAC</span>
                </div>

                <div className="dashboard__balance-fiat">
                  <span className="dashboard__fiat-value">≈ 0 USD</span>
                </div>

                <div className="dashboard__actions">
                  <SendPac />
                  <ReceivePac />
                  <BridgePac />
                </div>
              </div>
            </div>

            <hr className="dashboard__divider" />

            <div className="dashboard__stats">
              <div className="dashboard__stat-item">
                <div className="dashboard__stat-header">
                  <hr className="dashboard__stat-indicator" />
                  <p className="dashboard__stat-title">Total Accounts</p>
                </div>
                <span className="dashboard__stat-value">0</span>
              </div>

              <div className="dashboard__stat-item">
                <div className="dashboard__stat-header">
                  <hr className="dashboard__stat-indicator" />
                  <p className="dashboard__stat-title">Total Transactions</p>
                </div>
                <span className="dashboard__stat-value">0</span>
              </div>
            </div>
          </section>

          <section className="dashboard__activity">
            <div className="dashboard__activity-header">
              <h2 className="dashboard__activity-title">Overall Activity</h2>

              <div className="dashboard__activity-search">
                <label htmlFor="search-transactions" className="visually-hidden">
                  Search transactions
                </label>
                <Image
                  src={searchIcon}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="dashboard__search-icon"
                />
                <input
                  id="search-transactions"
                  className="dashboard__search-input"
                  type="search"
                  placeholder="Search by tx hash or address"
                />
              </div>

              <div className="dashboard__activity-filters">
                <button
                  type="button"
                  className="dashboard__filter-button"
                  aria-pressed="false"
                >
                  1D
                </button>
                <button
                  type="button"
                  className="dashboard__filter-button"
                  aria-pressed="false"
                >
                  7D
                </button>
                <button
                  type="button"
                  className="dashboard__filter-button dashboard__filter-button--active"
                  aria-pressed="true"
                >
                  All
                </button>
              </div>
            </div>

            <hr className="dashboard__divider" />

            <div className="dashboard__transactions-list">
              <TransactionsHistory transactions={transactions} height={'90%'} />
            </div>
          </section>
        </div>
      </main>
    </Suspense>
  );
};

export default Dashboard;
