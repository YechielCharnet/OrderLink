import React, { useState, useEffect } from "react";

export default function ProviderOrders() {
  const [providerOrders, setProviderOrders] = useState([]);
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
  const [currentProviderOrderId, setCurrentProviderOrderId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/provider-orders`)
      .then((response) => response.json())
      .then((data) => setProviderOrders(data));
  }, []);

  const providerOrdersList = providerOrders.map((order) => (
    <li key={order.id}>
      {order.order_date} - {order.customer_id} - {order.provider_id} -{" "}
      {order.product} - {order.quantity} - {order.sum} - {order.paid} -{" "}
      {order.Order_status} - {order.delivery_date}
      <button onClick={() => deleteOrder(order.id)}>Delete</button>
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
    fetch("http://localhost:5000/provider-orders", {
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
        setProviderOrders((prevOrders) => [...prevOrders, data]);
        resetForm();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("There was an error with your request: " + error.message);
      });
  };

  const deleteOrder = (id) => {
    fetch(`http://localhost:5000/provider-orders/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setProviderOrders((prevOrders) =>
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
    setCurrentProviderOrderId(order.id);
    setShowForm(true); // Show form when updating
  };

  const updateOrder = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/provider-orders/${currentProviderOrderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update provider order");
        }
        return response.json();
      })
      .then((updatedOrder) => {
        setProviderOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating provider order:", error);
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
    setCurrentProviderOrderId(null);
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
      {showOrders && <ul>{providerOrdersList}</ul>}

      <button onClick={toggleShowForm}>
        {showForm ? "Hide Form" : "Add New Order"}
      </button>

      {showForm && (
        <>
          <h2>{isUpdating ? "Update Order" : "Add New Order"}</h2>
          <form onSubmit={isUpdating ? updateOrder : addOrder}>
            <input
              type="text"
              name="order_date"
              placeholder="Order Date"
              value={formData.order_date || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="customer_id"
              placeholder="Customer ID"
              value={formData.customer_id || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="provider_id"
              placeholder="Provider ID"
              value={formData.provider_id || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="product"
              placeholder="Product"
              value={formData.product || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="sum"
              placeholder="Sum"
              value={formData.sum || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="paid"
              placeholder="Paid"
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
              placeholder="Delivery Date"
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
