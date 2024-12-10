import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // הוספנו את ה- useNavigate
// import './login.css';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true); // מצב האם להציג את טופס ההתחברות או לא
  const navigate = useNavigate(); // הוספנו את ה-Navigate

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
        localStorage.setItem("userId", data.id);

        // נוויגציה מותנית לפי תפקיד המשתמש
        if (data.role === "admin") {
          navigate("/main"); // לנווט לדף של האדמין
        } else if (data.role === "provider") {
          navigate("/provider"); // לנווט לדף של הספק
        } else if (data.role === "customer") {
          navigate("/customer"); // לנווט לדף של הלקוח
        }
      } else {
        alert(data.message || "שגיאה בהתחברות.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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

// import React, { useState } from "react";
// import Registration from "./Registration"; // מתאים ל- JSX
// import MainPage from "./MainPage"; // מתאים ל- JSX
// import CustomerPage from "./CustomerPage"; // מתאים ל- JSX
// import ProviderPage from "./ProviderPage"; // מתאים ל- JSX
// // import { useNavigate } from "react-router-dom";
// // import { Link } from "react-router-dom";
// // import './login.css';

// export default function LoginForm() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [userRole, setUserRole] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [showLogin, setShowLogin] = useState(true); // מצב האם להציג את טופס ההתחברות או לא

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/users/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ username, password }),
//         }
//       );

//       const data = await response.json();
// console.log(data);

//       if (response.ok && data.success) {
//         console.log("Login successful!");

//         // רינדור מותנה לפי תפקיד המשתמש
//         if (data.role === "admin") {
//           localStorage.setItem("userId", data.id);
//           return <MainPage />;
//         }
//         if (data.role === "provider") {
//           localStorage.setItem("userId", data.id);
//           return <ProviderPage />;
//         }
//         if (data.role === "customer") {
//           console.log("Customer ID:", data.id);
          
//           localStorage.setItem("userId", data.id);
//           return <CustomerPage />;
//         }
//       } else {
//         alert(data.message || "שגיאה בהתחברות.");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };

//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//     >
//       {showLogin && (
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button type="submit">Log In</button>
//         </form>
//       )}
//     </div>
//   );
// }
