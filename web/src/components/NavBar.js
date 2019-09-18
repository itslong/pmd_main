import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from './AppContext';
import {
  navBarStyle,
  navUlStyle,
  navLiStyle,
  StyledNavBar
} from './common';
import {
  HOME_PATH,
  BASE_PATH,
  PARTS_DISPLAY_PATH,
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



const NavBar = ({ handleLogout }) => {
  const username = useContext(UserContext);
  const oldPdfPath = 'assets/book/';
  const fullPdfPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + oldPdfPath : PROD_BASE_PATH + oldPdfPath;
  
  const newPdfPath = 'assets/cat_as_pdf/';
  const fullCatAsPdfPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + newPdfPath : PROD_BASE_PATH + newPdfPath;
  // remove after testinng
  // const pdfApi100Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_api_100/' : PROD_BASE_PATH + 'assets/book_api_100/';
  // const pdfApi400Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_api_400/' : PROD_BASE_PATH + 'assets/book__api_400/';
  // const pdfApiAllPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_api_all/' : PROD_BASE_PATH + 'assets/book_api_all/';

  const pdfRender100Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_render_100/' : PROD_BASE_PATH + 'assets/book_render_100/';
  const pdfRender400Path = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_render_400/' : PROD_BASE_PATH + 'assets/book_render_400/';
  const pdfRenderAllPath = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + 'assets/book_render_all/' : PROD_BASE_PATH + 'assets/book_render_all/';


  // jobs query testing with <table> and <div> tables
  const htmlTableHtml = 'assets/html_table/';
  // const htmlTablePdf = 'assets/html_table_as_pdf/';
  const navHtmlTable = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + htmlTableHtml : PROD_BASE_PATH + htmlTableHtml;
  // const navPdfTable = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + htmlTablePdf : PROD_BASE_PATH + htmlTablePdf;


  // const divTablePath = 'assets/div_table/';
  // const divTablePdf = 'assets/div_table_as_pdf/';
  // const navDivTable = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + divTablePath : PROD_BASE_PATH + divTablePath;
  // const navPdfDiv = (process.env.LOCAL_PATH) ? process.env.LOCAL_PATH + divTablePdf : PROD_BASE_PATH + divTablePdf;


  return (
    <StyledNavBar>
      <ul>
        <li><Link to={HOME_PATH}>Home</Link></li>
        <li><Link to={PARTS_DISPLAY_PATH}>Parts</Link></li>
        <li><Link to={TASKS_DISPLAY_PATH}>Tasks</Link></li>
        <li><Link to={CATEGORIES_DISPLAY_PATH}>Categories</Link></li>
        <li><Link to={JOBS_DISPLAY_PATH}>Jobs</Link></li>
        <li><a href={navHtmlTable}>PDF</a></li>

        <li><Link to={BASE_PATH} onClick={handleLogout}>Logout</Link></li>
        <li><p>Signed in as: {username}</p></li>
      </ul>
      <ul>
        <li><Link to={CREATE_PARTS_PATH}>Add Part</Link></li>
        <li><Link to={CREATE_TASKS_PATH}>Add Task</Link></li>
        <li><Link to={CREATE_CATEGORIES_PATH}>Add Category</Link></li>
        <li><Link to={CREATE_JOBS_PATH}>Add Job</Link></li>
      </ul>

{/*      <ul>
        <p>Old PDF Test. (Numbers correspond to quantity of rows in the db table).</p>
        <li><a href={pdfRender100Path}>PDF: 100</a></li>
        <li><a href={pdfRender400Path}>PDF: 400</a></li>
        <li><a href={pdfRenderAllPath}>PDF: All</a></li>
      </ul>

      <ul>
        <p>New PDF And Query Test. html table vs div table.</p>
        <li><a href={navHtmlTable}>HTML Only with Table</a></li>
        <li><a href={navPdfTable}>PDF with Table</a></li>
        <p>|||</p>
        <li><a href={navDivTable}>HTML Only with Div table</a></li>
        <li><a href={navPdfDiv}>PDF with Div table</a></li>
      </ul>*/}

    </StyledNavBar>
  )
};

export default NavBar;
