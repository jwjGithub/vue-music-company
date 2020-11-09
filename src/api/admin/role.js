/*
 * @Date: 2020-10-22 09:18:46
 * @Description: 角色管理
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-22 17:51:12
 * @FilePath: \vue-music-company\src\api\songCollection\optionalLibrary.js
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: `/company/role/getCompanyRoleList`,
    method: 'post',
    data: data
  })
}
// 新增保存
export function saveAdd(data) {
  return request({
    url: `/company/role/addCompanyRole`,
    method: 'post',
    data: data
  })
}
// 修改保存
export function saveEdit(data) {
  return request({
    url: `/company/role/updateCompanyRole`,
    method: 'post',
    data: data
  })
}
// 修改状态
export function saveChangeStatus(data) {
  return request({
    url: `/company/role/changeCompanyRoleStatus`,
    method: 'post',
    data: data
  })
}
// 查询菜单树
export function getTreeList(data) {
  return request({
    url: `/company/auth/getCompanySelectTree`,
    method: 'post',
    data: data
  })
}
// 查询详情
export function getInfo(roleId) {
  return request({
    url: `/company/role/info/${roleId}`,
    method: 'post'
  })
}

