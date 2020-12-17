/*
 * @Descripttion: 每日更新接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 21:13:18
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-16 20:46:55
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
// 自选库列表
export function optionalList(data) {
  return request({
    url: '/company/dailyUpdateCondition/getOptionalList',
    method: 'post',
    data: data
  })
}
// 添加自选库保存
export function optionalSave(data) {
  return request({
    url: '/company/dailyUpdateCondition/addWorksToOptional',
    method: 'post',
    data: data
  })
}
// 作品预留
export function addReservation(data) {
  return request({
    url: '/company/dailyUpdateCondition/addReservation',
    method: 'post',
    data: data
  })
}
