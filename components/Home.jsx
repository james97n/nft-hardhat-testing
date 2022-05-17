import WalletBalance from './WalletBalance';
import Install from '../components/Install'
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Ayaka from '../.src/artifacts/contracts/MyNFT.sol/Ayaka.json';


function Home() {

  const [layout, setLayout] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {

    if (window.ethereum) {

      console.log('metamask installed');

      //detect if user unlocks or switches their accounts
      ethereum.on('accountsChanged', (accounts) => {
        console.log('changed');
        // setUnlocked(false);
        isUnlocked();

      });

      const requestConnect = async () => {
        console.log('start request connect');

        // await ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
          .then(() => {
            console.log('connected');
          });

        // console.log(accounts);

      }

      const isUnlocked = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        let unlocked;

        try {
          const accounts = await provider.listAccounts();

          unlocked = accounts.length > 0 ? true : false;

          // if (!unlocked) {
          //   await requestAcc();
          // }

          console.log('unlocked:');
          console.log(accounts.length);
          setUnlocked(unlocked);

        } catch (e) {
          unlocked = false;
        }

      }

      requestConnect();

      isUnlocked();

    } else {

      // Nothing to do here... no ethereum provider found
      console.log('metamask not installed');
      setLayout(<Install />);
      // this is for another day lalala
      // return;

    }


    // if (!window.ethereum) {
    //   // Nothing to do here... no ethereum provider found
    //   console.log('no wallet connected');
    //   // this is for another day lalala
    //   return;
    // }

    // //check whether users connect eth provider to their wallet
    // if (ethereum.isConnected()) {

    //   console.log('wallet connected');


    // ethereum.on('accountsChanged', (accounts) => {
    //   console.log('changed');
    //   // setUnlocked(false);
    //   isUnlocked();

    //   // Handle the new accounts, or lack thereof.
    //   // "accounts" will always be an array, but it can be empty.
    // });

    //   const isUnlocked = async () => {

    //     const provider = new ethers.providers.Web3Provider(window.ethereum);

    //     let unlocked;

    //     try {
    //       const accounts = await provider.listAccounts();

    //       unlocked = accounts.length > 0 ? true : false;
    //       // console.log('unlocked:');
    //       // console.log(accounts.length);
    //       setUnlocked(unlocked);

    //     } catch (e) {
    //       unlocked = false;
    //     }

    //   }

    //   isUnlocked();

    // } else {

    //   const requestAcc = async () => {
    //     console.log('start request connect');

    //     // await ethereum.request({ method: 'eth_requestAccounts' });

    //     const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    //       .then(() => {
    //         console.log('connected');
    //       });

    //     console.log(accounts);
    //     // const provider = new ethers.providers.Web3Provider(window.ethereum);

    //     // await provider.send("eth_requestAccounts", [])
    //     //   .then(() => {
    //     //     console.log('hi');
    //     //   });

    //     // const signer = provider.getSigner();
    //     // console.log("Account:", await signer.getAddress());

    //   }
    //   console.log('user didnt connect to wallet');

    //   requestAcc();
    //   setLayout(<Install />)

    // }

  }, []);

  useEffect(() => {

    if (unlocked) {

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // get the end user
      const signer = provider.getSigner();

      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

      // get the smart contract
      const contract = new ethers.Contract(contractAddress, Ayaka.abi, signer);
      // console.log(contract);

      const getCount = async () => {
        const count = await contract.count();
        console.log('count');
        console.log(parseInt(count));
        setTotalMinted(parseInt(count));
      };

      function NFTImage({ tokenId, getCount }) {
        // const contentId = 'Qmci3cQQWwhrT2nKGW4MVVst5GKbh4YZ4hiLDC8w3ffrcN';
        // const metadataURI = `${contentId}/${tokenId}.json`;
        // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

        const contentId = 'QmXKRLXeK79DUA6maWGWPv6v1sQBpHzfWchP9xE4gomCqT';
        const metadataURI = `${contentId}/${tokenId}.json`;
        // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
        const imageURI = `/images/placeholder.jpg`;
        //   const imageURI = `img / ${ tokenId }.png`;

        const [isMinted, setIsMinted] = useState(false);
        useEffect(() => {
          getMintedStatus();
        }, [isMinted]);

        const getMintedStatus = async () => {
          const result = await contract.isContentOwned(metadataURI);
          // console.log(result)
          setIsMinted(result);
        };

        const mintToken = async () => {
          const connection = contract.connect(signer);
          const addr = connection.address;
          console.log('addr: ' + addr);
          const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
          });

          await result.wait();
          getMintedStatus();
          getCount();
        };

        async function getURI() {
          const uri = await contract.tokenURI(tokenId);
          alert(uri);
        }
        return (
          <div className="p-3 " >
            {/* <img className="card-img-top" src={isMinted ? imageURI : '/images/placeholder.jpg'}></img> */}
            <img className="aspect-square" src={imageURI}></img>
            <div className="text-center">
              <h5 className="my-5">ID #{tokenId}</h5>
              {!isMinted ? (
                <button className="btn bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={mintToken}>
                  Mint
                </button>
              ) : (
                <button className="btn bg-gray-500 text-white font-bold py-2 px-4 rounded" onClick={getURI}>
                  Taken! Show URI
                </button>
              )}
            </div>
          </div>
        );
      }

      getCount();

      const Layout = <>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-1">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-span-1">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </>

      setLayout(
        <div className='flex h-screen'>
          <div className='my-auto mx-10 w-full'>
            <WalletBalance />
            <div className='border-2 border-black m-5 p-5'>
              <h1 className='text-lg font-medium text-center'> NFT Collection</h1>
              <div className="">
                {Layout}
              </div>
            </div>
          </div>
        </div>
      );

    } else {
      setLayout(<Install />);
    }

  }, [unlocked, totalMinted]);

  return (
    <>
      {layout}
    </>
  );

}

export default Home;
