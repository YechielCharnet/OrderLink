import React, { useState, useEffect } from "react";

const ProviderOrders = () => {
  const [providerOrders, setProviderOrders] = useState([]); // רשימת ההזמנות
  const [formData, setFormData] = useState({
    provider_id: "",
    order_id: "",
    order_date: "",
    order_to: "",
    product: "",
    quantity: "",
    price: "",
    paid: 0,
    status: 0,
    comments: "",
  });

  // שליפת כל ההזמנות מהשרת
  useEffect(() => {
    fetch("http://localhost:5000/provider_orders")
      .then((res) => res.json())
      .then((data) => setProviderOrders(data))
      .catch((err) => console.error("שגיאה בקבלת ההזמנות:", err));
  }, []);

  // הוספת הזמנה חדשה
  const handleSubmit = (e) => {
    console.log("formData:", formData);
    
    e.preventDefault();
    fetch("http://localhost:5000/provider_orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newOrder) => {
        setProviderOrders([...providerOrders, newOrder]);
        setFormData({
          provider_id: "",
          order_id: "",
          order_date: "",
          order_to: "",
          product: "",
          quantity: "",
          price: "",
          paid: 0,
          status: 0,
          comments: "",
        });
      })
      .catch((err) => console.error("שגיאה בהוספת ההזמנה:", err));
  };

  // עדכון טופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>הזמנות ספקים</h2>
      {/* טבלה להצגת כל ההזמנות */}
      <table border="1">
        <thead>
          <tr>
            <th>מזהה ספק</th>
            <th>מזהה הזמנה</th>
            <th>תאריך הזמנה</th>
            <th>תאריך יעד</th>
            <th>מוצר</th>
            <th>כמות</th>
            <th>מחיר</th>
            <th>שולם</th>
            <th>סטטוס</th>
            <th>הערות</th>
          </tr>
        </thead>
        <tbody>
          {providerOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.provider_id}</td>
              <td>{order.order_id}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>{new Date(order.order_to).toLocaleDateString()}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>{order.paid ? "כן" : "לא"}</td>
              <td>{order.status ? "הושלם" : "בתהליך"}</td>
              <td>{order.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>

   
      <h3>הוספת הזמנה חדשה</h3>
      <form onSubmit={handleSubmit}>
        <input name="provider_id" placeholder="מזהה ספק" onChange={handleChange} value={formData.provider_id} required />
        <input name="order_id" placeholder="מזהה הזמנה" onChange={handleChange} value={formData.order_id} required />
        <input type="date" name="order_date" onChange={handleChange} value={formData.order_date} required />
        <input type="date" name="order_to" placeholder="תאריך יעד" onChange={handleChange} value={formData.order_to} />
        <input name="product" placeholder="מוצר" onChange={handleChange} value={formData.product} required />
        <input name="quantity" placeholder="כמות" onChange={handleChange} value={formData.quantity} />
        <input name="price" placeholder="מחיר" onChange={handleChange} value={formData.price} />
        <select name="paid" onChange={handleChange} value={formData.paid}>
          <option value="0">לא שולם</option>
          <option value="1">שולם</option>
        </select>
        <select name="status" onChange={handleChange} value={formData.status}>
          <option value="0">בתהליך</option>
          <option value="1">הושלם</option>
        </select>
        <input name="comments" placeholder="הערות" onChange={handleChange} value={formData.comments} />
        <button type="submit">הוסף הזמנה</button>
      </form>
    </div>
  );
};

export default ProviderOrders;
