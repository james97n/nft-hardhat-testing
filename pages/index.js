import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Home from '../components/Home'
// import WalletBalance from '../components/WalletBalance'
import Install from '../components/Install'
import { useEffect, useState } from 'react'

export default function App() {

  const [walletExist, setWalletExist] = useState(false);

  useEffect(() => {

    if (window.ethereum) {
      setWalletExist(true);
    }

  })


  if (walletExist) {
    return (
      <>
        <Head></Head>
        <Home></Home>
      </>
    )
  } else {
    <Install></Install>

  }

}
