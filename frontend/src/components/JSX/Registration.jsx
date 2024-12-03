import React, { useState } from "react";
import MainPage from "./MainPage";
import CustomerPage from "./CustomerPage";
import ProviderPage from "./ProviderPage";

const Registration = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [registered, setRegistered] = useState(false); // מצב רישום

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${process.env.REACT_APP_API_URL}/users/register`);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: username, email, password, role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }

      const data = await response.json();
      console.log("Registration data received:", data);

      setRegistered(true); // הגדר את המשתמש כרשום
    } catch (error) {
      alert(error.message);
      console.error("Error details:", error);
    }
  };

  if (registered) {
    if (role === "admin") {
      return <MainPage />;
    }
    if (role === "provider") {
      return <ProviderPage />;
    }
    if (role === "customer") {
      return <CustomerPage />;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="customer">Customer</option>
        <option value="provider">Provider</option>
        {role !== "admin" && (
          <option value="admin">Admin (only for existing admin)</option>
        )}
      </select>

      <button type="submit">Register</button>
    </form>
  );
};

export default Registration;
