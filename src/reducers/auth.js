const defaultState = {
  username: '',
  pending: true
}
export default function auth(state = defaultState, action) {
  switch (action.type) {
  // LOGIN
  case 'LOGIN_REQUEST':
    return Object.assign({}, state, { pending: true })
  case 'LOGIN_SUCCESS':
    return Object.assign({}, state, {
      pending: false,
      username: action.profile.nickname,
      name: action.profile.name,
      avatar: action.profile.picture,
      followers: action.profile.followers,
      token: action.token
    })
  case 'LOGIN_FAILURE':
    return Object.assign({}, state, { pending: false })
  // LOGOUT
  case 'LOGOUT_REQUEST':
    return Object.assign({}, state, { pending: true })
  case 'LOGOUT_SUCCESS':
    return {
      pending: false,
      username: ''
    }
  case 'LOGOUT_FAILURE':
    return Object.assign({}, state, { pending: false })
  default:
    return state
  }
}
