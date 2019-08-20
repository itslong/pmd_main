import React from 'react';
import { Link } from 'react-router-dom';

import {
  HOME_PATH,
  BASE_PATH,
  PARTS_DISPLAY_PATH,
  // PARTS_DISPLAY_ADMIN_PATH,
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
  flexDirection: 'column',
  width: '100%',
  justify: 'center',
  // borderStyle: 'solid',
  justifyContent: 'space-evenly',
  padding: '20%',
  fontSize: 'x-large',
};

const ulRow ={
  display: 'flex',
  justifyContent: 'space-between',
};


const HomeComponent = () => {
  return (
    <div>
      <ul style={ulStyle}>
        <ul style={ulRow}>
          <li><Link to={PARTS_DISPLAY_PATH}>Parts</Link></li>
          <li>
          </li>
        </ul>
        <li><Link to={TASKS_DISPLAY_PATH}>Tasks</Link></li>
        <li><Link to={CATEGORIES_DISPLAY_PATH}>Categories</Link></li>
        <li><Link to={JOBS_DISPLAY_PATH}>Jobs</Link></li>
      </ul>
    </div>
  );
};

export default HomeComponent;
