/*
 * @Description:自选库详情
 * @Autor: JWJ
 * @Date: 2020-10-22 20:47:26
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-26 21:36:39
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/optional/base/getMusicPageInOptional',
    method: 'post',
    data: data
  })
}
// 获取自选库下拉
export function getOptionalList(data) {
  return request({
    url: '/optional/base/getOptional',
    method: 'post',
    data: data
  })
}
// 复制歌曲到自选库
export function copyToOptional(data) {
  return request({
    url: `/optional/base/copyToOptional`,
    method: 'post',
    data: data
  })
}
// 移动歌曲到自选库
export function moveToOptional(data) {
  return request({
    url: `/optional/base/moveToOptional`,
    method: 'post',
    data: data
  })
}
// 删除保存
export function saveDelete(data) {
  return request({
    url: `/optional/base/deleteFromOptional`,
    method: 'post',
    data: data
  })
}
