import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // נתוני המוצרים
  const [products, setProducts] = useState([]);
  console.log(products);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // טוען את פרטי המשתמש
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Profile/${userId}/profile`);
      setUserInfo(response.data);
    } catch (err) {
      setError("לא ניתן לטעון את פרטי המשתמש.");
    }
  };

  // טוען את ההזמנות של המשתמש
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Profile/${userId}/orders`);
      setOrders(response.data);
      setFilteredOrders(response.data);  // מגדיר את כל ההזמנות בהתחלה
    } catch (err) {
      setError("לא ניתן לטעון את ההזמנות.");
    }
  };

  // טוען את המוצרים
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/products`);
      setProducts(response.data);
    } catch (err) {
      setError("לא ניתן לטעון את המוצרים.");
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("לא נמצא מזהה משתמש. נא להיכנס מחדש.");
    } else {
      fetchUserInfo();
      fetchOrders();
      fetchProducts();
    }
  }, [userId]);

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/profile/${userId}/update`, formData);
      setShowForm(false);
      fetchUserInfo();  // טוען את פרטי המשתמש מחדש
    } catch (err) {
      setError("לא ניתן לעדכן את פרטי המשתמש.");
    }
  };

  const handleUpdateClick = () => {
    setShowForm(true);
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
      fetchOrders();  // טוען את ההזמנות מחדש
    } catch (err) {
      setError("לא ניתן להוסיף הזמנה.");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = orders.filter(order =>
      order.id.toString().includes(query) ||
      order.product.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  // פונקציה לעדכון בחירת מוצר
const handleProductChange = (e) => {
  const productId = e.target.value;
 
 setSelectedProductId(productId);

  // מצא את המוצר שנבחר מתוך רשימת המוצרים
  const selectedProduct = products.find(product => product.id === parseInt(productId));
console.log("selectedProduct -", selectedProduct);

  // אם המוצר נמצא, עדכן את המחיר
  if (selectedProduct) {
    setPrice(selectedProduct.price);
  } else {
    // אם לא נמצא, ננקה את המחיר
    setPrice(0);
  }
};


  return (
    <div>
      {error && <p className="error-message">{error}</p>}

      <h1>ברוך הבא, {userInfo.name}</h1>

      <div className="user-info">
        <p><strong>שם:</strong> {userInfo.name}</p>
        <p><strong>טלפון:</strong> {userInfo.phone}</p>
        <p><strong>כתובת:</strong> {userInfo.address}</p>
        <p><strong>אימייל:</strong> {userInfo.email}</p>
      </div>

      <button onClick={handleUpdateClick}>ערוך פרופיל</button>
      {showForm && (
        <form onSubmit={updateUser}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="שם"
          />
          <input
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="אימייל"
          />
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="טלפון"
          />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="כתובת"
          />
          <button type="submit">עדכן</button>
          <button type="button" onClick={resetForm}>ביטול</button>
        </form>
      )}

      <h2>הזמנות</h2>
      <input
        type="text"
        placeholder="חפש הזמנה"
        onChange={handleSearch}
      />
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
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_date}</td>
                <td>{order.status}</td>
                <td>{order.product_name}</td>
                <td>{order.price}</td> {/* כאן מציגים את המחיר של המוצר */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>הוסף הזמנה</h2>
      <form onSubmit={handleOrderSubmit}>
        <select onChange={handleProductChange}>
          <option value="">בחר מוצר</option>
          {products.map(product => (
            <option key={product.id} value={product.id} id={product.id}>
              {product.name} {/* כאן אנו מציגים את שם המוצר */}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="כמות"
        />

        <p>מחיר: ₪{price}</p>

        <button type="submit">הוסף הזמנה</button>
      </form>
    </div>
  );
};

export default CustomerPage;
