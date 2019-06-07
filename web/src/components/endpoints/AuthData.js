
const LoginUser = (formData) => {
  // const path =  process.env.NODE_ENV === 'production' ? 'pmd-dev.herokuapp.com/' : process.env.LOCAL_PATH;
  const path =  process.env.NODE_ENV === 'production' ? process.env.API_LOGIN_PATH : process.env.LOCAL_PATH;
  const endpoint = path + 'user/login/';
  const newEndpoint = new URL('https://pmd-dev.herokuapp.com/' + 'user/login/');
  console.log('the login path: ', endpoint)
  console.log('the new path: ', newEndpoint)

  return fetch(newEndpoint, {
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
      // console.log('Login successful. ', response);
      return response.data;
    } else if (response.status === 403 || response.status === 401) {
      // console.log('Authentication error: ', response);
      return response.data;
    } else {
      // console.log('Login failed. ', response);
      return response.data;
    }
    // return a rejected Promise.
  })
  .catch(error => {
    return Promise.reject({
      status: error,
      errorMsg: 'Login from this endpoint: ' + newEndpoint
    });
  })
}

export { 
  LoginUser,
};
