import React, { useState, useEffect } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(false);
  const [showForm, setShowForm] = useState(false); // מצב להצגת הטופס
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    Paid_total: 0,
    left_to_pay: 0,
    Order_status: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);

  useEffect(() => {
    // קריאה לנתונים בכניסה ראשונית בלבד
    fetch((`${process.env.REACT_APP_API_URL}/users/customers`))
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []); // תלות ריקה מוודאת ש-fetch יבוצע פעם אחת בלבד

  const customersList = customers.map((customer) => (
    <li key={customer.id}>
      {customer.name} - {customer.address} - {customer.email} - {customer.phone}{" "}
      - {customer.Paid_total} - {customer.left_to_pay} - {customer.Order_status}
      <button onClick={() => deleteCustomer(customer.id)}>Delete</button>
      <button onClick={() => handleUpdateClick(customer)}>Update</button>
    </li>
  ));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addCustomer = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers((prevCustomers) => [...prevCustomers, data]);
        resetForm();
      });
  };

  const deleteCustomer = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/customers/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
      });
  };

  const handleUpdateClick = (customer) => {
    setFormData({
      name: customer.name,
      address: customer.address,
      email: customer.email,
      phone: customer.phone,
      Paid_total: customer.Paid_total,
      left_to_pay: customer.left_to_pay,
      Order_status: customer.Order_status,
    });
    setIsUpdating(true);
    setCurrentCustomerId(customer.id);
  };

  const updateCustomer = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/customers/${currentCustomerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update customer");
        }
        return response.json();
      })
      .then((updatedCustomer) => {
        // setCustomers((prevCustomers) =>
        //   prevCustomers.map((c) =>
        //     c.id === updatedCustomer.id ? updatedCustomer : c
        //   )
        // );
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
      });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
      Paid_total: 0,
      left_to_pay: 0,
      Order_status: "",
    });
    setIsUpdating(false);
    setCurrentCustomerId(null);
    setShowForm(false); // להסתיר את הטופס לאחר עדכון או הוספה
  };

  const toggleShowCustomers = () => {
    setShowCustomers((prev) => !prev);
  };

  const toggleShowForm = () => {
    setShowForm((prev) => !prev); // להחליף את מצב תצוגת הטופס
  };

  return (
    <div>
      <h1>Customers</h1>
      <button onClick={toggleShowCustomers}>
        {showCustomers ? "Hide Customers" : "Show Customers"}
      </button>
      {showCustomers && <ul>{customersList}</ul>}

      <button onClick={toggleShowForm}>
        {showForm ? "Hide Form" : "Add New Customer"}
      </button>

      {showForm && (
        <>
          <h2>{isUpdating ? "Update Customer" : "Add New Customer"}</h2>
          <form onSubmit={isUpdating ? updateCustomer : addCustomer}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="Paid_total"
              placeholder="Paid Total"
              value={formData.Paid_total || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="left_to_pay"
              placeholder="Left to Pay"
              value={formData.left_to_pay || ""}
              onChange={handleChange}
            />
            <input
              type="text"
              name="Order_status"
              placeholder="Order Status"
              value={formData.Order_status || ""}
              onChange={handleChange}
            />
            <button type="submit">
              {isUpdating ? "Update Customer" : "Add Customer"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
