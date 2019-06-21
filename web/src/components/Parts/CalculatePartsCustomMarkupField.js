import React from 'react';

import { preciseRound } from '../Tasks'


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
  let cost = parseFloat(basePartCost);
  let markupId = 0;
  let retailCost = 0;

  const markupObj = markupPercentsData.filter(data => {
    const low = parseInt(data.range_low);
    const high = parseInt(data.range_high);

    if (cost <= high && cost >= low) {
      return data;
    }
  });

  if (markupObj.length > 0) {
    markupId = markupObj[0].id;

    const percent = parseFloat(markupObj[0].markup_percent);
    retailCost = preciseRound(parseFloat(cost + (cost * (percent / 100))), 2);
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
