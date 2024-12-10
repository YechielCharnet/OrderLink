import React, { useState, useEffect } from "react";
import '../css/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    order_date: "",
    customer_id: "",
    provider_id: "",
    product: "",
    quantity: 0,
    sum: 0,
    paid: 0,
    Order_status: "",
    delivery_date: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/Orders/orders`)
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);

  const ordersList = orders.map((order) => (
    <tr key={order.id}>
      <td>{order.order_date}</td>
      <td>{order.customer_id}</td>
      <td>{order.provider_id}</td>
      <td>{order.product}</td>
      <td>{order.quantity}</td>
      <td>{order.sum}</td>
      <td>{order.paid}</td>
      <td>{order.Order_status}</td>
      <td>{order.delivery_date}</td>
      <td className="actions-cell">
  <button className="update-button" onClick={() => handleUpdateClick(order)}>Update</button>
  <button className="delete-button" onClick={() => deleteOrders(order.id)}>Delete</button>
</td>


    </tr>
  ));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addOrder = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/Orders/orders`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders((prevOrders) => [...prevOrders, data]);
        resetForm();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("There was an error with your request: " + error.message);
      });
  };

  const deleteOrders = (id) => {
    fetch(`http://localhost:5000/Orders/orders/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== id)
        );
      });
  };

  const handleUpdateClick = (order) => {
    setFormData({
      order_date: order.order_date,
      customer_id: order.customer_id,
      provider_id: order.provider_id,
      product: order.product,
      quantity: order.quantity,
      sum: order.sum,
      paid: order.paid,
      Order_status: order.Order_status,
      delivery_date: order.delivery_date,
    });
    setIsUpdating(true);
    setCurrentOrderId(order.id);
  };

  const updateOrder = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/Orders/orders/${currentOrderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedOrder) => {
        setOrders((prevOrders) =>
          prevOrders.map((c) => (c.id === updatedOrder.id ? updatedOrder : c))
        );
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  const resetForm = () => {
    setFormData({
      order_date: "",
      customer_id: "",
      provider_id: "",
      product: "",
      quantity: 0,
      sum: 0,
      paid: 0,
      Order_status: "",
      delivery_date: "",
    });
    setIsUpdating(false);
    setCurrentOrderId(null);
    setShowForm(false);
  };

  const toggleShowOrders = () => {
    setShowOrders((prev) => !prev);
  };

  const toggleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <div>
      <h1>Orders</h1>
      <button onClick={toggleShowOrders}>
        {showOrders ? "Hide Orders" : "Show Orders"}
      </button>
      {showOrders && (
  <table className="orders-table">
    <thead>
      <tr>
        <th>Order Date</th>
        <th>Customer ID</th>
        <th>Provider ID</th>
        <th>Product</th>
        <th>Quantity</th>
        <th>Sum</th>
        <th>Paid</th>
        <th>Status</th>
        <th>Delivery Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>{ordersList}</tbody>
  </table>
)}


      <button onClick={toggleShowForm}>
        {showForm ? "Hide Form" : "Add New order"}
      </button>

      {showForm && (
        <>
          <h2>{isUpdating ? "Update order" : "Add New order"}</h2>
          <form onSubmit={isUpdating ? updateOrder : addOrder}>
            <input
              type="text"
              name="order_date"
              placeholder="order_date"
              value={formData.order_date || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="customer_id"
              placeholder="customer_id"
              value={formData.customer_id || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="product"
              placeholder="product"
              value={formData.product || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="sum"
              placeholder="sum"
              value={formData.sum || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="paid"
              placeholder="paid"
              value={formData.paid || ""}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="Order_status"
              placeholder="Order Status"
              value={formData.Order_status || ""}
              onChange={handleChange}
            />

            <input
              type="text"
              name="delivery_date"
              placeholder="delivery_date"
              value={formData.delivery_date || ""}
              onChange={handleChange}
              required
            />
            <button type="submit">
              {isUpdating ? "Update Order" : "Add Order"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
