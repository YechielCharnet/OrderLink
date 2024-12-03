import React, { useState } from "react";

function Navbar({ toggleCustomers, toggleProviders, toggleOrders, toggleProviderOrders, logout }) {
  const [activeButton, setActiveButton] = useState("");

  const handleButtonClick = (button) => {
    setActiveButton(button);
    // קריאה לפונקציות לפי הכפתור שנבחר
    switch (button) {
      case "customers":
        toggleCustomers();
        break;
      case "providers":
        toggleProviders();
        break;
      case "orders":
        toggleOrders();
        break;
      case "providerOrders":
        toggleProviderOrders();
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  return (
    <nav className="navbar">
      <button
        className={activeButton === "customers" ? "active" : ""}
        onClick={() => handleButtonClick("customers")}
      >
        Customers
      </button>
      <button
        className={activeButton === "providers" ? "active" : ""}
        onClick={() => handleButtonClick("providers")}
      >
        Providers
      </button>
      <button
        className={activeButton === "orders" ? "active" : ""}
        onClick={() => handleButtonClick("orders")}
      >
        Orders
      </button>
      <button
        className={activeButton === "providerOrders" ? "active" : ""}
        onClick={() => handleButtonClick("providerOrders")}
      >
        Provider Orders
      </button>
      {/* <button
        className={activeButton === "logout" ? "active" : ""}
        onClick={() => handleButtonClick("logout")}
      >
        Logout
      </button> */}
    </nav>
  );
}

export default Navbar;
