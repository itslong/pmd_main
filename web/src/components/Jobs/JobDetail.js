import React from 'react';

import DetailView from '../DetailView';
import { FetchJob } from '../endpoints';

const JobDetail = (props) => {
  return (
    <DetailView
      initRoute={FetchJob}
      currentItem={'job'}
      relatedChild={'categories'}
      relatedParent={null}
      itemId={props.match.params.id}
      fetchType={'categories'}
      tableNumLinks={2}
    />
  );
};

export default JobDetail;
