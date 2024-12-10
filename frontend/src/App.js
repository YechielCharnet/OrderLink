import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import LoginForm from "./components/JSX/LoginForm";
import Registration from "./components/JSX/Registration";
import ProductPage from "./components/JSX/ProductPage";
import MainPage from "./components/JSX/MainPage";
import CustomerPage from "./components/JSX/CustomerPage";
import ProviderPage from "./components/JSX/ProviderPage";
import ProviderOrders from "./components/JSX/ProviderOrders";
// import Orders from './components/JSX/Orders';
// import Customers from './components/JSX/Customers';
// import Providers from './components/JSX/Providers';

const App = () => {
  const navigate = useNavigate();

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
       
      {/* תפריט ניווט */}
      <header
        style={{
          backgroundColor: "#004080",
          color: "white",
          width: "100%",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="logo">Min Has Tam</div>
        <nav>
          <ul style={{ display: "flex", listStyle: "none", gap: "20px" }}>
            <li>
              <a href="/" style={{ color: "white" }}>
                Home
              </a>
            </li>
            <li>
              <a href="/login" style={{ color: "white" }}>
                Login
              </a>
            </li>
            <li>
              <a href="/register" style={{ color: "white" }}>
                Register
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* כותרת */}
      {/* <h1>Welcome to the Product Page</h1> */}

      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/provider" element={<ProviderPage />} />
        {/* <Route path="/orders" element={<Orders />} />
<Route path="/customers" element={<Customers />} />
<Route path="/providers" element={<Providers />} />
<Route path="/provider-orders" element={<ProviderOrders />} /> */}
      </Routes>

      {/* כפתור התחברות */}
      {/* <button onClick={() => navigate('/login')} style={buttonStyle}>
        Go to Login
      </button> */}

      {/* כפתור הרשמה */}
      {/* <button onClick={() => navigate('/register')} style={buttonStyle}>
        Register
      </button> */}

      {/* פוטר */}
      {/* <footer style={{ backgroundColor: '#f5f5f5', width: '100%', textAlign: 'center', padding: '20px 0', marginTop: '40px' }}> */}
      {/* <p>© 2024 Min Has Tam. All rights reserved.</p> */}
      {/* </footer> */}
    </div>
  );
};

// סגנון כפתור
const buttonStyle = {
  backgroundColor: "#004080",
  color: "white",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  margin: "10px 0",
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
