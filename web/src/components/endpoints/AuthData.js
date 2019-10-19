import { PROD_BASE_PATH } from '../frontendBaseRoutes';


const LoginUser = (formData) => {
  // const path =  process.env.NODE_ENV === 'production' ? 'pmd-dev.herokuapp.com/' : process.env.LOCAL_PATH;
  const path =  process.env.NODE_ENV === 'development' ? process.env.LOCAL_PATH : PROD_BASE_PATH;
  const endpoint = new URL(path + 'user/login/');

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (response.status < 500) {
      return response.json()
      .then(data => {
        return {status: response.status, data};
      })
    } else {
      console.log('Server error');
      throw response;
    }
  })
  .then(response => {
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 403 || response.status === 401) {
      return response.data;
    } else {
      return response.data;
    }
  })
  .catch(error => {
    return Promise.reject({
      status: error,
      errorMsg: 'Login from this endpoint: ' + endpoint
    });
  })
}

export { 
  LoginUser,
};
