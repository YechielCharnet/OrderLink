import logo from './logo.svg';
import './App.css';
import Providers from './componnets/Providers';
import Orders from './componnets/Orders';
import Customers from './componnets/Customers';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Customers />
        <Providers />
        <Orders />
      </header>
    </div>
  );
}

export default App;
