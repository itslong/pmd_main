import React from 'react';
import GetCookie from './GetCookie'

let csrfToken = GetCookie('csrftoken');

const CSRFToken = () => {
  return (
    <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
  )
}

export default CSRFToken;
