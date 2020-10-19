/*
 * @Date: 2020-09-30 17:23:27
 * @Description:
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-19 20:08:51
 * @FilePath: \vue-music-company\src\permission.js
 */
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [] // 白名单

router.beforeEach(async(to, from, next) => {
  if (to.query.token) {
    setToken(to.query.token)
  }
  // 进度条开始
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  if (getToken()) {
    if (!store.getters.name) {
      store.dispatch('user/GetInfo').then(res => {
        next()
      })
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // 否则全部重定向到曲库
      window.location = 'http://47.94.21.246:9081/'
      // next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条完成
  NProgress.done()
})
