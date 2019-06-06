
const LoginUser = (formData) => {
  const path =  process.env.NODE_ENV === 'production' ? 'blah-blah.com/' : process.env.LOCAL_PATH;
  const endpoint = path + 'user/login/';
  console.log('login path: ', endpoint)

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
      errorMsg: 'Login from this endpoint: ' + endpoint
    });
  })
}

export { 
  LoginUser,
};
