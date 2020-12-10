/*
 * @Descripttion:
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 21:13:18
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-10 20:52:45
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/company/dailyUpdateCondition/queryDailyUpdate',
    method: 'post',
    data: data
  })
}
// 设置下拉框数据
export function querySelect(data) {
  return request({
    url: `/company/dailyUpdateCondition/querySelect`,
    method: 'post',
    data: data
  })
}
// 每日更新条件设置初始数据
export function querySingle(data) {
  return request({
    url: '/company/dailyUpdateCondition/querySingle',
    method: 'post',
    data: data
  })
}
// 修改每日更新条件设置
export function saveEdit(data) {
  return request({
    url: '/company/dailyUpdateCondition/set',
    method: 'post',
    data: data
  })
}
