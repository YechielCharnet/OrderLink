import React, { useState, useEffect } from "react";
import '../css/Customers.css';
import { deactivateUser, updateUser, addUser } from "./functions";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/customers`)
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  return (
    <div>
      {/* <h1>Customers</h1> */}
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
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.Paid_total}</td>
                <td>{customer.left_to_pay}</td>
                <td>{customer.Order_status}</td>
                <td>
                  <button onClick={() => console.log("Update clicked")}>
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() =>
                      deactivateUser("customers", customer.id, setCustomers)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
