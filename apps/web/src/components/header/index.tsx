import React, { useState } from 'react';
import './style.css';
import Image from 'next/image';
import { logoutIcon } from '@/assets';
import { useWallet } from '@/wallet';
import ConfirmModal from '@/components/confirm-modal';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { setWallet } = useWallet();
  const [showSignOutConfirmModal, setShowSignOutConfirmModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setWallet(null);
    window.location.href = '/get-started';
  };

  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">{title}</h1>
        <button
          type="button"
          className="btn btn-icon header__logout-button"
          onClick={() => setShowSignOutConfirmModal(true)}
          aria-label="Log out of wallet"
        >
          <Image
            src={logoutIcon}
            width={24}
            height={24}
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      <ConfirmModal
        isOpen={showSignOutConfirmModal}
        onClose={() => setShowSignOutConfirmModal(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="This action will remove all wallet data from your browser's local storage. Ensure your seed phrase is securely backed up — without it, wallet recovery is impossible."
        confirmText="Sign Out"
        isDestructive={true}
      />
    </header>
  );
};

export default Header;
