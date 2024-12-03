import React, { useState, useEffect } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(false); // מצב לשליטה בהצגת הרשימה
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    total_Paid: 0,
    left_to_pay: 0,
    open_orders: 0,
    comments: "",
  });

  useEffect(() => {
    console.log("Customers");
    fetch("http://localhost:5000/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data));
  }, []);

  const customersList = customers.map((customer) => (
    <li key={customer.id}>
      {customer.name} - {customer.address} - {customer.email} - {customer.phone} -{" "}
      {customer.total_Paid} - {customer.left_to_pay} - {customer.open_orders} - {customer.comments}
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
    fetch("http://localhost:5000/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // הוסף את הלקוח החדש לרשימה המקומית
        setCustomers((prevCustomers) => [...prevCustomers, data]);
        // ניקוי השדות לאחר ההוספה
        setFormData({
          name: "",
    address: "",
    email: "",
    phone: "",
    total_Paid: 0,
    left_to_pay: 0,
    open_orders: 0,
    comments: "",
        });
      });
  };

  const deleteCustomer = (id) => {
    fetch(`http://localhost:5000/customers/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
      });
  };


  const toggleShowCustomers = () => {
    setShowCustomers((prev) => !prev); // שינוי מצב ה-showCustomers
  };

  return (
    <div>
      <h1>Customers</h1>
      <button onClick={toggleShowCustomers}>
        {showCustomers ? "Hide Customers" : "Show Customers"}
      </button>
      {showCustomers && <ul>{customersList}</ul>}
      <button onClick={() => deleteCustomer(true)}>deleteCustomer</button>

      <h2>Add New Customer</h2>
      <form onSubmit={addCustomer}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Total_paid"
          placeholder="Total paid"
          value={formData.total_Paid === 0 ? "" : formData.total_Paid} // אם 0, הצג ריק
          onChange={handleChange}
        />

        <input
          type="number"
          name="left_to_pay"
          placeholder="Left to Pay"
          value={formData.left_to_pay === 0 ? "" : formData.left_to_pay} // אם 0, הצג ריק
          onChange={handleChange}
        />

        <input
          type="text"
          name="Order_status"
          placeholder="Order Status"
          value={formData.Order_status}
          onChange={handleChange}
          
        />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}
