import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Ayaka from '../.src/artifacts/contracts/MyNFT.sol/Ayaka.json';


// const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// // const provider = new ethers.providers.Web3Provider(window.ethereum);
// const [provider, setProvider] = useState(null);

// // get the end user
// const signer = provider.getSigner();

// // get the smart contract
// const contract = new ethers.Contract(contractAddress, Ayaka.abi, signer);


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
    // setContract(tempContract);

    console.log(contract);

    const getCount = async () => {
      const count = await contract.count();
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
        console.log(result)
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
        <div className="card" style={{ width: '18rem' }}>
          {/* <img className="card-img-top" src={isMinted ? imageURI : '/images/placeholder.jpg'}></img> */}
          <img className="card-img-top" src={imageURI}></img>
          <div className="card-body">
            <h5 className="card-title">ID #{tokenId}</h5>
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

    let Layout = <>
      <div className="row">
        {Array(totalMinted + 1)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="col-sm">
              <NFTImage tokenId={i} getCount={getCount} />
            </div>
          ))}
      </div>
    </>

    setLayout(Layout);

  }, []);

  return (
    <div>
      <WalletBalance />

      <h1> NFT Collection</h1>
      <div className="container">
        {layout}
        {/* <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div> */}
      </div>
    </div>
  );
}



export default Home;
