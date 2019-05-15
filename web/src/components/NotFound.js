import React from 'react';
import { Link } from 'react-router-dom';

import { HOME_PATH } from './frontendBaseRoutes';

// modify this to accept text. Set up default error message.
const NotFound = ({ message }) => {
  const defaultText = "There doesn't seem to be anything here. Check the Url and try again.";
  const bodyText = message ? message : defaultText;

  return (
    <div>
      { bodyText }
    </div>
  );
};

export default NotFound;
