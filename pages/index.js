import Head from 'next/head'
import Home from '../components/Home'

export default function App() {


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

}
