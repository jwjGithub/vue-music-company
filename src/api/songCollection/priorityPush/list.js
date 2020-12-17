/*
 * @Descripttion: 优先推送列表接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-16 20:53:05
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-17 20:36:11
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/company/workPost/queryPostMusicianPage',
    method: 'post',
    data: data
  })
}
// 作者列表
export function queryAuthorSelect(data) {
  return request({
    url: '/company/workPost/queryAuthorSelect',
    method: 'post',
    data: data
  })
}
// 作者数据回显
export function querySet(data) {
  return request({
    url: '/company/workPost/querySet',
    method: 'post',
    data: data
  })
}
// 保存添加作者
export function saveAuthor(data) {
  return request({
    url: '/company/workPost/set',
    method: 'post',
    data: data
  })
}
