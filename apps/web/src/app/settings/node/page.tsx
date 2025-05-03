'use client';
import React from 'react';
import './style.css';

const NodeManagerPage = () => {
  return (
    <div className="settings-content settings-content--full">
      <div className="settings-section">
        <h3 className="settings-section__title">Node Configuration</h3>
        <div className="settings-section__content">
          <div className="node-info">
            <div className="node-info__item">
              <span className="node-info__label">Status</span>
              <span className="node-info__value">Connected</span>
            </div>
            <div className="node-info__item">
              <span className="node-info__label">Node Address</span>
              <span className="node-info__value">localhost:8080</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeManagerPage;
