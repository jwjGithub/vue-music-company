/*
 * @Descripttion: 优先推送详情接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-17 20:49:43
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-17 21:08:59
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/company/workPost/getOptionalList',
    method: 'post',
    data: data
  })
}
// 获取自选库下拉
export function getOptionalList(data) {
  return request({
    url: '/company/workPost/getOptionalList',
    method: 'post',
    data: data
  })
}
// 将作品添加到自选库
export function addToOptional(data) {
  return request({
    url: `/company/needs/addWorksToOptional`,
    method: 'post',
    data: data
  })
}
