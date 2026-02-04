import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async ({ email, password, adminCode }) => {
        try {
            const { data } = await axios.post(`${config.API_BASE_URL}/api/auth/login`, { email, password, adminCode });
            setUser(data.user);
            localStorage.setItem('userInfo', JSON.stringify(data.user)); // Store minimal info
            localStorage.setItem('token', data.token); // Store token
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post(`${config.API_BASE_URL}/api/auth/register`, userData);
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    }

    const logout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
