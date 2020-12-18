/*
 * @Descripttion: 优先推送详情接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-17 20:49:43
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-18 19:15:37
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/company/workPost/queryMusicianWork',
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
    url: `/company/workPost/addWorksToOptional`,
    method: 'post',
    data: data
  })
}
// 预留作品
export function addReservation(data) {
  return request({
    url: `/company/workPost/addReservation`,
    method: 'post',
    data: data
  })
}
