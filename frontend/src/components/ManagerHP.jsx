// import React, { useState } from 'react';
// import Providers from './Providers';
// import Orders from './Orders';
// import Customers from './Customers';
// import ProvideOrders from './ProvideOrders';

// export default function ManagerHP() {
//   const [showCustomers, setShowCustomers] = useState(false);
//   const [showProviders, setShowProviders] = useState(false);
//   const [showOrders, setShowOrders] = useState(false);
//   const [showProvideOrders, setShowProvideOrders] = useState(false);

//   const toggleCustomers = () => setShowCustomers(prev => !prev);
//   const toggleProviders = () => setShowProviders(prev => !prev);
//   const toggleOrders = () => setShowOrders(prev => !prev);
//   const toggleProvideOrders = () => setShowProvideOrders(prev => !prev);

//   return (
//     <div className="App">
//       <h1>Manage Your Business</h1>
//       <button onClick={toggleCustomers}>Customers</button>
//       <button onClick={toggleProviders}>Providers</button>
//       <button onClick={toggleOrders}>Orders</button>
//       <button onClick={toggleProvideOrders}>Provide orders</button>

//       {showCustomers && <Customers />}
//       {showProviders && <Providers />}
//       {showOrders && <Orders />}
//       {showProvideOrders && <ProvideOrders />}
//     </div>
//   );
// }


