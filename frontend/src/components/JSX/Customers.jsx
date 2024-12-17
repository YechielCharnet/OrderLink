import React, { useState, useEffect } from "react";
import '../css/Customers.css';
import { deactivateUser, updateUser } from "./functions";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/customers`)
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setUpdatedData({
      name: customer.name,
      address: customer.address,
      email: customer.email,
      phone: customer.phone
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdateSubmit = () => {
    updateUser(selectedCustomer.id, updatedData, setCustomers);
    setSelectedCustomer(null); // סגירת הדיאלוג אחרי עדכון
  };

  return (
    <div>
      <button onClick={() => setShowCustomers(!showCustomers)}>
        {showCustomers ? "Hide Customers" : "Show Customers"}
      </button>
      {showCustomers && (
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Paid Total</th>
              <th>Left to Pay</th>
              <th>Order Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.Paid_total}</td>
                <td>{customer.left_to_pay}</td>
                <td>{customer.Order_status}</td>
                <td>
                  <button onClick={() => handleUpdateClick(customer)}>
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deactivateUser("customers", customer.id, setCustomers)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for updating customer */}
      {selectedCustomer && (
        <div className="modal">
          <h2>Update Customer</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleInputChange}
            />
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={updatedData.address}
              onChange={handleInputChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={updatedData.email}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={updatedData.phone}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleUpdateSubmit}>
              Save Changes
            </button>
            <button type="button" onClick={() => setSelectedCustomer(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
