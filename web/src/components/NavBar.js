import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from './AppContext';
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
  PROD_BASE_PATH,
} from './frontendBaseRoutes';

const ulStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  // borderStyle: 'solid',
  justifyContent: 'space-evenly'
};

const NavBar = ({ handleLogout }) => {
  const username = useContext(UserContext);
  const pdfPath = 'assets/book/';
  const fullPdfPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + pdfPath : PROD_BASE_PATH + pdfPath;

  // remove after testinng
  const pdf100Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_100/' : PROD_BASE_PATH + 'assets/book_100/';
  const pdf400Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_400/' : PROD_BASE_PATH + 'assets/book_400/';
  const pdfAllPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_all/' : PROD_BASE_PATH + 'assets/book_all/';

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
        <li><a href={fullPdfPath}>PDF Test</a></li>
        <li style={{ display: 'flex', flexDirection: 'row' }}>
          <Link to={BASE_PATH} onClick={handleLogout}>Logout</Link>
          <p style={{ 'paddingLeft': '10px' }}>Signed in as: {username}</p>
        </li>
      </ul>
      <ul style={ulStyle}>
        <li><Link to={CREATE_PARTS_PATH}>Add Part</Link></li>
        <li><Link to={CREATE_TASKS_PATH}>Add Task</Link></li>
        <li><Link to={CREATE_CATEGORIES_PATH}>Add Category</Link></li>
        <li><Link to={CREATE_JOBS_PATH}>Add Job</Link></li>
      </ul>

      <ul style={ulStyle}>
        <li>PDF Test. Numbers correspond to quantity of rows in the db table.</li>
        <li><a href={pdf100Path}>PDF: 100</a></li>
        <li><a href={pdf400Path}>PDF: 400</a></li>
        <li><a href={pdfAllPath}>PDF: All</a></li>
      </ul>

    </div>
  )
};

export default NavBar;
