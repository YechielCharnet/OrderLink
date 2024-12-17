import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Customers.css';

const CustomerPage = () => {
  const userId = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [newOrder, setNewOrder] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Profile/${userId}/profile`);
      setUserInfo(response.data);
    } catch {
      setError("לא ניתן לטעון את פרטי המשתמש.");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Profile/${userId}/orders`);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch {
      setError("לא ניתן לטעון את ההזמנות.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/products`);
      setProducts(response.data);
    } catch {
      setError("לא ניתן לטעון את המוצרים.");
    }
  };

  const handleUpdateClick = () => setShowForm(true);

  const resetForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/profile/${userId}/update`, formData);
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
      const orderData = {
        userId,
        productId: selectedProductId,
        quantity,
        price,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/profile/orders`, orderData);
      setNewOrder('');
      fetchOrders();
    } catch {
      setError("לא ניתן להוסיף הזמנה.");
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = orders.filter(order =>
      order.id.toString().includes(query) ||
      order.product_name.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };
  const handleSort = (column) => {
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (column === 'price') {
        return a.price - b.price;
      } else if (column === 'order_date') {
        return new Date(a.order_date) - new Date(b.order_date);
      } else if (column === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
    setFilteredOrders(sortedOrders);
  };
  

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    if (selectedProduct) setPrice(selectedProduct.price * newQuantity);
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    const selected = products.find(product => product.id === parseInt(productId));
    setSelectedProduct(selected);
    if (selected) setPrice(selected.price * quantity);
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/profile/orders/${orderId}`);
      fetchOrders();
    } catch {
      setError("לא ניתן למחוק את ההזמנה.");
    }
  };

  const updateOrder = (orderId) => {
    // Logic to update order (you can add a form or modal for editing here)
    console.log(`Update order: ${orderId}`);
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}

      <h1>ברוך הבא, {userInfo.name}</h1>

      <div className="user-info">
        <p><strong>שם:</strong> {userInfo.name}</p>
        <p><strong>טלפון:</strong> {userInfo.phone}</p>
        <p><strong>כתובת:</strong> {userInfo.address}</p>
        <p><strong>אימייל</strong> {userInfo.email}</p>
      </div>

      <button onClick={handleUpdateClick}>ערוך פרופיל</button>
      {showForm && (
        <form onSubmit={updateUser}>
          {['name', 'email', 'phone', 'address'].map((field) => (
            <input
              key={field}
              type="text"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              placeholder={field}
            />
          ))}
          <button type="submit">עדכן</button>
          <button type="button" onClick={resetForm}>ביטול</button>
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
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
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

export default CustomerPage;
