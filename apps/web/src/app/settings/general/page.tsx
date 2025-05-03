'use client';
import React, { useState } from 'react';
import './style.css';

const GeneralSettingsPage = () => {
  const [language, setLanguage] = useState('en');

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
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
