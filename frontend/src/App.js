import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import Registration from './components/Registration';
import ManagerHP from './components/ManagerHP';
import Customer from './components/Customer';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showManagerHP, setShowManagerHP] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  const changeComponent = (component) => {
    setShowLoginForm(false);
    setShowRegistration(false);
    setShowManagerHP(false);
    setShowCustomer(false);
    
    switch (component) {
      case "register":
        setShowRegistration(true);
        break;
      case "login":
        setShowLoginForm(true);
        break;
      case "admin":
        setShowManagerHP(true);
        break;
      case "admin":
        setShowManagerHP(true);
        break;
      case "customer":
        setShowCustomer(true);
        break;

      default:
        setShowLoginForm(true);
        break;
    }
  };

  return (
    <div className="App">

      {showLoginForm && <LoginForm changeComponent={changeComponent} />}
      {showRegistration && <Registration changeComponent={changeComponent}/>}
      {showManagerHP && <ManagerHP changeComponent={changeComponent}/>}
      {showCustomer && <Customer changeComponent={changeComponent}/>}

     
    </div>
  );
}

export default App;

