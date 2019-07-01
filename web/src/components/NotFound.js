import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { LOGIN_PATH } from './frontendBaseRoutes';
import { IsAuthContext } from './AppContext';


const NotFound = ({ message }) => {
  const isAuth = useContext(IsAuthContext);

  const defaultText = "There doesn't seem to be anything here. Check the Url and try again.";
  let bodyText = message ? message : defaultText;

  if (!isAuth) {
    const loginLink = <Link to={LOGIN_PATH}>here</Link>;
    bodyText = `Session expired. Login again ${loginLink}.`;
  }

  return (
    <div>
      { bodyText }
    </div>
  );
};

export default NotFound;
