
const LoginUser = (formData) => {
  const endpoint = 'http://localhost:8000/user/login/';

  return fetch(endpoint, {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify(formData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'X-CSRFToken': csrfToken
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
      console.log('Login successful. ', response);
      return response.data;
    } else if (response.status === 403 || response.status === 401) {
      console.log('Authentication error: ', response);
      return response.data;
    } else {
      console.log('Login failed. ', response);
      throw response.data;
    }
    // return a rejected Promise.
  })
  .catch(error => {
    console.log('Login error details: ' + JSON.stringify(error))
    // return Promise.reject('Post Error: ' + error);
    return Promise.reject({
      status: error,
      errorMsg: 'Login from this endpoint: ' + endpoint
    });
  })
}

export { 
  LoginUser,
};
