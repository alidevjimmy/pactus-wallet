import { bridgeIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'

const BridgePac: React.FC = () => {
  return (
    <a
      href="https://wrapto.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-bridge btn-sm bridge-button"
      aria-label="Bridge PAC tokens on Wrapto"
    >
      <span className="bridge-button__icon">
        <Image
          src={bridgeIcon}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
        />
      </span>
      <span className="bridge-button__text">Bridge</span>
    </a>
  )
}

export default BridgePac
