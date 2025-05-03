import { RefetchBalanceIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'

const RefetchBalance = () => {
  return (
    <button className="refetch-button">
      <Image src={RefetchBalanceIcon} alt='refetch-balance-icon' />
    </button>
  )
}

export default RefetchBalance
