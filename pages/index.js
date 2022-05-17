import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Home from '../components/Home'
// import WalletBalance from '../components/WalletBalance'
import Install from '../components/Install'
import { useEffect, useState } from 'react'

export default function App() {

  const [walletExist, setWalletExist] = useState(true);

  useEffect(() => {

    if (!window.ethereum) {
      setWalletExist(false);
    }

  })

  if (walletExist) {
    return (
      <>
        <Head>
          <title>NFT Boi</title>
          <link rel="icon" href=
            "/logos/eth.png"
            type="image/x-icon"></link>
        </Head>
        <Home></Home>
      </>
    )
  } else {
    return (
      <Install></Install>
    )
  }

}
