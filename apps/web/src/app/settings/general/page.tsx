'use client';
import React, { Suspense, useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import SettingsSidebar from '@/components/settings-sidebar';
import WalletManagerPage from '../wallet/page';
import './style.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('en');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-content settings-content--full">
            <div className="settings-section">
              <h3 className="settings-section__title">Language</h3>
              <div className="settings-section__content">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="settings-select"
                >
                  <option value="en">English (US)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'wallet':
        return <div className="settings-content"></div>;
      case 'node':
        return <div className="settings-content"></div>;
      default:
        return <div className="settings-content"></div>;
    }
  };

  return (
    <Suspense fallback={<div className="settings__loading">Loading...</div>}>
      <main className="settings">
        <Sidebar />
        <div className="settings__content">
          <Header title={`Settings / ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} />

          <div className="settings__container">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="settings__main">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default SettingsPage;
