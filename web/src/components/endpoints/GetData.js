import React from 'react';

import GetCookie from './GetCookie';
import { PROD_BASE_PATH } from '../frontendBaseRoutes';
// define api BASE_URL and PARTS_URL later

// Get All Parts
const FetchAllParts = (pageNum=1, pageSize=10) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/parts/');

  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const endpointWithPageQuery = endpoint + pageQuery;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('Fetch All Parts Error: ' + error);
  })
};


const FetchAllPartsAdmin = (pageNum=1, pageSize=10) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/parts/admin/');

  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const endpointWithPageQuery = endpoint + pageQuery;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('Fetch All Parts Admin Error: ' + error);
  })
};

// Get a single Part
const FetchPart = (partId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/part/' + partId + '/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    return error;
  })
}


// PostParts
const CreatePart = (formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/part/create/');
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    console.log('create part response: ' + JSON.stringify(response))
    if (response.status !== 201) {
      // return Promise.reject(
      //   'Form rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
      // );
      return Promise.reject(new Error('fail')).then((response) => {
        console.log('first response ' + response)
      }, (error) => {
        console.log('error itself: ' + error)
      })
    }

    return response.json();
  })
  .catch(error => {
    console.log('the error: ' + JSON.stringify(error))
    // return Promise.reject('Post Error: ' + error);
    return Promise.reject({
        status: response.status,
        errorMsg: 'In the catch: Form rejected form this endpoint: ' + endpoint
      })
  })
};

// UpdateParts
const UpdatePart = (partId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/part/';
  const action = '/edit-or-delete/';
  const endpoint = new URL(url + partId + action);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'PUT',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    console.log('Updating part failed', error)
  })

}

const UpdatePartTagTypes = (partId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/part/';
  const action = '/edit-or-delete/';
  const endpoint = new URL(url + partId + action);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'PATCH',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    console.log('Updating failed', error)
  })

}


// DeleteParts by setting is_active: false
// same as UpdatePart but keeping the naming convention separate
const DeletePart = (partId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/part/';
  const action = '/edit-or-delete/';
  const endpoint = new URL(url + partId + action);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'PATCH',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    console.log('part set to is_active: False : ' + partId)
    return response.json();
  })
  .catch(error => {
    return Promise.reject('Error with delete: ' + error);
  })
};


const AdminDeletePart = (partId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/part/';
  const action = '/edit-or-delete/';
  const endpoint = new URL(url + partId + action);

  return fetch(endpoint, {
    method: 'DELETE'
  })
  .then(response => {
    console.log('deleted: ' + partId)
    return response.status
  })
  .catch(error => {
    return Promise.reject('Admin Delete Error: ' + error);
  })
};


const SearchForParts = (searchString) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/parts-searchable';
  const query = '/?search=';
  const endpoint = new URL(url + query + encodeURIComponent(searchString));

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(
      'Promise rejected at SearchForParts. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('SearchForParts Error: ' + error);
  })
}


// searchType: 'parts', 'tasks', etc
const SearchForItems = (searchString, searchType, pageNum=1, pageSize=10) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/';
  const type = searchType + '-searchable/';
  const endpoint = url + type

  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const query = searchString !== '' ? '&search=' + encodeURIComponent(searchString) : '';

  const pageQuery = '?' + currentPageNum + '&' + currentPageSize + query;
  const endpointWithPageQuery = new URL(endpoint + pageQuery);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(
      'Promise rejected at SearchForItems. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('SearchForParts Error: ' + error);
  })
}


const FetchAllTasks = (pageNum=1, pageSize=10) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = path + 'api/tasks/';
  
  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const endpointWithPageQuery = new URL(endpoint + pageQuery);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('Fetch All Parts Error: ' + error);
  })
};


const FetchTask = (taskId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/task/' + taskId + '/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    return error;
  })
}

const CreateTask = (formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/task/create/');
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    console.log('create task response: ' + JSON.stringify(response))
    if (response.status !== 201) {
      // return Promise.reject(
      //   'Form rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
      // );
      return Promise.reject(new Error('Create Task failed')).then((response) => {
        console.log('Task response: ' + response)
      }, (error) => {
        console.log('Task error: ' + error)
      })
    }

    return response.json();
  })
  .catch(error => {
    console.log('the error: ' + JSON.stringify(error))
    // return Promise.reject('Post Error: ' + error);
    return Promise.reject({
        status: response.status,
        errorMsg: 'In the catch: Create Task form data rejected from this endpoint: ' + endpoint
      })
  })
};



const UpdateTaskOnly = (taskId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/task/';
  const action = '/edit-only/';
  const endpoint = new URL(url + taskId + action);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'PUT',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    console.log('Updating task failed: ', error)
  })
}


const UpdateTaskRelatedPartsSubmit = (taskId, partsArr) => {
  const removeRelatedParts = RemoveRelatedTaskParts(taskId);
  let removeAndCreateParts = removeRelatedParts.then(response => {
    if (response.ok && response.status == 204) {
      return Promise.resolve(response);
    }
  })
  .then(() => {
    let actions = partsArr.map(item => {
      return CreateTaskParts(item);
    })

    let results = Promise.all(actions)
    return results;
  })

  let resolved = removeAndCreateParts.then((items) => {
    return new Promise(resolve => {
      resolve('Success')
    })
  })

  return resolved;

}

const CreateTaskParts = (taskPartsObj) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/tasks-parts/');
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  let options = {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(taskPartsObj),
    headers,
  };

  return fetch(endpoint, options).then(response => {
    return response;
  })
  .catch(error => {
    return Promise.reject('CreateTaskParts ran into an error: ' + error)
  })
};

const FetchAllTasksRelatedToParts = (partId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = path + 'api/tasks-parts/part-filter/';
  const filterQuery = '?part=';
  const endpointWithFilterQuery = new URL(endpoint + filterQuery + partId);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithFilterQuery, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .catch(error => {
    return Promise.reject('FetchAllTasksRelatedToParts encountered an error: ' + error)
  })
};

const RemoveRelatedTaskParts = (taskId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/tasks-parts/filter-then-delete/?task=';
  const endpoint = new URL(url + taskId);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: {}, // does not need a body
    headers,
  })
  .then(response => {
    return response;
  })
  .catch(error => {
    return Promise.reject('Remove Related TasksParts Error: ' + error);
  })
}


const FetchAllCategories = (pageNum=1, pageSize=10) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = path + 'api/categories/';
  
  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const endpointWithPageQuery = new URL(endpoint + pageQuery);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('Fetch All Parts Error: ' + error);
  })
};


const FetchCategory = (categoryId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/category/' + categoryId + '/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint)
  .then(response => {
    return response.json();
  })
  .catch(error => {
    return error;
  })
}

const CreateCategory = (formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/category/create/');
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    if (response.status !== 201) {
      return Promise.reject(new Error('Create Category failed')).then((response) => {
      }, (error) => {
        console.log('Category error: ' + error)
      })
    }

    return response.json();
  })
  .catch(error => {
    return Promise.reject({
        status: response.status,
        errorMsg: 'In the catch: Create Category form data rejected from this endpoint: ' + endpoint
    });
  });
};

const UpdateCategoryAndRelatedTasks = (categoryId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/category/';
  const action = '/edit-only/';
  const endpoint = new URL(url + categoryId + action);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'PUT',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    console.log('Updating category failed: ', error)
  })
}


const FetchAllJobs = (pageNum=1, pageSize=10) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = path + 'api/jobs/';

  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const endpointWithPageQuery = new URL(endpoint + pageQuery);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('Fetch All Jobs Error: ' + error);
  })
};


const FetchJob = (jobId) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/job/' + jobId + '/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    return Promise.reject('Fetch a single Job Error: ' + error);
  })
}

const CreateJob = (formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/job/create/');
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    if (response.status !== 201) {
      return Promise.reject(new Error('Create Job failed')).then((response) => {
      }, (error) => {
        console.log('Job error: ' + error)
      })
    }

    return response.json();
  })
  .catch(error => {
    return Promise.reject({
        status: response.status,
        errorMsg: 'In the catch: Create Job form data rejected from this endpoint: ' + endpoint
    });
  });
};


const UpdateJobAndRelatedCategories = (jobId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/job/';
  const action = '/edit-only';
  const endpoint = new URL(url + jobId + action);
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {
    method: 'PUT',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers,
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    
    return Promise.reject(
      'Promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
  .catch(error => {
    console.log('Updating job failed: ', error)
  })
}


const GetPartsMarkupPercents = () => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/parts-markup/list/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json()
    }

    return Promise.reject(
     'Parts Markup promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
}

const FetchTagTypesChoices = () => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/tags/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json()
    }

    return Promise.reject(
     'FetchTagTypesChoices promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
}

const FetchGlobalMarkup = () => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/global-markup/');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpoint, {headers, })
  .then(response => {
    if (response.ok) {
      return response.json()
    }

    return Promise.reject(
     'Global Markup promise rejected. Status Code: ' + response.status + ' from this endpoint: ' + endpoint
    );
  })
}


export { 
  FetchAllParts, 
  FetchPart,
  CreatePart,
  UpdatePart,
  UpdatePartTagTypes,
  DeletePart,
  FetchAllPartsAdmin,
  SearchForParts,
  GetPartsMarkupPercents,
  FetchAllTasks,
  FetchTask,
  CreateTask,
  UpdateTaskOnly,
  FetchAllCategories,
  FetchCategory,
  CreateCategory,
  UpdateCategoryAndRelatedTasks,
  FetchAllJobs,
  FetchJob,
  CreateJob,
  UpdateJobAndRelatedCategories,
  SearchForItems,
  FetchTagTypesChoices,
  UpdateTaskRelatedPartsSubmit,
  FetchAllTasksRelatedToParts,
  FetchGlobalMarkup
};

