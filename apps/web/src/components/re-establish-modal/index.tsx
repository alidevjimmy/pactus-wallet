import React from 'react';
import { useRouter } from 'next/navigation';

interface ReEstablishModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReEstablishModal({ isOpen, onClose }: ReEstablishModalProps) {
    const [agreed, setAgreed] = React.useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleReEstablish = () => {
        if (agreed) {
            router.push('/get-started');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1C1C1E] rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-white text-lg font-medium">Re-establish wallet</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-gray-300 text-sm mb-6">
                    Re-establishing your crypto wallet will permanently remove all wallet data, and it cannot be recovered.
                </p>

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="agree-checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-transparent text-teal-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor="agree-checkbox" className="ml-2 text-sm text-gray-300">
                        I agree to re-establish my wallet
                    </label>
                </div>

                <button
                    onClick={handleReEstablish}
                    disabled={!agreed}
                    className="w-full py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Re-establish
                </button>
            </div>
        </div>
    );
}
