import React, { useState } from "react";
import Registration from "./Registration";
import MainPage from "./MainPage";
import CustomerPage from "./CustomerPage";
import ProviderPage from "./ProviderPage";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import './login.css';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [showLogin, setShowLogin] = useState(true);  // מצב האם להציג את טופס ההתחברות או לא

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Login successful!");
        setUserRole(data.role);
      } else {
        alert(data.message || "שגיאה בהתחברות.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // רינדור מותנה לפי תפקיד המשתמש
  if (userRole === "admin") {
    return <MainPage />;
  }
  if (userRole === "provider") {
    return <ProviderPage />;
  }
  if (userRole === "customer") {
    return <CustomerPage />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {showLogin && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Log In</button>
        </form>
      )}
    </div>
  );
}
