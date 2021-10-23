// import logo from './logo.svg';
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import contractConfiguration from './utils/HelloMo.json'
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [helloCount, setHelloCount] = useState()

  const contractAddress = '0x1DA8eF4aDB9E22BEcB5a5f0B8B615b62a8982073'
  const contractABI = contractConfiguration.abi

  const checkIfWalletIsConnected = () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = ethereum.request({method: 'eth_accounts'})
    
      if(accounts.length !== 0) {
        console.log('Found a wallet', accounts[0])
        setCurrentAccount(accounts[0])
      } else {
        console.log('No wallet found')
      }
    } catch(error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try{
      const {ethereum} = window
      if(!ethereum) {
        return
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch(error) {
      console.log(error)
    }
  }

  const sayHello = async () => {
    try {
      const {ethereum} = window
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const Contract = new ethers.Contract(contractAddress, contractABI, signer)

        const Txn = await Contract.sayHello();
        console.log("Mining...", Txn.hash);

        await Txn.wait();
        console.log("Mined -- ", Txn.hash);

        let count = await Contract.getTotalHellos()
        console.log("Retrieved total wave count...", count.toNumber());
        setHelloCount(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error)
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(checkIfWalletIsConnected)
  
  return (
    <div className="mainContainer">

    <div className="dataContainer">
      <div className="header">
      👋 Hey there!
      </div>
      <h1>{helloCount? helloCount:'...'}</h1>
      <div className="bio">
      Connect your wallet and say hello!
      </div>

      <button className="helloButton" onClick={sayHello}>
        Hello
      </button>
      {!currentAccount && 
      <button className="helloButton" onClick={connectWallet}>
        Connect Wallet
      </button>
      }
    </div>
  </div>
  );
}

export default App;
