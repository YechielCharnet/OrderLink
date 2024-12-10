import React, { useState } from 'react';

export default function Registration ({changeComponent}) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [comments, setComments] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('customer');
    const [is_active, setIs_active] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, username, password, phone, email, address, comments, is_active }),
            });
            const data = await response.json();
            if (response.ok){
                alert(data.message || 'Registered successful!');
                changeComponent('customer');
            }
            else
                alert(data.message || 'Registration failed');
        }
        catch (error) {
            console.log('Error registering:', error);
            alert('An unexpected error occurred');
        }
    };

    return (
        <div>
            <h1>Welcome to Order Link</h1>
            <h2>Please register or login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Name:</label>
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="phone">Phone Number:</label>
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} 
                />
                {/* <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    <option value="customer">Customer</option>
                    <option value="provider">Provider</option>
                </select> */}
                <label htmlFor="comments">Comments:</label>
                <textarea
                    placeholder="Comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)} 
                />
                <button type="submit">Register</button>
            </form>
            <button onClick={() => changeComponent("login")}>Login</button>
        </div>
    );
};
