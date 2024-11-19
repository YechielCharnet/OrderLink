import React, { useState, useEffect } from "react";

export default function ProviderPage() {
  const userId = localStorage.getItem("userId");

  const [providerOrders, setShowProviderOrders] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriterion, setSearchCriterion] = useState("id");
  const [status, setStatus] = useState("");
  const [newComment, setNewComment] = useState(""); // מצב להוספת הערה חדשה

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/provider-orders/${userId}`)
      .then((response) => response.json())
      .then((data) => setShowProviderOrders(data))
      .catch((error) => console.error("Error loading providerOrders:", error));
  }, [userId]);

  const sortProviderOrders = (criterion) => {
    let sortedProviderOrders = [...providerOrders];
    switch (criterion) {
      case "id":
        sortedProviderOrders.sort((a, b) => a.id - b.id);
        break;
      case "status":
        sortedProviderOrders.sort((a, b) =>
          a.status.localeCompare(b.status)
        );
        break;
      case "order_date":
        sortedProviderOrders.sort((a, b) => a.order_date.localeCompare(b.order_date));
        break;
      default:
        break;
    }
    // setShowProviderOrders(sortedProviderOrders);
  };

  useEffect(() => {
    sortProviderOrders(sortCriterion);
  }, [sortCriterion, providerOrders]);

  const filteredProviderOrders = providerOrders.filter((order) => {
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

  const handleStatusChange = (orderId, newStatus) => {
    fetch(`http://localhost:5000/provider-orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Error updating status');
          });
        }
        return response.json();
      })
      .then(() => {
        setShowProviderOrders((prevProviderOrders) =>
          prevProviderOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  const handleCommentChange = (orderId, comment) => {
    fetch(`http://localhost:5000/provider-orders/${orderId}/comment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Error updating comment');
          });
        }
        return response.json();
      })
      .then(() => {
        setShowProviderOrders((prevProviderOrders) =>
          prevProviderOrders.map((order) =>
            order.id === orderId ? { ...order, comments: comment } : order
          )
        );
      })
      .catch((error) => console.error("Error updating comment:", error));
  };

  return (
    <div className="container">
      <h1>Orders for provider</h1>
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
      <div className="ProviderOrders-list">
        <ul>
          {filteredProviderOrders.map((order) => (
            <li key={order.id}>
              <strong>ID:</strong> {order.id}, <strong>Status:</strong> {order.status}, <strong>Date:</strong> {order.order_date}
              <button
                onClick={() => handleStatusChange(order.id, "delivered")}
              >
                Mark as Delivered
              </button>
              <input
                type="text"
                placeholder="Add a comment"
                value={order.comments || ""}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={() => handleCommentChange(order.id, newComment)}>
                Save Comment
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
