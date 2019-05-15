import React from 'react';

// hit the api to get ranges

// return '9999' as id. Change function to set custom retail price. No markup
const calculateRetailCostWithCustomMarkup = (basePartCost, customMarkupPercent) => {
  const cost = Number.parseInt(basePartCost);
  const customPercent = Number.parseInt(customMarkupPercent) / 100;

  const retailCost = cost + (cost * customPercent);
  // console.log('calc: ' + retailCost + ' percent: ' + customPercent)
  return {
    markupId: '9999',
    retailCost: retailCost
  };
}



const calculateRetailCost = (basePartCost, markupPercentsData) => {
  let cost = parseInt(basePartCost);
  let markupId = 0;
  let retailCost = 0;

  let markupObj = markupPercentsData.filter(data => {
    const low = parseInt(data.range_low);
    const high = parseInt(data.range_high);

    if (cost <= high && cost >= low) {
      return data;
    }
  })

  if (markupObj.length > 0) {
    markupId = markupObj[0].id;

    let percent = parseInt(markupObj[0].markup_percent);
    retailCost = cost + (cost * (percent / 100));
  }

  return {
    markupId,
    retailCost
  }
}

export { 
  calculateRetailCostWithCustomMarkup,
  calculateRetailCost
};
