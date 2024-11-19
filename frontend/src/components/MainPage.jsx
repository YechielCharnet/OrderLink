import React, { useState } from "react";
import "../App.css";
import Providers from "./Providers";
import Orders from "./Orders";
import Customers from "./Customers";
import ProviderOrders from "./ProviderOrders";

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
      <h1>Welcome!</h1>

      <button onClick={toggleCustomers}>Customers</button>
      <button onClick={toggleProviders}>Providers</button>
      <button onClick={toggleOrders}>Orders</button>
      <button onClick={toggleProviderOrders}>Provider Orders</button>
      <button onClick={logout}>Logout</button>

      {showCustomers && <Customers />}
      {showProviders && <Providers />}
      {showOrders && <Orders />}
      {showProviderOrders && <ProviderOrders />}
    </div>
  );
}

export default MainPage;
