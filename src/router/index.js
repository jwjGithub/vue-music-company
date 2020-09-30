import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/system'
    // children: [{
    //   path: 'dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/dashboard/index'),
    //   meta: { title: 'Dashboard', icon: 'dashboard' }
    // }]
  },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/account',
  //   name: 'System',
  //   meta: { title: '管理员管理', icon: 'tree' },
  //   children: [
  //     {
  //       path: 'account',
  //       name: 'Account',
  //       component: () => import('@/views/system/account/index'),
  //       meta: { title: '账号管理', icon: 'table' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'Role',
  //       component: () => import('@/views/system/role/index'),
  //       meta: { title: '角色管理', icon: 'table' }
  //     },
  //     {
  //       path: 'menu',
  //       name: 'Menu',
  //       component: () => import('@/views/system/menu/index'),
  //       meta: { title: '菜单管理', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/company',
  //   component: Layout,
  //   redirect: '/company/review',
  //   name: 'Company',
  //   meta: { title: '公司管理', icon: 'tree' },
  //   children: [
  //     {
  //       path: 'review',
  //       name: 'Review',
  //       component: () => import('@/views/company/review/index'),
  //       meta: { title: '公司注册审核', icon: 'table' }
  //     },
  //     {
  //       path: 'state',
  //       name: 'State',
  //       component: () => import('@/views/company/state/index'),
  //       meta: { title: '公司状态', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/resourceMonitoring',
  //   component: Layout,
  //   name: 'ResourceMonitoring',
  //   meta: { title: '资源监控', icon: 'tree' },
  //   children: [
  //     {
  //       path: 'http://47.94.21.246:8082/musicmanage/druid/login.html',
  //       name: 'druidJK',
  //       meta: { title: 'druid监控', icon: 'table' }
  //     },
  //     {
  //       path: 'http://47.94.21.246:8082/musicmanage/monitoring',
  //       name: 'YYJK',
  //       meta: { title: '应用监控', icon: 'table' }
  //     }
  //   ]
  // },
  {
    path: '/example1',
    component: Layout,
    redirect: '/example1/table1',
    name: 'Example',
    meta: { title: '音乐人管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '音乐人信息', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '账号状态', icon: 'tree' }
      },
      {
        path: 'tree1',
        name: 'Tree1',
        component: () => import('@/views/tree/index'),
        meta: { title: '会员信息', icon: 'tree' }
      }
    ]
  },
  {
    path: '/example2',
    component: Layout,
    redirect: '/example2/table1',
    name: 'Example',
    meta: { title: '曲库管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '歌曲信息', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '歌曲状态', icon: 'tree' }
      },
      {
        path: 'tree1',
        name: 'Tree1',
        component: () => import('@/views/tree/index'),
        meta: { title: '举报审核', icon: 'tree' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '日志跟踪',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '登录日志' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: '公司登录日志' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-3',
            meta: { title: '音乐人登录日志' }
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-3',
            meta: { title: '管理员登录日志' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: '敏感业务日志' }
      },
      {
        path: 'menu3',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: '财务日志' }
      },
      {
        path: 'menu4',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: '系统报错日志' }
      }
    ]
  },
  {
    path: '/example3',
    component: Layout,
    redirect: '/example3/table1',
    name: 'Example',
    meta: { title: '财务管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '收费项管理', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '优惠管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/example6',
    component: Layout,
    redirect: '/example6/table1',
    name: 'Example',
    meta: { title: '问题反馈', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '问题反馈', icon: 'table' }
      }
    ]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
