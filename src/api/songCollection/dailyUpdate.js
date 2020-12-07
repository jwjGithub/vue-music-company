/*
 * @Descripttion:
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 21:13:18
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-07 21:21:02
 */
import request from '@/utils/request'

// 分页查询
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
