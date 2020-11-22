/*
 * @Description:需求库详情接口
 * @Autor: JWJ
 * @Date: 2020-10-22 20:47:26
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-22 21:29:46
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
    url: '/company/needs/getOptionalList',
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
