import React from 'react';

import { Button, activeButtonStyle } from './common';

const PageNavigation = ({ totalPagesArray, currentPageNum, handlePageNav }) => {

  const pageNavButtons = totalPagesArray.map((pageNum, index) => {
    
    // let activeClass = pageNum === currentPageNum ? 'active' : 'normal';
    let activeStyle = pageNum === currentPageNum ? activeButtonStyle : null;

    return (
      <Button
        key={pageNum + '-' + index}
        style={activeStyle}
        title={pageNum}
        action={(e) => handlePageNav(e.target.textContent)}
      />
    )
  });

  return (
    <div>
      {pageNavButtons}
    </div>
  );
};


export default PageNavigation;
