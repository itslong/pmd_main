import React, { Component } from 'react';

import { Button } from './common';
import PageNavigation from './PageNavigation';

const Pager = ({ 
  handlePreviousPageClick,
  handleNextPageClick,
  pageSizeLimits,
  handlePageSizeLimitClick,
  totalPages,
  totalItemsCount,
  currentPageNum,
  currentPageSize,
  handlePageNav,
  maxPageSize
}) => {

  const totalPagesDisplay = `There are ${totalPages} pages remaining.`;

  const prevPageButtonStyle = handlePreviousPageClick === null ? disabledButtonStyle : null;
  
  const prevPageButton = <Button
      id={'nav-prev-page'}
      type={'primary'}
      style={prevPageButtonStyle}
      title={'Previous Page'}
      action={handlePreviousPageClick}
    />

  const nextPageButtonStyle = handleNextPageClick === null ? disabledButtonStyle : null;

  const nextPageButton = <Button
      id={'nav-next-page'}
      type={'primary'}
      style={nextPageButtonStyle}
      title={'Next Page'}
      action={handleNextPageClick}
    />

  const pageSizeButtons = pageSizeLimits.length ? 
    pageSizeLimits.map((pageSizeVal, index) => {
      if (pageSizeVal > maxPageSize) {
        return null;
      }

      let activePageSizeButtonClass = currentPageSize === pageSizeVal ? 'primary active': 'primary';
      let activePageSizeButtonStyle = currentPageSize === pageSizeVal ? activeButtonStyle : null; 

      let lastPageOfPageSize = Math.ceil(totalItemsCount / pageSizeVal);
      let disabledPageSizeButtonStyle = currentPageNum > lastPageOfPageSize ? disabledButtonStyle : null;

      let pageSizeButtonStyle = disabledPageSizeButtonStyle == null ? activePageSizeButtonStyle : disabledPageSizeButtonStyle;

      return (
        <Button
          key={`${pageSizeVal}-${index}`}
          type={activePageSizeButtonClass}
          style={pageSizeButtonStyle}
          title={pageSizeVal}
          action={handlePageSizeLimitClick}
        />
      )
    }) : '';

  const pageArr = generatePageNums(totalPages, currentPageNum);

  const pageNavigation = pageArr.length > 0 ?
    <PageNavigation 
      totalPagesArray={pageArr}
      currentPageNum={currentPageNum}
      handlePageNav={handlePageNav}
    /> : '';


  return (
    <div>
      { totalPagesDisplay } <br />
      { pageSizeButtons } <br />
      <div style={pageNavStyle}>
        { prevPageButton }
        { pageNavigation }
        { nextPageButton }
      </div>
    </div>
  )
}
/**
  Pattern is:
  - first, first + 1
  - current, current - 1, current + 1
  - last - 1, last
  currentPageNum = 6
  lastPage = 10
  Ex: 1,2,...5,6,7,...9,10
*/
const generatePageNums = (lastPage, currentPageNum) => {
  if (lastPage === 1) {
    return [1];
  }

  if (lastPage < 5) {
    return [...Array(lastPage).fill(0).map((x, i) => i + 1)]
  }

  const firstPage = 1;
  const firstPlusOne = firstPage + 1;
  const lastMinusOne = lastPage - 1;

  const currMinusOne = (currentPageNum - 1) > 0 ? currentPageNum - 1 : 1;
  const currPlusOne = (currentPageNum + 1) >= lastPage ? 1 : currentPageNum + 1;

  let firstLastArr = [firstPage, firstPlusOne, lastMinusOne, lastPage];
  let currArr = [currMinusOne, currentPageNum, currPlusOne];

  const pageArr = Array.from(new Set([...firstLastArr, ...currArr])).sort((a, b) => a - b);
  
  return pageArr;
};

const disabledButtonStyle = {
  cursor: 'not-allowed',
  pointerEvents: 'none',
  color: '#c0c0c0',
  backgroundColor: '#ffffff'
};

const activeButtonStyle = {
  backgroundColor: '#2284BA',
  color: 'white',
  cursor: 'pointer'
};

const pageNavStyle = {
  display: 'flex',
}

export default Pager;
