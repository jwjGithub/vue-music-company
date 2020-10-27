/*
 * @Description:发布需求
 * @Autor: JWJ
 * @Date: 2020-10-22 20:47:26
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-27 22:41:55
 */
import request from '@/utils/request'

// 发布需求(增加)
export function addNeed(data) {
  return request({
    url: '/company/needs/add',
    method: 'post',
    data: data
  })
}
