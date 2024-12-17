import React, { useState, useEffect } from "react";
import { deactivateUser, updateUser, addUser } from "./functions";
import styles from "../css/Providers.css"; // ייבוא עיצוב

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [showProviders, setShowProviders] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    total_paid_out: 0,
    open_orders: 0,
    comments: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProviderId, setCurrentProviderId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/providers`)
      .then((response) => response.json())
      .then((data) => setProviders(data))
      .catch((error) => console.error("Error fetching providers:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addProvider = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setProviders((prevProviders) => [...prevProviders, data]);
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding provider:", error);
        alert("There was an error with your request: " + error.message);
      });
  };

  const handleUpdateClick = (provider) => {
    setFormData({
      name: provider.name,
      address: provider.address,
      email: provider.email,
      phone: provider.phone,
      total_paid_out: provider.total_paid_out,
      open_orders: provider.open_orders,
      comments: provider.comments,
    });
    setIsUpdating(true);
    setCurrentProviderId(provider.id);
    setShowForm(true);
  };

  const updateProvider = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/${currentProviderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedProvider) => {
        setProviders((prevProviders) =>
          prevProviders.map((provider) =>
            provider.id === updatedProvider.id ? updatedProvider : provider
          )
        );
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating provider:", error);
      });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
      total_paid_out: 0,
      open_orders: 0,
      comments: "",
    });
    setIsUpdating(false);
    setCurrentProviderId(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Providers</h1>
      <button onClick={() => setShowProviders(!showProviders)}>
        {showProviders ? "Hide Providers" : "Show Providers"}
      </button>
      {showProviders && (
        <table className="providers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Paid Out</th>
            <th>Open Orders</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.name}</td>
              <td>{provider.address}</td>
              <td>{provider.email}</td>
              <td>{provider.phone}</td>
              <td>{provider.total_paid_out}</td>
              <td>{provider.open_orders}</td>
              <td>{provider.comments}</td>
              <td className="actions-cell">
                <button className="button-update" onClick={() => handleUpdateClick(provider)}>Update</button>
                <button className="button-delete" onClick={() => deactivateUser(provider.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      )}
      {showForm && (
        <form
          className={styles["providers-form"]}
          onSubmit={isUpdating ? updateProvider : addProvider}
        >
          <h2>{isUpdating ? "Update Provider" : "Add Provider"}</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          {/* שדות נוספים */}
          <button type="submit">{isUpdating ? "Update" : "Add"}</button>
        </form>
      )}
    </div>
  );
}
