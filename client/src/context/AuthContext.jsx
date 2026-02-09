import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check local storage on load
    useEffect(() => {
        const storedUser = localStorage.getItem('certify_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (username, password) => {
        // Mock Authentication Logic
        if (username === 'issuer' && password === 'password') {
            const userData = { name: 'University Admin', role: 'issuer' };
            setUser(userData);
            localStorage.setItem('certify_user', JSON.stringify(userData));
            return true;
        } else if (username === 'admin' && password === 'password') {
            const userData = { name: 'System Admin', role: 'admin' };
            setUser(userData);
            localStorage.setItem('certify_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('certify_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
