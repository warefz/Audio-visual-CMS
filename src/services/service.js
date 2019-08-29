import Vue from 'vue'
import config from '../config'
import router from '../router'
import { ServerResponse } from 'http';
const ERRORCODE = require('../constants/code')
// Vue.prototype.$http = axios;
axios.defaults.baseURL = config.serviceDomain;

axios.interceptors.request.use(function (req) {
  // Do something before request is sent
  let token = localStorage.getItem(config.token)
  if(token){
    if(typeof req.data == "undefined")
      req.data={
        token:token
      }
    else
      req.data.token=token
  }
  return req;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (resp) {
  if(resp.data.code === ERRORCODE.AUTHENTICATION_FAILED){
    //route to login
    localStorage.removeItem(config.token)
    localStorage.removeItem(config.username)
    router.push({ path: '/login'})
  }
  return resp;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axios