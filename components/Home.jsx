import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Ayaka from '../.src/artifacts/contracts/MyNFT.sol/Ayaka.json';

function Home() {

  const [layout, setLayout] = useState(null);

  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {

    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // get the end user
    const signer = provider.getSigner();

    // get the smart contract
    const contract = new ethers.Contract(contractAddress, Ayaka.abi, signer);

    // console.log(contract);

    const getCount = async () => {
      const count = await contract.count();
      // console.log(parseInt(count));
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

    useEffect
    let Layout = <>
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

    setLayout(Layout);

  }, [totalMinted]);

  // useEffect(() => {

  // }, [totalMinted]);

  return (
    <div className='flex h-screen'>
      <div className='my-auto mx-10 w-full'>
        <WalletBalance />
        <div className='border-2 border-black m-5 p-5'>
          <h1 className='text-lg font-medium text-center'> NFT Collection</h1>
          <div className="">
            {layout}
          </div>
        </div>
      </div>

    </div>
  );
}



export default Home;
