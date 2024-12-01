import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/current-user'); // קריאה ל-API כדי לבדוק אם יש משתמש מחובר
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data); // אם כן, עדכון הסטטוס של המשתמש
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data); // עדכון המשתמש המתחבר
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    await fetch('/api/logout');
    setUser(null); // עדכון הסטטוס ל-null
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};