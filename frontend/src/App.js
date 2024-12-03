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



// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import LoginForm from './components/LoginForm';
// import Registration from './components/Registration';
// import ProductPage from './components/ProductPage';

// const App = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       {/* תפריט ניווט */}
//       <header style={{ backgroundColor: '#004080', color: 'white', width: '100%', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
//         <div className="logo">Min Has Tam</div>
//         <nav>
//           <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
//             <li><a href="/" style={{ color: 'white' }}>Home</a></li>
//             <li><a href="/login" style={{ color: 'white' }}>Login</a></li>
//             <li><a href="/register" style={{ color: 'white' }}>Register</a></li>
//           </ul>
//         </nav>
//       </header>

//       {/* כותרת */}
//       <h1>Welcome to the Product Page</h1>

//       <Routes>
//         <Route path="/" element={<ProductPage />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/register" element={<Registration />} />
//       </Routes>

//       {/* כפתור התחברות */}
//       {/* <button onClick={() => navigate('/login')} style={buttonStyle}>
//         Go to Login
//       </button> */}

//       {/* כפתור הרשמה */}
//       {/* <button onClick={() => navigate('/register')} style={buttonStyle}>
//         Register
//       </button> */}

//       {/* פוטר */}
//       {/* <footer style={{ backgroundColor: '#f5f5f5', width: '100%', textAlign: 'center', padding: '20px 0', marginTop: '40px' }}> */}
//         {/* <p>© 2024 Min Has Tam. All rights reserved.</p> */}
//       {/* </footer> */}
//     </div>
//   );
// };


// // סגנון כפתור
// const buttonStyle = {
//   backgroundColor: '#004080',
//   color: 'white',
//   border: 'none',
//   padding: '10px 20px',
//   cursor: 'pointer',
//   margin: '10px 0',
// };

// const AppWrapper = () => (
//   <Router>
//     <App />
//   </Router>
// );

// export default AppWrapper;