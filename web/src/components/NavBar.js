import React, { useContext } from 'react';
import { Route, Link } from 'react-router-dom';

import { IsAdminContext } from './AppContext';
import {
  HOME_PATH,
  BASE_PATH,
  PARTS_DISPLAY_PATH,
  PARTS_DISPLAY_ADMIN_PATH,
  CREATE_PARTS_PATH,
  TASKS_DISPLAY_PATH,
  CREATE_TASKS_PATH,
  CATEGORIES_DISPLAY_PATH,
  CREATE_CATEGORIES_PATH,
  JOBS_DISPLAY_PATH,
  CREATE_JOBS_PATH,
  SIGNUP_PATH,
} from './frontendBaseRoutes';

const ulStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  // borderStyle: 'solid',
  justifyContent: 'space-evenly'
}

const NavBar = ({ handleLogout }) => {
  const userIsAdmin = useContext(IsAdminContext);
  const registerLink = userIsAdmin ?
    <li><Link to={SIGNUP_PATH}>Register New User</Link></li>
    : '';

  return (
    <div>
      <ul style={ulStyle}>
        <li><Link to={HOME_PATH}>Home</Link></li>
        <li><Link to={PARTS_DISPLAY_PATH}>Parts</Link></li>
        <li>
          <Link 
            to={{
              pathname: PARTS_DISPLAY_ADMIN_PATH,
              state: { admin: true }
            }}
          >
            Admin Parts: Demo only
          </Link>
        </li>
        <li><Link to={TASKS_DISPLAY_PATH}>Tasks</Link></li>
        <li><Link to={CATEGORIES_DISPLAY_PATH}>Categories</Link></li>
        <li><Link to={JOBS_DISPLAY_PATH}>Jobs</Link></li>
        <li><Link to={BASE_PATH} onClick={handleLogout}>Logout</Link></li>
      </ul>
      <ul style={ulStyle}>
        <li><Link to={CREATE_PARTS_PATH}>Add Part</Link></li>
        <li><Link to={CREATE_TASKS_PATH}>Add Task</Link></li>
        <li><Link to={CREATE_CATEGORIES_PATH}>Add Category</Link></li>
        <li><Link to={CREATE_JOBS_PATH}>Add Job</Link></li>
        {registerLink}
      </ul>
    </div>
  )
};

export default NavBar;
