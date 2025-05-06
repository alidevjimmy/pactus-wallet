import React, { useState } from 'react';
import Modal from '../modal';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is Pactus?',
    answer: 'Pactus is a decentralized blockchain platform designed for secure and efficient transactions. It uses a unique consensus mechanism and provides a user-friendly wallet interface for managing your digital assets.'
  },
  {
    question: 'How do I secure my wallet?',
    answer: 'To secure your wallet: 1) Never share your private key or seed phrase, 2) Store your seed phrase in a safe place offline, 3) Use a strong password, 4) Enable additional security features when available, 5) Regularly backup your wallet data.'
  },
  {
    question: 'How do I send/receive PAC?',
    answer: 'To send PAC, use the "Send" button in your wallet interface and enter the recipient\'s address and amount. To receive PAC, share your wallet address with the sender. Always double-check addresses before confirming transactions.'
  },
  {
    question: 'What is a seed phrase?',
    answer: 'A seed phrase is a series of words that serves as a backup for your wallet. It\'s crucial for wallet recovery if you lose access to your device. Never share it with anyone and store it securely offline.'
  },
  {
    question: 'How do I recover my wallet?',
    answer: 'You can recover your wallet using your seed phrase. During the recovery process, you\'ll be prompted to enter your seed phrase in the correct order. This will restore access to your wallet and funds.'
  }
];

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions">
      <div className="p-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-track-surface-medium scrollbar-thumb-surface hover:scrollbar-thumb-surface-light scrollbar-track-rounded scrollbar-thumb-rounded">
        <div className="flex flex-col gap-1">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden bg-transparent transition-all duration-300 ease-in-out ${
                expandedIndex === index ? 'bg-surface' : 'hover:bg-surface'
              }`}
            >
              <button
                className="w-full h-11 flex justify-between items-center px-4 bg-transparent border-none text-text-primary text-base font-medium text-left cursor-pointer transition-all duration-300 ease-in-out hover:bg-surface"
                onClick={() => toggleQuestion(index)}
                aria-expanded={expandedIndex === index}
              >
                <span>{faq.question}</span>
                <svg
                  className={`transition-all duration-300 ease-in-out ${
                    expandedIndex === index ? 'text-primary' : 'text-text-secondary'
                  } flex-shrink-0 w-5 h-5 p-0 m-0 flex items-center justify-center`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {expandedIndex === index ? (
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <>
                      <path
                        d="M12 5V19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out px-4 ${
                  expandedIndex === index
                    ? 'max-h-[500px] py-2 pb-4 opacity-100'
                    : 'max-h-0 py-0 opacity-0'
                }`}
              >
                <p className="text-text-secondary text-sm leading-relaxed m-0 pr-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default FAQModal;
