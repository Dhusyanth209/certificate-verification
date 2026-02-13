import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check local storage on load
    useEffect(() => {
        const storedUser = localStorage.getItem('certify_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            const userData = res.data;
            setUser(userData);
            localStorage.setItem('certify_user', JSON.stringify(userData));
            return { success: true };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                msg: err.response?.data?.msg || 'Login failed'
            };
        }
    };

    const register = async (username, email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
            const userData = res.data;
            setUser(userData);
            localStorage.setItem('certify_user', JSON.stringify(userData));
            return { success: true };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                msg: err.response?.data?.msg || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('certify_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
