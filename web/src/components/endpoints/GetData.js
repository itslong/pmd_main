import React from 'react';

import GetCookie from './GetCookie';
import { PROD_BASE_PATH } from '../frontendBaseRoutes';
// define api BASE_URL and PARTS_URL later

// Get All Parts
const FetchAllParts = (pageNum=1, pageSize=10, filterValue=null) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'api/parts/');

  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const filterBy = filterValue ? '&filter=' + filterValue : '';

  const endpointWithPageQuery = new URL(endpoint + pageQuery + filterBy);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch All Parts Error: ', error, ' from this endpoint: ', endpointWithPageQuery.toString())
    return error;
  })
};


// const FetchAllPartsAdmin = (pageNum=1, pageSize=10, filterValue=null) => {
//   const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
//   const endpoint = new URL(path + 'api/parts/admin/');

//   const currentPageNum = 'page=' + pageNum;
//   const currentPageSize = 'page_size=' + pageSize;
//   const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
//   const filterBy = filterValue ? '&filter=' + filterValue : '';

//   const endpointWithPageQuery = new URL(endpoint + pageQuery + filterBy);

//   const token = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Token ${token}`,
//   };

//   return fetch(endpoint, {headers, })
//   .then(response => {
//     const { status } = response;
//     const res = response.ok ? response.json() : Promise.reject({ error: status });
//     return res;
//   })
//   .catch(error => {
//     console.log('Fetch All Parts Admin Error: ', error, ' from this endpoint: ', endpointWithPageQuery.toString())
//     return error;
//   })
// };

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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch Single Part Error: ', error, ' from this endpoint: ', endpoint.toString())
    return error;
  })
}


// PostParts
const CreatePart = (formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  console.log('part api: ', path)
  const endpoint = new URL(path + 'api/part/create/');
  const csrfToken = GetCookie('csrftoken');

  const token = localStorage.getItem('token');
  console.log('token: ', token, ' csrf: ', csrfToken)
  console.log('form data: ', formData)
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
    // future TODO: check for different status code when implementing dupe prevention
    const { status } = response;
    const res = response.status === 201 ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Part Create error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
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
    // future TODO: check for different status code when implementing dupe prevention
    const { status } = response;
    const res = response.ok ? 'Success' : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Updating part failed ', error)
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Updating Part Tag types failed', error);
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('SearchForParts Error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
  })
}


// searchType: 'parts', 'tasks', etc
const SearchForItems = (searchString, searchType, pageNum=1, pageSize=10, filterValue=null) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/';
  const type = searchType + '-searchable/';
  const endpoint = url + type

  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const query = searchString !== '' ? '&search=' + encodeURIComponent(searchString) : '';

  const pageQuery = '?' + currentPageNum + '&' + currentPageSize + query;
  const filterBy = filterValue ? '&filter=' + filterValue : '';

  const endpointWithPageQuery = new URL(endpoint + pageQuery + filterBy);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Promise rejected at SearchForItems: ', error, ' from this endpoint: ', endpointWithPageQuery.toString())
    return error;
  })
}


const FetchAllTasks = (pageNum=1, pageSize=10, filterValue=null) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = path + 'api/tasks/';
  
  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const filterBy = filterValue ? '&filter=' + filterValue : '';

  const endpointWithPageQuery = new URL(endpoint + pageQuery + filterBy);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch All Tasks Error: ', error, ' from this endpoint: ', endpointWithPageQuery.toString());
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch Single Task Error: ', error, ' from this endpoint: ', endpoint.toString())
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
    // future TODO: check for different status code when implementing dupe prevention
    const { status } = response;
    const res = response.status === 201 ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Task Create error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
  })
};


const UpdateTaskOnly = (taskId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/task/';
  const action = '/edit-only';
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
     // future TODO: check for different status code when implementing dupe prevention
     // change to Promise.reject if failed.
    const responseStatus = response.ok ? 'Success' : response.json();
    return responseStatus;
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

  const options = {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(taskPartsObj),
    headers,
  };

  return fetch(endpoint, options)
  .then(response => {
    // double check the codes
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('CreateTaskParts ran into an error: ', error);
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('FetchAllTasksRelatedToParts encountered an error: ', error, ' from this endpoint: ', endpointWithFilterQuery.toString());
    return error;
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


const FetchAllCategories = (pageNum=1, pageSize=10, filterValue=null) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = path + 'api/categories/';
  
  const currentPageNum = 'page=' + pageNum;
  const currentPageSize = 'page_size=' + pageSize;
  const pageQuery = '?' + currentPageNum + '&' + currentPageSize;
  const filterBy = filterValue ? '&filter=' + filterValue : '';
  
  const endpointWithPageQuery = new URL(endpoint + pageQuery + filterBy);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };

  return fetch(endpointWithPageQuery, {headers, })
  .then(response => {
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch All Parts Error: ', error, ' from this endpoint: ', endpointWithPageQuery.toString());
    return error;
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

  return fetch(endpoint, {headers, })
  .then(response => {
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch Single Category Error: ', error, ' from this endpoint: ', endpoint.toString())
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
    // future TODO: check for different status code when implementing dupe prevention
    const { status } = response;
    const res = response.status === 201 ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Create Category error: ', error);
    return error;
  });
};

const UpdateCategoryAndRelatedTasks = (categoryId, formData) => {
  const path = process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const url = path + 'api/category/';
  const action = '/edit-only';
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
    // change to Promise.reject when failing to udpate.
    const responseStatus = response.ok ? 'Success' : response.json();
    return responseStatus;
  })
  .catch(error => {
    return Promise.reject({
      status: response.status,
      errorMsg: 'Promise rejected from this endpoint: ' + endpoint
    });
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch All Jobs Error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Fetch a single Job Error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
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
    // future TODO: check for different status code when implementing dupe prevention
    const { status } = response;
    const res = response.status === 201 ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Create Job error: ', error);
    return error;
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
    // change to Promise.reject when failing to update.
    const responseStatus = response.ok ? 'Success' : response.json();
    return responseStatus;
  })
  .catch(error => {
    return Promise.reject({
      status: response.status,
      errorMsg: 'Promise rejected from this endpoint: ' + endpoint,
    });
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Parts Markup error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('FetchTagTypesChoices error: ', error, ' from this endpoint: ', endpoint.toString());
    return error;
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
    const { status } = response;
    const res = response.ok ? response.json() : Promise.reject({ error: status });
    return res;
  })
  .catch(error => {
    console.log('Global Markup Error: ', error, ' from this endpoint: ', endpoint.toString())
    return error;
  })
}


export { 
  FetchAllParts, 
  FetchPart,
  CreatePart,
  UpdatePart,
  UpdatePartTagTypes,
  DeletePart,
  // FetchAllPartsAdmin,
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

