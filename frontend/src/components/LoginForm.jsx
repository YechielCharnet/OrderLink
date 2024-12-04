import React, { useState } from 'react';

export default function LoginForm({ changeComponent }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_API_URL);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok){
        console.log('Login successful!');
        const data = await response.json();
        switch (data.role) {
          case "admin":
            changeComponent("admin");
            break;
        
          default:
            changeComponent("login");
            break;
        }
      }
      else
        response.json().then((data) => alert(data.message));
    }
    catch (error) {
      console.log('Error logging in:', error);
    }
  };
  return (
    <div>
      <h1>Welcome to Order Link</h1>
      <h2>Please login or register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
        <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log in</button>
      </form>
      <button onClick={() => changeComponent("register")}>Register</button>
    </div>
  );
};


