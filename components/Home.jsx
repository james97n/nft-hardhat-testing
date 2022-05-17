import WalletBalance from '../components/WalletBalance';
import Install from '../components/Install'
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Ayaka from '../.src/artifacts/contracts/MyNFT.sol/Ayaka.json';

function Home() {

  const [layout, setLayout] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [installed, setInstalled] = useState(false);

  const [totalMinted, setTotalMinted] = useState(0);


  const requestConnect = async () => {

    console.log('start request connect');

    await ethereum.request({ method: 'eth_requestAccounts' })
      .then((result) => {
        console.log('connected');
        return true;
      })
      .catch((error) => {
        // If the request fails, the Promise will reject with an error.
        console.log(error);
        return false;

      });

  }

  useEffect(() => {

    if (window.ethereum) {

      console.log('metamask installed');

      setInstalled(true);

      //detect if user unlocks or switches their accounts
      ethereum.on('accountsChanged', (accounts) => {
        console.log('changed');

        // isUnlocked();

      });

      //temporary disabled for a better wallet detection
      const isUnlocked = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        let unlocked;

        try {
          const accounts = await provider.listAccounts();

          unlocked = accounts.length > 0 ? true : false;

          setUnlocked(unlocked);

        } catch (e) {
          unlocked = false;
        }

      }

      // requestConnect();
      // isUnlocked();

    } else {

      // Nothing to do here... no ethereum provider found
      console.log('metamask not installed');
      setLayout(<Install />);

    }

  }, []);

  useEffect(() => {

    if (installed) {

      const provider = new ethers.providers.JsonRpcProvider(); // access blockchain without Metamask installed
      // const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // to be changed after smart contract has deployed to blockchain

      // get the smart contract
      const contract = new ethers.Contract(contractAddress, Ayaka.abi, provider);

      const getCount = async () => {

        const count = await contract.count();
        console.log('count');
        console.log(parseInt(count));
        setTotalMinted(parseInt(count));

      };

      function NFTImage({ tokenId, getCount }) {

        const contentId = 'QmXKRLXeK79DUA6maWGWPv6v1sQBpHzfWchP9xE4gomCqT'; //demo purposes
        const metadataURI = `${contentId}/${tokenId}.json`;
        // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
        const imageURI = `/images/rick.jpg`;

        const [isMinted, setIsMinted] = useState(false);
        useEffect(() => {
          getMintedStatus();
        }, [isMinted]);

        const getMintedStatus = async () => {
          const result = await contract.isContentOwned(metadataURI);
          setIsMinted(result);
        };

        const mintToken = async () => {
          const web3provider = new ethers.providers.Web3Provider(window.ethereum);

          const accounts = await web3provider.listAccounts();
          let connected = false;

          if (accounts.length < 1) {

            await requestConnect()
              .then((result) => {
                connected = true;
              });


          } else {
            connected = true;

          }

          if (connected == true) {
            // get the end user

            const signer = web3provider.getSigner();

            // get the smart contract
            const singerContract = new ethers.Contract(contractAddress, Ayaka.abi, signer);

            const connection = singerContract.connect(signer);
            const addr = connection.address;
            console.log('addr: ' + addr);
            const result = await singerContract.payToMint(addr, metadataURI, {
              value: ethers.utils.parseEther('0.05'),
            });

            await result.wait();
            getMintedStatus();
            getCount();
          }

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
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
    }

  }, [installed, totalMinted]);

  return (
    <>
      {layout}
    </>
  );

}

export default Home;
