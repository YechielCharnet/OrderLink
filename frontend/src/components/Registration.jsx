import React, { useState } from 'react';

export default function Registration ({changeComponent}) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [comments, setComments] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, address, phone, comments, role }),
            });
            if (response.ok){
                console.log('Registered successful!');
              }
              else
                response.json().then((data) => alert(data.message));
            }
            catch (error) {
              console.log('Error register in:', error);
        }
    };

    return (
        <div>
            <h1>Welcome to Order Link</h1>
            <h2>Please register or login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} 
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select Role</option>
                    <option value="customer">Customer</option>
                    <option value="provider">Provider</option>
                </select>
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
