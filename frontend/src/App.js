import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import Registration from './components/Registration';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  const changeComponent = () => {
    setShowLoginForm(!showLoginForm);
    setShowRegistration(!showRegistration);
  };

  return (
    <div className="App">
      <div>
        <h1>Welcome to Order Link</h1>
      </div>

      {showLoginForm && <LoginForm changeComponent={changeComponent} />}
      {showRegistration && <Registration changeComponent={changeComponent}/>}

     
    </div>
  );
}

export default App;
