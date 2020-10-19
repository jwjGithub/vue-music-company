/*
 * @Date: 2020-09-30 17:23:27
 * @Description:
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-19 19:56:50
 * @FilePath: \vue-music-company\src\api\user.js
 */
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

// 通过token获取用户信息
export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
