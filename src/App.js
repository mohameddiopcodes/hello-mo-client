// import logo from './logo.svg';
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import moment from 'moment'
import contractConfiguration from './utils/HelloMo.json'
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [allHellos, setAllHellos] = useState([])
  const contractAddress = '0xe598d038002B1aaE57313661701b000e6B609f3a'
  const contractABI = contractConfiguration.abi
  const [helloCount, setHelloCount] = useState()

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
        console.log("We have the ethereum object");
      }
      const accounts = ethereum.request({method: 'eth_accounts'})
    
      if(accounts.length !== 0) {
        console.log('Found a wallet', accounts[0])
        setCurrentAccount(accounts[0])
        getAllHellos()
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

        const input = document.querySelector('input')
        const Txn = await Contract.sayHello(input.value, { gasLimit: 300000 });
        console.log("Mining...", Txn.hash);

        await Txn.wait();
        console.log("Mined -- ", Txn.hash);

        let count = await Contract.getTotalHellos()
        console.log("Retrieved total wave count...", count.toNumber());
        setHelloCount(count.toNumber())
        getAllHellos()
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error)
    }
  }

  const getAllHellos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const hellos = await Contract.getAllHellos();

        let hellosCleaned = [];
        hellos.forEach(hello => {
          hellosCleaned.push({
            address: hello.from,
            timestamp: new Date(hello.timestamp * 1000),
            message: hello.message
          });
        });
        Contract.on('NewHello', (from, timestamp, message) => {
          hellosCleaned.push({
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          });
        })

        setAllHellos(hellosCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

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
      <div class='input-box'>
        <input type='text'/>
        <button className="helloButton" onClick={sayHello}>
          Hello
        </button>
      </div>
      {!currentAccount && 
      <button className="helloButton" onClick={connectWallet}>
        Connect Wallet
      </button>
      }
      <div class='posts'>
      {allHellos.map((hello, index) => {
          return (
            <div class='post' key={index}>
              <p class='message'>{hello.message}</p>
              <p class='address'>From {hello.address}</p>
              <p class='date'>{moment(hello.timestamp).format('LLLL')}</p>
            </div>)
        })}
      </div>
    </div>
  </div>
  );
}

export default App;
