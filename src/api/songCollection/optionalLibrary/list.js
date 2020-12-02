/*
 * @Date: 2020-10-22 09:18:46
 * @Description: 自选库接口
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-02 14:19:34
 * @FilePath: \vue-music-company\src\api\songCollection\optionalLibrary.js
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/optional/base/getOptionalPage',
    method: 'post',
    data: data
  })
}
// 新增保存
export function saveAdd(data) {
  return request({
    url: '/optional/base/addOptionalBase',
    method: 'post',
    data: data
  })
}
// 编辑保存
export function saveEdit(data) {
  return request({
    url: '/optional/base/updateOptionalBase',
    method: 'post',
    data: data
  })
}
// 删除保存
export function saveDelete(data) {
  return request({
    url: '/optional/base/deleteOptional',
    method: 'post',
    data: data
  })
}
// 获取公司下所有用户
export function getUserUnderCom(data) {
  return request({
    url: '/optional/base/getUserUnderCom',
    method: 'post',
    data: data
  })
}
