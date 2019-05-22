import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { LOGIN_PATH } from '../frontendBaseRoutes';
import { IsAuthContext } from '../AppContext'; 
import { LoginForm } from '../Auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(IsAuthContext);

  return (
    <Route { ...rest } render={(props) => {
      return (
        authContext ? <Component {...props} /> : <Redirect to={LOGIN_PATH} />
      )}}
    />
  );
};

export default PrivateRoute;
