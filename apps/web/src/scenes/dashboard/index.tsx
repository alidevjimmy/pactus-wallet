'use client';
import React, { Suspense } from 'react';
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
import './style.css';

const Dashboard = () => {
  const { balance } = useBalance();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center w-full h-screen text-text-primary text-lg" aria-label="Loading dashboard">
          <span className="sr-only">Loading dashboard content</span>
          Loading...
        </div>
      }
    >
      <main className="flex w-full min-h-screen">
        <Sidebar />
        <div className="w-[calc(100%-219px)] flex flex-col ml-auto">
          <Header title="Overview" />

          <section className="w-[98%] mx-auto mt-4 h-[349px] rounded-lg bg-surface-medium shadow-inner">
            <div className="flex justify-between p-4 px-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <h2 className="text-[#D2D3E0] text-lg font-semibold leading-normal">Total Balance</h2>
                  <RefetchBalance />
                </div>

                <div className="flex items-end gap-1">
                  <Image src={simpleLogo} alt="Pactus logo" className="wallet__currency-icon" />
                  <p className="text-text-primary text-[34px] font-medium leading-tight">{balance}</p>
                  <span className="text-text-disabled text-[22px] font-medium leading-tight">PAC</span>
                </div>

                <div className="flex items-center">
                  <span className="text-text-disabled text-sm">≈ 0 USD</span>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <SendPac />
                  <ReceivePac />
                  <BridgePac />
                </div>
              </div>
            </div>

            <hr className="w-full h-px bg-[#66666640] border-none" />

            <div className="flex items-center gap-6 px-6 py-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <hr className="w-0.5 h-2.5 bg-primary border-none" />
                  <p className="text-[#D2D3E0] text-xs font-semibold">Total Accounts</p>
                </div>
                <span className="text-text-disabled text-xs font-medium pl-[5px]">0</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <hr className="w-0.5 h-2.5 bg-primary border-none" />
                  <p className="text-[#D2D3E0] text-xs font-semibold">Total Transactions</p>
                </div>
                <span className="text-text-disabled text-xs font-medium pl-[5px]">0</span>
              </div>
            </div>
          </section>

          <section className="w-[98%] mx-auto my-[1%] rounded-lg bg-surface-medium shadow-inner">
            <div className="grid grid-cols-[200px,1fr,auto] items-center gap-4 px-6 pt-6 pb-4">
              <h2 className="text-[#D2D3E0] text-lg font-semibold">Overall Activity</h2>

              <div className="flex justify-center">
                <div className="activity__search">
                  <label htmlFor="search-transactions" className="visually-hidden">
                    Search transactions
                  </label>
                  <Image
                    src={searchIcon}
                    alt=""
                    aria-hidden="true"
                    width={16}
                    height={16}
                    className="activity__search-icon"
                  />
                  <input
                    id="search-transactions"
                    className="activity__search-input"
                    type="search"
                    placeholder="Search by tx hash or address"
                  />
                </div>
              </div>

              <div className="activity__time-filter">
                <button
                  type="button"
                  className="activity__filter-button"
                  aria-pressed="false"
                >
                  1D
                </button>
                <button
                  type="button"
                  className="activity__filter-button"
                  aria-pressed="false"
                >
                  7D
                </button>
                <button
                  type="button"
                  className="activity__filter-button activity__filter-button--active"
                  aria-pressed="true"
                >
                  All
                </button>
              </div>
            </div>

            <hr className="activity__divider" />

            <div className="px-6 py-4 w-full h-[90%]">
              <TransactionsHistory transactions={transactions} height={'90%'} />
            </div>
          </section>
        </div>
      </main>
    </Suspense>
  );
};

export default Dashboard;
