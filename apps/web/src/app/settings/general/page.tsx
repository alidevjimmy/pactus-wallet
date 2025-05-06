'use client';
import React, { useState } from 'react';

const GeneralSettingsPage = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="w-full bg-surface-medium rounded-lg shadow-inner overflow-hidden">
      <div className="p-6">
        <h3 className="text-[#D2D3E0] text-sm font-semibold mb-4">Language</h3>
        <div className="w-full max-w-sm">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full h-10 px-4 pr-10 text-sm text-[#858699] bg-[#15191C] border border-[#1D2328] rounded-sm cursor-pointer transition-colors appearance-none bg-no-repeat bg-[right_16px_center] hover:border-[#2A2F36] hover:bg-[#1D2328] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary [background-image:url('data:image/svg+xml,%3Csvg%20width%3D%2710%27%20height%3D%276%27%20viewBox%3D%270%200%2010%206%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M1%201L5%205L9%201%27%20stroke%3D%27%23858699%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E')]"
          >
            <option value="en" className="bg-[#15191C] text-[#858699] p-2">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
