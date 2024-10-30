import React, { useState } from 'react';
import './App.css';
import Providers from './componnets/Providers';
import Orders from './componnets/Orders';
import Customers from './componnets/Customers';

function App() {
  const [showCustomers, setShowCustomers] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const toggleCustomers = () => setShowCustomers(prev => !prev);
  const toggleProviders = () => setShowProviders(prev => !prev);
  const toggleOrders = () => setShowOrders(prev => !prev);

  return (
    <div className="App">
      <h1>Manage Your Business</h1>
      <button onClick={toggleCustomers}>Customers</button>
      <button onClick={toggleProviders}>Providers</button>
      <button onClick={toggleOrders}>Orders</button>

      {showCustomers && <Customers />}
      {showProviders && <Providers />}
      {showOrders && <Orders />}
    </div>
  );
}

export default App;
