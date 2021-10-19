import logo from './logo.svg';
import './App.css';

function App() {
  const wave = () => {

  }
  
  return (
    <div className="mainContainer">

    <div className="dataContainer">
      <div className="header">
      👋 Hey there!
      </div>

      <div className="bio">
      Connect your wallet and say hello!
      </div>

      <button className="waveButton" onClick={wave}>
        Hello
      </button>
    </div>
  </div>
  );
}

export default App;
