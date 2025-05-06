'use client';
import React, { Suspense } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import SettingsSidebar from '@/components/settings-sidebar';
import { usePathname } from 'next/navigation';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop() || 'general';

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center w-full h-screen text-text-primary text-lg">
        Loading...
      </div>
    }>
      <main className="flex w-full min-h-screen bg-background">
        <Sidebar />
        <div className="w-[calc(100%-219px)] flex flex-col ml-auto">
          <Header title={`Settings / ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} />
          <div className="w-[98%] mx-auto mt-4 flex gap-6">
            <SettingsSidebar activeTab={activeTab} />
            <div className="flex-1 min-h-[calc(100vh-100px)]">
              {children}
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default SettingsLayout;
