import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const { data } = await API.get('/members/me');
          setUser(data);
        } catch (error) {
          console.error('Auth verification failed', error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      Cookies.set('token', data.token, { expires: 30 });
      setUser(data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      Cookies.set('token', data.token, { expires: 30 });
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
