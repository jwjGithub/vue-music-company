/*
 * @Date: 2020-10-22 09:18:46
 * @Description: 需求库列表接口
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-22 17:20:38
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/company/needs/queryOptionAndMusicPage',
    method: 'post',
    data: data
  })
}
// 新增保存
// export function saveAdd(data) {
//   return request({
//     url: '/optional/base/addOptionalBase',
//     method: 'post',
//     data: data
//   })
// }
