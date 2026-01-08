import React, { useState } from 'react';
import { login } from '../api';
import { LogIn } from 'lucide-react';

interface LoginProps {
    onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ username, password });
            onLogin(res.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Login</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</p>}
                    <button type="submit" className="primary-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <LogIn size={20} /> Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
