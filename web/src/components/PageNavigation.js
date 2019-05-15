import React from 'react';

import { Button } from './common';

const PageNavigation = ({ totalPagesArray, currentPageNum, handlePageNav }) => {

  const pageNavButtons = totalPagesArray.map((pageNum, index) => {
    
    let activeClass = pageNum === currentPageNum ? 'primary active' : 'primary';
    let activeStyle = pageNum === currentPageNum ? activeButtonStyle : null;

    return (
      <Button
        key={pageNum + '-' + index}
        type={activeClass}
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


const activeButtonStyle = {
  // backgroundColor: '#2284BA',
  backgroundColor: '#228',
  color: 'white',
  cursor: 'pointer'
}

export default PageNavigation;
