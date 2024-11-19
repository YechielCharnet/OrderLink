import React, { useState, useEffect } from "react";

export default function Providers() {
    const [providers, setProviders] = useState([]);
    const [showProviders, setShowProviders] = useState(false);
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

    // FETCH: טוען את רשימת הספקים מהשרת
    // useEffect(() => {
    //     fetch("http://localhost:5000/providers")
    //         .then((response) => response.json())
    //         .then((data) => setProviders(data));
    // }, []);

    const providersList = providers.map((provider) => (
        <li key={provider.id}>
            {provider.name} - {provider.address} - {provider.email} - {provider.phone} - {provider.total_paid_out} - {provider.open_orders} - {provider.comments}
            <button onClick={() => deleteProvider(provider.id)}>Delete</button>
            <button onClick={() => handleUpdateClick(provider)}>Update</button>
        </li>
    ));

    // מטפל בשינויי טקסט בשדות הקלט
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // פונקציית הוספת ספק חדש
    const addProvider = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/providers", {
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
                setProviders((prevProviders) => [...prevProviders, data]);
                resetForm();
            })
            .catch((error) => {
                console.error("Error adding provider:", error);
                alert("There was an error with your request: " + error.message);
            });
    };

    // פונקציית מחיקת ספק לפי ID
    const deleteProvider = (id) => {
        fetch(`http://localhost:5000/providers/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => {
                setProviders((prevProviders) =>
                    prevProviders.filter((provider) => provider.id !== id)
                );
            });
    };

    // פונקציה לעריכת ספק נוכחי
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

    // פונקציית עדכון ספק
    const updateProvider = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/providers/${currentProviderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update provider");
                }
                return response.json();
            })
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

    // מאפס את הטופס
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

    const toggleShowProviders = () => {
        setShowProviders((prev) => !prev);
    };

    const toggleShowForm = () => {
        setShowForm((prev) => !prev);
    };

    return (
        <div>
            <h1>Providers</h1>
            <button onClick={toggleShowProviders}>
                {showProviders ? "Hide Providers" : "Show Providers"}
            </button>
            {showProviders && <ul>{providersList}</ul>}

            <button onClick={toggleShowForm}>
                {showForm ? "Hide Form" : "Add New Provider"}
            </button>

            {showForm && (
                <>
                    <h2>{isUpdating ? "Update Provider" : "Add New Provider"}</h2>
                    <form onSubmit={isUpdating ? updateProvider : addProvider}>
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
                            name="total_paid_out"
                            placeholder="Total Paid Out"
                            value={formData.total_paid_out || ""}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="open_orders"
                            placeholder="Open Orders"
                            value={formData.open_orders || ""}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="comments"
                            placeholder="Comments"
                            value={formData.comments || ""}
                            onChange={handleChange}
                        />
                        <button type="submit">
                            {isUpdating ? "Update Provider" : "Add Provider"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
