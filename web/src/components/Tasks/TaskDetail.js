import React from 'react';

import DetailView from '../DetailView';
import { FetchTask } from '../endpoints';
import { taskDetailRelatedPartsTableFields } from '../fieldNameAliases';

/**
must pass relatedParent and relatedChild. If none, set to none 
currentItem: string, singular
*/

const TaskDetail = (props) => {
  return (
    <DetailView
      initRoute={FetchTask}
      currentItem={'task'}
      relatedChild={'parts'}
      relatedParent={'categories'}
      itemId={props.match.params.id}
      fetchType={'parts'}
      tableNumLinks={1}
      relatedTableDisplayFields={taskDetailRelatedPartsTableFields}
    />
  );
}

export default TaskDetail;
