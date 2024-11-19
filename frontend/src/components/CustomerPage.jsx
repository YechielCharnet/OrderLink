// import React, { useState, useEffect } from "react";

// export default function CustomerPage() {
//   const userId = localStorage.getItem("userId");

//   const [orders, setOrders] = useState([]);
//   const [sortCriterion, setSortCriterion] = useState("id");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchCriterion, setSearchCriterion] = useState("id");
//   const [newOrder, setNewOrder] = useState("");

//   // טוען את ההזמנות של המשתמש
//   // useEffect(() => {
//   //   fetch(`http://localhost:5000/orders/${userId}`)
//   //     .then((response) => response.json())
//   //     // .then((data) => setOrders(data))
//   //     .catch((error) => console.error("Error loading orders:", error));
//   // }, [userId]);

//   // מיון ההזמנות
//   const sortOrders = (criterion) => {
//     let sortedOrders = [...orders];
//     switch (criterion) {
//       case "id":
//         sortedOrders.sort((a, b) => a.id - b.id);
//         break;
//       case "status":
//         sortedOrders.sort((a, b) =>
//           a.status.localeCompare(b.status)
//         );
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
//   }, [sortCriterion, orders]);

//   // סינון לפי קריטריון חיפוש
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

//   // הוספת הזמנה חדשה
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
//           setOrders([...orders, newOrderData]);
//           setNewOrder("");
//         })
//         .catch((error) => console.error("Error adding order:", error));
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Orders for User</h1>
//       <div className="filters">
//         <h3>Sort Orders</h3>
//         <select
//           value={sortCriterion}
//           onChange={(e) => setSortCriterion(e.target.value)}
//         >
//           <option value="id">By ID</option>
//           <option value="status">By Status</option>
//           <option value="order_date">By Order Date</option>
//         </select>
//       </div>
//       <div className="search">
//         <h3>Search Orders</h3>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={searchCriterion}
//           onChange={(e) => setSearchCriterion(e.target.value)}
//         >
//           <option value="id">By ID</option>
//           <option value="status">By Status</option>
//           <option value="order_date">By Order Date</option>
//         </select>
//       </div>
//       <div className="new-order">
//         <h3>Add New Order</h3>
//         <input
//           type="text"
//           placeholder="New Order Title"
//           value={newOrder}
//           onChange={(e) => setNewOrder(e.target.value)}
//         />
//         <button onClick={addOrder}>Add Order</button>
//       </div>
//       <div className="orders-list">
//         <ul>
//           {filteredOrders.map((order) => (
//             <li key={order.id}>
//               <strong>ID:</strong> {order.id}, <strong>Status:</strong> {order.status}, <strong>Date:</strong> {order.order_date}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";

export default function CustomerPage() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriterion, setSearchCriterion] = useState("id");
  const [newOrder, setNewOrder] = useState("");

  useEffect(() => {
    // בדיקה אם יש userId
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/${userId}`)
        .then((response) => response.json())
        .then((data) => setOrders(data))
        .catch((error) => console.error("Error loading orders:", error));
    }
  }, [userId]); // useEffect יופעל רק כאשר userId משתנה

  const sortOrders = (criterion) => {
    let sortedOrders = [...orders];
    switch (criterion) {
      case "id":
        sortedOrders.sort((a, b) => a.id - b.id);
        break;
      case "status":
        sortedOrders.sort((a, b) =>
          a.status.localeCompare(b.status)
        );
        break;
      case "order_date":
        sortedOrders.sort((a, b) => a.order_date.localeCompare(b.order_date));
        break;
      default:
        break;
    }
    setOrders(sortedOrders);
  };

  // useEffect(() => {
  //   sortOrders(sortCriterion);
  // }, [sortCriterion, orders]);

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

  const addOrder = () => {
    if (newOrder.trim() !== "") {
      fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newOrder, userId }),
      })
        .then((response) => response.json())
        .then((newOrderData) => {
          setOrders((prevOrders) => [...prevOrders, newOrderData]);
          setNewOrder("");
        })
        .catch((error) => console.error("Error adding order:", error));
    }
  };

  return (
    <div className="container">
      <h1>Orders for User</h1>
      <div className="filters">
        <h3>Sort Orders</h3>
        <select
          value={sortCriterion}
          onChange={(e) => setSortCriterion(e.target.value)}
        >
          <option value="id">By ID</option>
          <option value="status">By Status</option>
          <option value="order_date">By Order Date</option>
        </select>
      </div>
      <div className="search">
        <h3>Search Orders</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={searchCriterion}
          onChange={(e) => setSearchCriterion(e.target.value)}
        >
          <option value="id">By ID</option>
          <option value="status">By Status</option>
          <option value="order_date">By Order Date</option>
        </select>
      </div>
      <div className="new-order">
        <h3>Add New Order</h3>
        <input
          type="text"
          placeholder="New Order Title"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
        />
        <button onClick={addOrder}>Add Order</button>
      </div>
      <div className="orders-list">
        <ul>
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <strong>ID:</strong> {order.id}, <strong>Status:</strong> {order.status}, <strong>Date:</strong> {order.order_date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
