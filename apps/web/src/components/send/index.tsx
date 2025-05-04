import { sendIcon } from '@/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import './style.css'
import SendModal from '../send-all-modal'

const SendPac: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSendAll = async (data: {
    from: string
    to: string
    amount: string
    fee: string
    memo: string
    password: string
  }) => {
    // TODO: Implement send all transaction
    console.log('Send all data:', data)
  }

  return (
    <>
    <button
      className="btn btn-send btn-sm send-button"
      type="button"
      aria-label="Send PAC tokens"
        onClick={() => setIsModalOpen(true)}
    >
      <span className="send-button__icon">
        <Image
          src={sendIcon}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
        />
      </span>
      <span className="send-button__text">Send</span>
    </button>

      <SendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendAll}
      />
    </>
  )
}

export default SendPac
