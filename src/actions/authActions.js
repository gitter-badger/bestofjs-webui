// auth0 actions
// 3 exported functions:
// - start()
// - login()
// - logout()

import hashHistory from 'react-router/lib/hashHistory'

import log from '../helpers/log'
import UrlManager from './urlManager'

// object used to save the current location in the local storage
// when the user pushes the login button.
const urlManager = typeof window !== 'undefined' && new UrlManager(window)

const APP_URL = 'https://bestofjs.auth0.com'

const LOCAL_KEYS = ['id', 'access']
  .map(key => `bestofjs_${key}_token`)

// Check if the user is logged in when the application starts
// called from <App> componentDidMount()
export function start() {
  return dispatch => {
    loginRequest()
    return getToken()
      .then(token => {
        getProfile(token.id_token)
          .then(profile => {
            if (profile) {
              return dispatch(loginSuccess(profile, token.id_token))
            } else {
              return dispatch(loginFailure())
            }
          })
          .catch(() => {
            return dispatch(loginFailure())
          })
      })
      .catch(() => {
        return dispatch(loginFailure())
      })
  }
}

// `login` action called from the login button
export function login() {
  // Save the current URL so that we can redirect the user when we are back
  if (urlManager) urlManager.save()
  const client_id = 'MJjUkmsoTaPHvp7sQOUjyFYOm2iI3chx'
  const redirect_uri = `${self.location.origin}%2Fauth0.html`
  const auth0Client = 'eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiNi44LjAifQ'
  const url = `${APP_URL}/authorize?scope=openid&response_type=token&connection=github&sso=true&client_id=${client_id}&redirect_uri=${redirect_uri}&auth0Client=${auth0Client}`
  return dispatch => {
    dispatch(loginRequest())
    // Go to auth0 authenication page
    self.location.href = url
  }
}

// Return user's `id_token` (JWT) checking from localStorage:
function getToken() {
  const [id_token, access_token] = LOCAL_KEYS.map(
    key => window.localStorage[key]
  )
  if (id_token) {
    return Promise.resolve({
      id_token,
      access_token
    })
  }
  return Promise.reject('')
}

// Return UserProfile for a given `id_token`
function getProfile(token) {
  if (!token) return Promise.reject('Token is missing!')
  const options = {
    body: `id_token=${token}`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // do not use Content-Type: 'application/json' to avoid extra 'OPTIONS' requests (#9)
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const url = `${APP_URL}/tokeninfo`
  return fetch(url, options)
    .then(response => checkStatus(response))
    .then(response => response.json())
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function loginRequest() {
  return {
    type: 'LOGIN_REQUEST'
  }
}
function loginSuccess(profile, token) {
  const hash = urlManager && urlManager.get(true)
  if (hash) {
    log('POST lOGIN REDIRECT', hash)
    hashHistory.push(hash)
  }
  return {
    type: 'LOGIN_SUCCESS',
    profile,
    token
  }
}
function loginFailure() {
  resetToken()
  return {
    type: 'LOGIN_FAILURE'
  }
}

// LOGOUT
function logoutRequest() {
  return {
    type: 'LOGOUT_REQUEST'
  }
}
function logoutSuccess() {
  return {
    type: 'LOGOUT_SUCCESS'
  }
}

// logout button
export function logout() {
  return dispatch => {
    dispatch(logoutRequest())
    const p = new Promise(function (resolve) {
      // Do not call window.auth0.logout() that will redirect to Github signout page
      resetToken()
      resolve()
    })
    return p
      .then(() => dispatch(logoutSuccess()))
  }
}

function resetToken() {
  LOCAL_KEYS.forEach(key => window.localStorage.removeItem(key))
}
