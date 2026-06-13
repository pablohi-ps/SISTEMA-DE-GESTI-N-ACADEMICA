import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('novaedu_token');
    const storedUser = localStorage.getItem('novaedu_user');
    if (storedToken && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('novaedu_token');
        localStorage.removeItem('novaedu_user');
      }
    }
    return null;
  });
  const loading = false;

  const login = async (username, password) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { success: false, message: data.message || `Error del servidor (${response.status})` };
      }

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('novaedu_token', data.token);
        localStorage.setItem('novaedu_user', JSON.stringify(data.user));
        return { success: true, role: data.user.role };
      } else {
        return { success: false, message: data.message || 'Credenciales incorrectas' };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, message: 'El servidor no respondió. Verifica que el backend esté activo.' };
      }
      return { success: false, message: 'No se pudo conectar al servidor. Asegúrate de que el backend está ejecutándose (node index.js).' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('novaedu_token');
    localStorage.removeItem('novaedu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // eslint-disable-line react-refresh/only-export-components
