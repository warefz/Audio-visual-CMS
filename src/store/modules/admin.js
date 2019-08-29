const state = {
  username:''
}

// getters
const getters = {
  username:state => state.username
}

// actions
const actions = {
}

// mutations
const mutations = {
  setUserInfo (state, {username}) {
    // rollback to the cart saved before sending the request
    state.username = username
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}