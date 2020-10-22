/*
 * @Description:自选库详情
 * @Autor: JWJ
 * @Date: 2020-10-22 20:47:26
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-22 21:31:34
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
// 删除自选库歌曲
export function deleteMusic(data) {
  return request({
    url: '/optional/base/getMusicPageInOptional',
    method: 'post',
    data: data
  })
}
