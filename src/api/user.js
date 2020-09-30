import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取路由数据
export function getRouterList() {
  return request({
    url: '/sys/managemenu/getMenuRoute',
    method: 'POST'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
