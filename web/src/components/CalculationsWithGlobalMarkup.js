import { calculateTasksMainDisplayFields, calculateTaskDetailRelatedPartsTableFields } from './Tasks';
// import { calculatePartsMainDisplayFields } from './PartsCalculateRates';
import { calculatePartsMainDisplayFields } from './Parts';

const renameAndRebuildMainDisplayFields = (type, dataArr, markupData, displayFields, calcFields) => {
  const fields = type == 'tasks' ?
    calculateTasksMainDisplayFields(dataArr, markupData, displayFields, calcFields) 
    : calculatePartsMainDisplayFields(dataArr, markupData, displayFields);
  
  return fields;
};

const renameAndRebuildRelatedPartsDisplayFields = (dataArr, tagTypeId, markupData, displayFields) => {
  return calculateTaskDetailRelatedPartsTableFields(dataArr, tagTypeId, markupData, displayFields);
};

// tax calculations using wrapper. Test for task_attribute


export {
  renameAndRebuildMainDisplayFields,
  renameAndRebuildRelatedPartsDisplayFields,
}
