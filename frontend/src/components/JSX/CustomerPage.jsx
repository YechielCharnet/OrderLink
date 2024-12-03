// import React, { useEffect, useState } from "react";

// export default function CustomerPage() {
//   const userId = localStorage.getItem("userId");
//   const [orders, setOrders] = useState([]);
//   const [sortCriterion, setSortCriterion] = useState("id");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchCriterion, setSearchCriterion] = useState("id");
//   const [newOrder, setNewOrder] = useState("");
//   const [error, setError] = useState("");
//   const [showOrders, setShowOrders] = useState(false);

//   const fetchOrders = () => {
//     if (userId) {
//       fetch(`${process.env.REACT_APP_API_URL}/orders?userId=${userId}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           setOrders(data);
//           setError("");
//         })
//         .catch((error) => {
//           console.error("Error loading orders:", error);
//           setError("Failed to load orders. Please try again.");
//         });
//     } else {
//       setError("User ID not found. Please log in again.");
//     }
//   };

//   const sortOrders = (criterion) => {
//     let sortedOrders = [...orders];
//     switch (criterion) {
//       case "id":
//         sortedOrders.sort((a, b) => a.id - b.id);
//         break;
//       case "status":
//         sortedOrders.sort((a, b) => a.status.localeCompare(b.status));
//         break;
//       case "order_date":
//         sortedOrders.sort((a, b) => a.order_date.localeCompare(b.order_date));
//         break;
//       default:
//         break;
//     }
//     setOrders(sortedOrders);
//   };

//   useEffect(() => {
//     sortOrders(sortCriterion);
//   }, [sortCriterion]);

//   const filteredOrders = orders.filter((order) => {
//     switch (searchCriterion) {
//       case "id":
//         return order.id.toString().includes(searchTerm);
//       case "status":
//         return order.status.toLowerCase().includes(searchTerm.toLowerCase());
//       case "order_date":
//         return order.order_date.includes(searchTerm);
//       default:
//         return true;
//     }
//   });

//   const addOrder = () => {
//     if (newOrder.trim() !== "") {
//       fetch("http://localhost:5000/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title: newOrder, userId }),
//       })
//         .then((response) => response.json())
//         .then((newOrderData) => {
//           setOrders((prevOrders) => [...prevOrders, newOrderData]);
//           setNewOrder("");
//         })
//         .catch((error) => console.error("Error adding order:", error));
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Orders for User</h1>
//       <button onClick={() => {
//         setShowOrders(true);
//         fetchOrders();
//       }}>
//         Show Orders
//       </button>
//       {error && <p className="error">{error}</p>}
//       {showOrders && (
//         <>
//           <div className="filters">
//             <h3>Sort Orders</h3>
//             <select
//               value={sortCriterion}
//               onChange={(e) => setSortCriterion(e.target.value)}
//             >
//               <option value="id">By ID</option>
//               <option value="status">By Status</option>
//               <option value="order_date">By Order Date</option>
//             </select>
//           </div>
//           <div className="search">
//             <h3>Search Orders</h3>
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select
//               value={searchCriterion}
//               onChange={(e) => setSearchCriterion(e.target.value)}
//             >
//               <option value="id">By ID</option>
//               <option value="status">By Status</option>
//               <option value="order_date">By Order Date</option>
//             </select>
//           </div>
//           <div className="new-order">
//             <h3>Add New Order</h3>
//             <input
//               type="text"
//               placeholder="New Order Title"
//               value={newOrder}
//               onChange={(e) => setNewOrder(e.target.value)}
//             />
//             <button onClick={addOrder}>Add Order</button>
//           </div>
//           <div className="orders-list">
//             <ul>
//               {filteredOrders.map((order) => (
//                 <li key={order.id}>
//                   <strong>ID:</strong> {order.id}, <strong>Status:</strong> {order.status}, <strong>Date:</strong> {order.order_date}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";

export default function CustomerPage() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "", address: "", totalPaid: 0, remaining: 0, openOrders: 0 });
  const [sortCriterion, setSortCriterion] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriterion, setSearchCriterion] = useState("id");
  const [newOrder, setNewOrder] = useState("");
  const [error, setError] = useState("");
  const [showOrders, setShowOrders] = useState(false);

  // Fetch user information
  const fetchUserInfo = () => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/userProfile/${userId}/profile`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setUserInfo(data))
        .catch((error) => console.error("Error loading user info:", error));
    } else {
      setError("User ID not found. Please log in again.");
    }
  };

  // Update user information
  const updateUserInfo = () => {
    fetch(`${process.env.REACT_APP_API_URL}/userProfile/${userId}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Profile updated successfully!");
        }
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };

  // Add a new order
  const addOrder = () => {
    if (!newOrder.trim()) {
      alert("הזמנה לא יכולה להיות ריקה");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}orders/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, title: newOrder }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Order added successfully!");
          setNewOrder("");
          fetchOrders(); // Refresh orders after adding
        }
      })
      .catch((error) => console.error("Error adding order:", error));
  };

  // Fetch orders for the user
  const fetchOrders = () => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/orders?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setOrders(data))
        .catch((error) => console.error("Error loading orders:", error));
    } else {
      setError("User ID not found. Please log in again.");
    }
  };

  // Filter orders based on search criteria
  const filteredOrders = orders.filter((order) => {
    switch (searchCriterion) {
      case "id":
        return order.id.toString().includes(searchTerm);
      case "status":
        return order.status.toLowerCase().includes(searchTerm.toLowerCase());
      case "order_date":
        return order.order_date.includes(searchTerm);
      default:
        return true;
    }
  });

  // UseEffect to fetch data on component mount
  useEffect(() => {
    fetchUserInfo();
    fetchOrders();
  }, [userId]); // Added userId as a dependency to re-fetch data if it changes

  return (
    <div className="customer-page">
      {/* תפריט עליון */}
      <header>
        <div className="logo">Your Company</div>
        <nav>
          <ul>
            <li><a href="#profile">פרופיל אישי</a></li>
            <li><a href="#orders">הזמנות</a></li>
            <li><a href="#contact">צור קשר</a></li>
          </ul>
        </nav>
      </header>

      {/* פרופיל אישי */}
      <section id="profile" className="profile-section">
        <h2>פרופיל אישי</h2>
        <p><strong>שם:</strong> {userInfo.name}</p>
        <p><strong>אימייל:</strong> {userInfo.email}</p>
        <p><strong>טלפון:</strong> {userInfo.phone}</p>
        <p><strong>כתובת:</strong> {userInfo.address}</p>
        <p><strong>סכום ששולם:</strong> ₪{userInfo.totalPaid}</p>
        <p><strong>סכום שנותר:</strong> ₪{userInfo.remaining}</p>
        <p><strong>מספר הזמנות פתוחות:</strong> {userInfo.openOrders}</p>
        <button onClick={updateUserInfo}>עדכן פרופיל</button> {/* Add button for updating user info */}
      </section>

      {/* הזמנות */}
      <section id="orders" className="orders-section">
        <h2>הזמנות</h2>
        <input
          type="text"
          placeholder="חפש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSearchCriterion(e.target.value)}>
          <option value="id">מספר הזמנה</option>
          <option value="status">סטטוס</option>
          <option value="order_date">תאריך</option>
        </select>
        <button onClick={() => setShowOrders(!showOrders)}>
          {showOrders ? "הסתר הזמנות" : "הצג הזמנות"}
        </button>
        {showOrders && (
          <table>
            <thead>
              <tr>
                <th>מספר הזמנה</th>
                <th>תאריך</th>
                <th>סטטוס</th>
                <th>מוצרים</th>
                <th>סכום</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.order_date}</td>
                  <td>{order.status}</td>
                  <td>{order.products}</td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <input 
          type="text" 
          value={newOrder} 
          onChange={(e) => setNewOrder(e.target.value)} 
          placeholder="הזמנה חדשה"
        />
        <button onClick={addOrder}>הוסף הזמנה</button> {/* Button to add a new order */}
      </section>

      {/* צור קשר */}
      <section id="contact" className="contact-section">
        <h2>צור קשר</h2>
        <form>
          <label>נושא:</label>
          <select>
            <option>שאלה לגבי הזמנה</option>
            <option>בקשה לתמיכה טכנית</option>
            <option>אחר</option>
          </select>
          <label>הודעה:</label>
          <textarea placeholder="כתוב את הודעתך כאן..."></textarea>
          <button type="submit">שלח</button>
        </form>
      </section>
    </div>
  );
}

