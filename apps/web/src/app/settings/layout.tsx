'use client';
import React, { Suspense } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import SettingsSidebar from '@/components/settings-sidebar';
import { usePathname } from 'next/navigation';
import './style.css';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop() || 'general';

  return (
    <Suspense fallback={<div className="settings__loading">Loading...</div>}>
      <main className="settings">
        <Sidebar />
        <div className="settings__content">
          <Header title={`Settings / ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} />
          <div className="settings__container">
            <SettingsSidebar activeTab={activeTab} />
            <div className="settings__main">
              {children}
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default SettingsLayout;
