'use client';
import { receiveIcon } from '@/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import './style.css'
import ReceiveModal from '../receive-modal'

const ReceivePac: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-receive btn-sm receive-button"
        type="button"
        aria-label="Receive PAC tokens"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="receive-button__icon">
          <Image
            src={receiveIcon}
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
        </span>
        <span className="receive-button__text">Receive</span>
      </button>

      <ReceiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default ReceivePac
