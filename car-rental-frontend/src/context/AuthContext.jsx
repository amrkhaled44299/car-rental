import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [token, setToken]   = useState(() => localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try { const { data } = await authAPI.me(); setUser(data.data); localStorage.setItem('user', JSON.stringify(data.data)); }
      catch { logout(); }
      finally { setLoading(false); }
    };
    verify();
  }, []); // eslint-disable-line

  const triggerRefresh = () => {
    window.dispatchEvent(new CustomEvent('data-refresh'));
  };

  useEffect(() => {
    if (!token || !user) { socket?.disconnect(); setSocket(null); return; }
    const s = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', { auth: { token } });

    s.on('account_status_changed', ({ status, reason }) => {
      if (status === 'active') toast.success('Account approved!');
      else toast.error('Account rejected: ' + reason);
      triggerRefresh();
    });

    s.on('car_status_changed', ({ car, status, reason }) => {
      if (status === 'active') toast.success(car.brand + ' ' + car.model + ' approved!');
      else toast.error('Car rejected: ' + reason);
      triggerRefresh();
    });

    s.on('new_rental_request', ({ rental }) => {
      toast('New rental request: ' + rental.start_date + ' to ' + rental.end_date, { icon: '🚗' });
      triggerRefresh();
    });

    s.on('rental_status_changed', ({ status, reason }) => {
      if (status === 'accepted') toast.success('Rental accepted!');
      if (status === 'rejected') toast.error('Rental rejected: ' + reason);
      if (status === 'completed') toast.success('Rental completed!');
      triggerRefresh();
    });

    s.on('license_status_changed', ({ status, reason }) => {
      if (status === 'verified') toast.success('License verified!');
      if (status === 'rejected') toast.error('License rejected: ' + reason);
      triggerRefresh();
    });

    s.on('new_pending', ({ type }) => {
      toast('New ' + type + ' pending review', { icon: '🔔' });
      triggerRefresh();
    });

    setSocket(s);
    return () => s.disconnect();
  }, [token]); // eslint-disable-line

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const { user: u, token: t } = data.data;
    setUser(u); setToken(t);
    localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('token', t);
    return u;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    const { user: u, token: t } = data.data;
    setUser(u); setToken(t);
    localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('token', t);
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null); setToken(null); socket?.disconnect();
    localStorage.removeItem('user'); localStorage.removeItem('token');
  }, [socket]);

  return (
    <AuthContext.Provider value={{ user, token, socket, loading, login, register, logout, setUser, triggerRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};