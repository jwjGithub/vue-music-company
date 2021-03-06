import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/assets/styles/index.scss' // global css
import '@/assets/icons' // icon

import App from './App'
import store from './store'
import router from './router'

import '@/permission' // permission control

// 全局方法引入
import { getToken } from '@/utils/auth'
import { parseTime, resetForm, handleTree } from '@/utils/index'

// 全局组件引入
import Pagination from '@/components/Pagination'
import MusDialog from '@/components/MusDialog'

// 全局方法挂载
Vue.prototype.getToken = getToken
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('MusDialog', MusDialog)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale, size: 'medium' })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
