// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('bootstrap')
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import App from './App'
import router from './router'
import service from './services/service'
import $script from 'scriptjs'
import domain from './config'
// import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
const STATUS = require('./constants/status').STATUS
const TYPE = require('./constants/type').TYPE
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.use(VueAxios,axios);
Vue.prototype.$message = ElementUI.Message
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
Vue.prototype.$status = STATUS
Vue.prototype.$type = TYPE

new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: { App }
})
