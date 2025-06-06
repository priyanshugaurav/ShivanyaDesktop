import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const { user, expiry } = JSON.parse(session);
      const now = new Date().getTime();
      if (now < expiry) {
        setUser(user); // still valid
      } else {
        localStorage.removeItem('userSession'); // expired
      }
    }
  }, []);

  const login = userData => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
