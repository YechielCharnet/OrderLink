import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Customers.css";

const ProviderPage = () => {
  const userId = localStorage.getItem("userId");
  const [userInfo, setUserInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [newOrder, setNewOrder] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!userId) {
      setError("לא נמצא מזהה משתמש. נא להיכנס מחדש.");
    } else {
      fetchUserInfo();
      fetchOrders();
      fetchProducts();
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Profile/${userId}/profile`
      );
      setUserInfo(response.data);
    } catch {
      setError("לא ניתן לטעון את פרטי המשתמש.");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/provider_orders/${userId}/orders`
      );
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch {
      setError("לא ניתן לטעון את ההזמנות.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile/products`
      );
      setProducts(response.data);
    } catch {
      setError("לא ניתן לטעון את המוצרים.");
    }
  };

  const handleUpdateClick = () => setShowForm(true);

  const resetForm = () => {
    setShowForm(false);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/profile/${userId}/update`,
        formData
      );
      setShowForm(false);
      fetchUserInfo();
    } catch {
      setError("לא ניתן לעדכן את פרטי המשתמש.");
    }
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProductId) {
      setError("יש לבחור מוצר.");
      return;
    }

    try {
      const today = new Date(); // תאריך נוכחי
      const orderData = {
        provider_id: userId, // מזהה הספק (userId)
        order_date: today.toISOString().split("T")[0], // פורמט תאריך YYYY-MM-DD
        order_to: today.toISOString().split("T")[0], // אותו תאריך כברירת מחדל
        product: selectedProductId,
        quantity: quantity || 1, // ברירת מחדל לכמות 1 אם לא הוזנה
        price: price || 0, // ברירת מחדל למחיר 0 אם לא הוזן
        paid: 0, // הזמנה לא משולמת כברירת מחדל
        status: 1, // סטטוס פעיל כברירת מחדל
        comments: "", // ללא הערות כברירת מחדל
      };

      console.log("Order Data:", orderData); // הדפסה לבדיקה

      // שליחה לשרת
      await axios.post(
        `${process.env.REACT_APP_API_URL}/provider_orders/orders`,
        orderData
      );

      // איפוס השדות וטעינה מחדש
      setNewOrder("");
      fetchOrders(); // טוען מחדש את רשימת ההזמנות
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("לא ניתן להוסיף הזמנה.");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.id.toString().includes(query) ||
        order.product_name.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    if (selectedProduct) setPrice(selectedProduct.price * 0.9 * newQuantity);
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    const selected = products.find(
      (product) => product.id === parseInt(productId)
    );
    setSelectedProduct(selected);
    if (selected) setPrice(selected.price * 0.9 * quantity);
  };

  const deleteOrder = async (id) => {
    console.log(id);

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/provider_orders/orders/${id}`
      );
      fetchOrders();
    } catch {
      setError("לא ניתן למחוק את ההזמנה.");
    }
  };

  const updateOrder = (id) => {
    // Logic to update order (you can add a form or modal for editing here)
    console.log(`Update order: ${id}`);
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}

      <h1>:ברוך הבא לספק</h1>
      <h1> {userInfo.name}</h1>
      <div className="user-info">
        <p>
          <strong>שם:</strong> {userInfo.name}
        </p>
        <p>
          <strong>טלפון:</strong> {userInfo.phone}
        </p>
        <p>
          <strong>כתובת:</strong> {userInfo.address}
        </p>
        <p>
          <strong>אימייל:</strong> {userInfo.email}
        </p>
      </div>

      <button onClick={handleUpdateClick}>ערוך פרופיל</button>
      {showForm && (
        <form onSubmit={updateUser}>
          {["name", "email", "phone", "address"].map((field) => (
            <input
              key={field}
              type="text"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              placeholder={field}
            />
          ))}
          <button type="submit">עדכן</button>
          <button type="button" onClick={resetForm}>
            ביטול
          </button>
        </form>
      )}

      <h2>הזמנות</h2>
      <input type="text" placeholder="חפש הזמנה" onChange={handleSearch} />
      {orders.length === 0 ? (
        <p>אין הזמנות להצגה.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>מספר הזמנה</th>
              <th>תאריך</th>
              <th>סטטוס</th>
              <th>מוצרים</th>
              <th>סכום</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>{order.product_name}</td>
                <td>₪{order.price}</td>
                <td>
                  <button onClick={() => updateOrder(order.id)}>עדכן</button>
                  <button onClick={() => deleteOrder(order.id)}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>הוסף הזמנה חדשה</h3>
      <form onSubmit={handleOrderSubmit}>
        <select value={selectedProductId} onChange={handleProductChange}>
          <option value="">בחר מוצר</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
        <p>מחיר: ₪{price}</p>
        <button type="submit">הוסף הזמנה</button>
      </form>
    </div>
  );
};

export default ProviderPage;

// import React, { useState, useEffect } from "react";

// export default function ProviderPage() {
//   const userId = localStorage.getItem("userId");

//   const [providerOrders, setShowProviderOrders] = useState([]);
//   const [sortCriterion, setSortCriterion] = useState("id");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchCriterion, setSearchCriterion] = useState("id");
//   const [status, setStatus] = useState("");
//   const [newComment, setNewComment] = useState(""); // מצב להוספת הערה חדשה

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_API_URL}/provider-orders/${userId}`)
//       .then((response) => response.json())
//       .then((data) => setShowProviderOrders(data))
//       .catch((error) => console.error("Error loading providerOrders:", error));
//   }, [userId]);

//   const sortProviderOrders = (criterion) => {
//     let sortedProviderOrders = [...providerOrders];
//     switch (criterion) {
//       case "id":
//         sortedProviderOrders.sort((a, b) => a.id - b.id);
//         break;
//       case "status":
//         sortedProviderOrders.sort((a, b) =>
//           a.status.localeCompare(b.status)
//         );
//         break;
//       case "order_date":
//         sortedProviderOrders.sort((a, b) => a.order_date.localeCompare(b.order_date));
//         break;
//       default:
//         break;
//     }
//     // setShowProviderOrders(sortedProviderOrders);
//   };

//   useEffect(() => {
//     sortProviderOrders(sortCriterion);
//   }, [sortCriterion, providerOrders]);

//   const filteredProviderOrders = providerOrders.filter((order) => {
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

//   const handleStatusChange = (orderId, newStatus) => {
//     fetch(`${process.env.REACT_APP_API_URL}/${orderId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ status: newStatus }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           return response.json().then((data) => {
//             throw new Error(data.message || 'Error updating status');
//           });
//         }
//         return response.json();
//       })
//       .then(() => {
//         setShowProviderOrders((prevProviderOrders) =>
//           prevProviderOrders.map((order) =>
//             order.id === orderId ? { ...order, status: newStatus } : order
//           )
//         );
//       })
//       .catch((error) => console.error("Error updating status:", error));
//   };

//   const handleCommentChange = (orderId, comment) => {
//     fetch(`${process.env.REACT_APP_API_URL}/${orderId}/comment`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ comment }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           return response.json().then((data) => {
//             throw new Error(data.message || 'Error updating comment');
//           });
//         }
//         return response.json();
//       })
//       .then(() => {
//         setShowProviderOrders((prevProviderOrders) =>
//           prevProviderOrders.map((order) =>
//             order.id === orderId ? { ...order, comments: comment } : order
//           )
//         );
//       })
//       .catch((error) => console.error("Error updating comment:", error));
//   };

//   return (
//     <div className="container">
//       <h1>Orders for provider</h1>
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
//       <div className="ProviderOrders-list">
//         <ul>
//           {filteredProviderOrders.map((order) => (
//             <li key={order.id}>
//               <strong>ID:</strong> {order.id}, <strong>Status:</strong> {order.status}, <strong>Date:</strong> {order.order_date}
//               <button
//                 onClick={() => handleStatusChange(order.id, "delivered")}
//               >
//                 Mark as Delivered
//               </button>
//               <input
//                 type="text"
//                 placeholder="Add a comment"
//                 value={order.comments || ""}
//                 onChange={(e) => setNewComment(e.target.value)}
//               />
//               <button onClick={() => handleCommentChange(order.id, newComment)}>
//                 Save Comment
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
