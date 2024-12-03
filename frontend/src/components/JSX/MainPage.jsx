import React, { useState } from "react";
import '../../App.css';
import Providers from './Providers'; 
import Orders from './Orders'; 
import Customers from './Customers'; 
import ProviderOrders from './ProviderOrders'; 
import Navbar from './Navbar'; 


function MainPage() {
  const [showCustomers, setShowCustomers] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showProviderOrders, setShowProviderOrders] = useState(false);

  // פונקציות להחלפת מצב הצגת הקטגוריות
  const toggleCustomers = () => setShowCustomers((prev) => !prev);
  const toggleProviders = () => setShowProviders((prev) => !prev);
  const toggleOrders = () => setShowOrders((prev) => !prev);
  const toggleProviderOrders = () => setShowProviderOrders((prev) => !prev);

  // פונקציה לצאת מהממשק
  const logout = () => {
    // בצע פעולה ליציאה (למשל, נקה את הסטייט של המשתמש או הפנה לדף חיבור)
  };

  return (
    <div className="App">
      {/* <h1>Welcome!</h1> */}
      {/* הוספת ה-Navbar */}
      <Navbar
        toggleCustomers={toggleCustomers}
        toggleProviders={toggleProviders}
        toggleOrders={toggleOrders}
        toggleProviderOrders={toggleProviderOrders}
        logout={logout}
      />

      {showCustomers && <Customers />}
      {showProviders && <Providers />}
      {showOrders && <Orders />}
      {showProviderOrders && <ProviderOrders />}
    </div>
  );
}

export default MainPage;
