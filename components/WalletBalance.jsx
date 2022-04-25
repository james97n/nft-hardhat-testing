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
    <div className="flex w-full items-center justify-center">
      <div className='mt-40 mb-5'>
        <h5 className="my-5 text-lg">Your Balance: {balance}</h5>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => getBalance()}>Show My Balance</button>

      </div>

    </div>
  );
};

export default WalletBalance;