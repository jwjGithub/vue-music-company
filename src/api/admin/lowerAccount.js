/*
 * @Date: 2020-10-22 09:18:46
 * @Description: 子账号接口
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-22 17:51:12
 */
import request from '@/utils/request'

// 查询业务人员列表(信息设置)
export function getList(data) {
  return request({
    url: '/comadmin/getEmployeeExceptAdmin',
    method: 'post',
    data: data
  })
}
// 添加业务人员账号(信息设置)
export function saveAdd(data) {
  return request({
    url: '/comadmin/addEmployee',
    method: 'post',
    data: data
  })
}
// 编辑保存业务人员账号(信息设置)
export function saveEdit(data) {
  return request({
    url: `/comadmin/updateEmployee`,
    method: 'post',
    data: data
  })
}
// 删除业务人员账号(信息设置)
export function saveDelete(ids) {
  return request({
    url: `/comadmin/deleteEmployee/${ids}`,
    method: 'post'
  })
}
