import React, { createContext } from 'react';

export const IsAuthContext = createContext({
  localAuthState: 'false',
  updateAuth: () => {},
});
export const UserContext = createContext('guest');
