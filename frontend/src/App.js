import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import Registration from './components/Registration';
import ManagerHP from './components/ManagerHP';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showManagerHP, setShowManagerHP] = useState(false);

  const changeComponent = (component) => {
    setShowLoginForm(false);
    setShowRegistration(false);
    setShowManagerHP(false);
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
      default:
        setShowLoginForm(true);
        break;
    }
    
    if (component === 'login') setShowLoginForm(true);
  };

  return (
    <div className="App">

      {showLoginForm && <LoginForm changeComponent={changeComponent} />}
      {showRegistration && <Registration changeComponent={changeComponent}/>}
      {showManagerHP && <ManagerHP changeComponent={changeComponent}/>}

     
    </div>
  );
}

export default App;

