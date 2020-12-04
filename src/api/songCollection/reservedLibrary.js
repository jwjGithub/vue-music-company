/*
 * @Descripttion: 预留库接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-04 13:33:36
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-04 13:57:14
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/optional/base/getWorkPageInReservation',
    method: 'post',
    data: data
  })
}
// 取消预留
export function cancelReservation(data) {
  return request({
    url: '/optional/base/cancelReservation',
    method: 'post',
    data: data
  })
}
