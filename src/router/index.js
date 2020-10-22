/*
 * @Date: 2020-09-30 17:23:27
 * @Description:
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-22 09:19:01
 * @FilePath: \vue-music-company\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/songCollection',
    component: Layout,
    redirect: '/songCollection/optionalLibrary',
    meta: { title: '收歌管理', icon: 'tree' },
    children: [
      {
        path: 'optionalLibrary',
        name: 'songCollectionOptionalLibrary',
        component: () => import('@/views/songCollection/optionalLibrary/index'),
        meta: { title: '自选库' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/test'),
        meta: { title: 'TEST2' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/test1',
    meta: { title: '测试页面', icon: 'tree' },
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/test'),
        meta: { title: 'TEST1' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/test'),
        meta: { title: 'TEST2' }
      }
    ]
  }
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
