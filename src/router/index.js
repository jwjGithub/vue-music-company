/*
 * @Date: 2020-09-30 17:23:27
 * @Description:
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-02 15:07:39
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
    path: '/admin',
    component: Layout,
    redirect: '/admin/account',
    meta: { title: '公司管理', icon: 'tree' },
    children: [
      {
        path: 'account',
        name: 'AdminAccount',
        component: () => import('@/views/admin/account/index'),
        meta: { title: '管理员账号管理' }
      },
      {
        path: 'info',
        name: 'AdminInfo',
        component: () => import('@/views/admin/info/index'),
        meta: { title: '公司信息管理' }
      },
      {
        path: 'lowerAccount',
        component: () => import('@/views/admin/lowerAccount/index'),
        meta: { title: '子账号管理' },
        redirect: '/admin/lowerAccount/infoSet',
        children: [
          {
            path: 'infoSet',
            name: 'AdminLowerAccountInfoSet',
            component: () => import('@/views/admin/lowerAccount/infoSet/index'),
            meta: { title: '业务人员账号管理' }
          },
          {
            path: 'role',
            name: 'AdminLowerAccountRole',
            component: () => import('@/views/admin/lowerAccount/role/index'),
            meta: { title: '菜单权限分配' }
          }

        ]
      }
    ]
  },
  {
    path: '/songCollection',
    component: Layout,
    redirect: '/songCollection/optionalLibrary',
    meta: { title: '曲库管理', icon: 'tree' },
    children: [
      {
        path: 'optionalLibrary',
        component: () => import('@/views/songCollection/optionalLibrary/index'),
        meta: { title: '自选库管理' },
        redirect: '/songCollection/optionalLibrary/songLibrary',
        children: [
          {
            path: 'songLibrary',
            name: 'optionalLibrarySongLibrary',
            component: () => import('@/views/songCollection/optionalLibrary/songLibrary/index'),
            meta: { title: '曲库管理' }
          },
          {
            path: 'thesaurus',
            name: 'optionalLibraryThesaurus',
            component: () => import('@/views/songCollection/optionalLibrary/thesaurus/index'),
            meta: { title: '词库管理' }
          }
        ]
      },
      {
        path: 'needsLibrary',
        name: 'songCollectionNeedsLibrary',
        component: () => import('@/views/songCollection/needsLibrary/index'),
        meta: { title: '需求库管理' }
      }
    ]
  },
  {
    path: '/needsAdmin',
    component: Layout,
    redirect: '/needsAdmin/releaseNeed',
    meta: { title: '需求管理', icon: 'tree' },
    children: [
      {
        path: 'releaseNeed',
        name: 'needsAdminReleaseNeed',
        component: () => import('@/views/needsAdmin/releaseNeed/index'),
        meta: { title: '发布需求' }
      },
      {
        path: 'list',
        name: 'needsAdminList',
        component: () => import('@/views/needsAdmin/list/index'),
        meta: { title: '需求列表' }
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
