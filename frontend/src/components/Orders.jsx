import React, { useState, useEffect } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showForm, setShowForm] = useState(false); // מצב להצגת הטופס
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
    <li key={order.id}>
      {order.order_date} - {order.customer_id} - {order.provider_id} -{" "}
      {order.product} - {order.quantity} - {order.sum} - {order.paid} -{" "}
      {order.Order_status} - {order.delivery_date}
      <button onClick={() => deleteOrders(order.id)}>Delete</button>
      <button onClick={() => handleUpdateClick(order)}>Update</button>
    </li>
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
    fetch("http://localhost:5000/Orders/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          setOrders((prevOrders) => [...prevOrders, data]);
          resetForm();
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          alert("There was an error with your request: " + error.message);
        })};
      

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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update order");
        }
        return response.json();
      })
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
    setShowForm(false); // להסתיר את הטופס לאחר עדכון או הוספה
  };

  const toggleShowOrders = () => {
    setShowOrders((prev) => !prev);
  };

  const toggleShowForm = () => {
    setShowForm((prev) => !prev); // להחליף את מצב תצוגת הטופס
  };

  return (
    <div>
      <h1>Orders</h1>
      <button onClick={toggleShowOrders}>
        {showOrders ? "Hide Orders" : "Show Orders"}
      </button>
      {showOrders && <ul>{ordersList}</ul>}

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
