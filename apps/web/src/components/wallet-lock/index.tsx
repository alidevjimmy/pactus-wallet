'use client';
import React, { useState, ChangeEvent } from 'react';
import { useWallet } from '@/wallet/hooks/use-wallet';
import { useAccount } from '@/wallet';
import { WalletStatus } from '@/wallet/types';
import { showPasswordIcon, hidePasswordIcon, masterPasswordLottie } from '@/assets';
import Image from 'next/image';
import Lottie from '@/components/lottie-player';
import ReEstablishModal from '@/components/re-establish-modal';
import { useRouter } from 'next/navigation';
import './style.css';

export default function WalletLock() {
    const { walletManager, setPassword, setWalletStatus } = useWallet();
    const { getMnemonic } = useAccount();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setLocalPassword] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setLocalPassword(newPassword);
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim() || isLoading) return;

        setIsLoading(true);
        try {
            if (!walletManager) {
                throw new Error('Wallet manager not initialized');
            }

            // Always verify the password first
            await getMnemonic(password);

            // Password is correct, update the states in the correct order
            setError('');
            setPassword(password);
            await setWalletStatus(WalletStatus.WALLET_UNLOCKED);

            // Navigate to dashboard after successful unlock
            router.push('/');
        } catch (err) {
            console.error('Unlock error:', err);
            setError('Incorrect password');
            setLocalPassword(''); // Clear the password field on error
            await setWalletStatus(WalletStatus.WALLET_LOCKED); // Ensure wallet stays locked
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="wallet-lock">
            <div className="wallet-lock__content">
                <Lottie
                    animationData={masterPasswordLottie}
                    className="wallet-lock__animation"
                    loop={false}
                    play
                    aria-hidden="true"
                />
                <h1 className="wallet-lock__title">Enter Master Password</h1>

                <form className="wallet-lock__form" onSubmit={handleUnlock}>
                    <div className="wallet-lock__input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className={`wallet-lock__input ${error ? 'wallet-lock__input--error' : ''}`}
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            aria-label="Master password"
                            aria-invalid={error ? 'true' : 'false'}
                            aria-describedby={error ? 'password-error' : undefined}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="wallet-lock__toggle-button"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            disabled={isLoading}
                        >
                            <Image
                                src={showPassword ? hidePasswordIcon : showPasswordIcon}
                                alt=""
                                aria-hidden="true"
                                width={24}
                                height={24}
                            />
                        </button>
                    </div>
                    {error && (
                        <p id="password-error" className="wallet-lock__error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="wallet-lock__button"
                        disabled={!password.trim() || isLoading}
                    >
                        {isLoading ? 'Unlocking...' : 'Unlock'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 text-center w-full text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 hover:opacity-80 transition-opacity font-medium"
                        disabled={isLoading}
                    >
                        Re-establish wallet
                    </button>
                </form>
            </div>

            <ReEstablishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
