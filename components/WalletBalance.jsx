import { useState } from 'react';
import { ethers } from 'ethers';

function WalletBalance() {

  const [balance, setBalance] = useState('-');

  const getBalance = async () => {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div className="flex items-center justify-center my-10">
      <div className=''>
        <h5 className="my-5 text-lg">Your Balance: {balance}</h5>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => getBalance()}>Show My Balance</button>

      </div>

    </div>
  );
};

export default WalletBalance;