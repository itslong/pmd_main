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
  const oldPdfPath = 'assets/book/';
  const fullPdfPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + oldPdfPath : PROD_BASE_PATH + oldPdfPath;
  
  const newPdfPath = 'assets/cat_as_pdf/';
  const fullCatAsPdfPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + newPdfPath : PROD_BASE_PATH + newPdfPath;
  // remove after testinng
  const pdfApi100Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_api_100/' : PROD_BASE_PATH + 'assets/book_api_100/';
  const pdfApi400Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_api_400/' : PROD_BASE_PATH + 'assets/book__api_400/';
  const pdfApiAllPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_api_all/' : PROD_BASE_PATH + 'assets/book_api_all/';

  const pdfRender100Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_render_100/' : PROD_BASE_PATH + 'assets/book_render_100/';
  const pdfRender400Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_render_400/' : PROD_BASE_PATH + 'assets/book_render_400/';
  const pdfRenderAllPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_render_all/' : PROD_BASE_PATH + 'assets/book_render_all/';

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
        <li><a href={fullPdfPath}>Old PDF Test</a></li>
        <li><a href={fullCatAsPdfPath}>New PDF Test</a></li>
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
        <li>PDF API Test. Numbers correspond to quantity of rows in the db table.</li>
        <li><a href={pdfApi100Path}>API: 100</a></li>
        <li><a href={pdfApi400Path}>API: 400</a></li>
        <li><a href={pdfApiAllPath}>API: All</a></li>
      </ul>

      <ul style={ulStyle}>
        <li>PGenerate PDF Test. Numbers correspond to quantity of rows in the db table.</li>
        <li><a href={pdfRender100Path}>PDF: 100</a></li>
        <li><a href={pdfRender400Path}>PDF: 400</a></li>
        <li><a href={pdfRenderAllPath}>PDF: All</a></li>
      </ul>

    </div>
  )
};

export default NavBar;
