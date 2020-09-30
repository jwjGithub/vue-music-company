import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/managerole/getManageRoleList',
    method: 'post',
    data: data
  })
}
// 新增
export function saveAdd(data) {
  return request({
    url: '/sys/managerole/addManageRole',
    method: 'post',
    data: data
  })
}
// 编辑
export function saveEdit(data) {
  return request({
    url: '/sys/managerole/updateManageRole',
    method: 'post',
    data: data
  })
}
// 获取菜单选择树
export function getManageMenuSelectTree(data) {
  return request({
    url: '/sys/managemenu/getManageMenuSelectTree',
    method: 'post',
    data: data
  })
}
// 获取单个数据信息
export function getInfoById(id) {
  return request({
    url: `/sys/managerole/info/${id}`,
    method: 'post'
  })
}
// 删除 type:1 单个 type:2 批量
export function deleteMnageRole(data, type) {
  const url = type === 1 ? '/sys/managerole/deleteMnageRole' : '/sys/managerole/deleteBathMnageRole'
  const json = type === 1 ? { id: data[0] } : data
  return request({
    url: url,
    method: 'post',
    data: json
  })
}
// 停用管理员角色
export function stopManegeRole(data) {
  return request({
    url: '/sys/managerole/stopManegeRole',
    method: 'post',
    data: data
  })
}
// 批量停用管理员角色
export function stopBatchManegeRole(data) {
  return request({
    url: '/sys/managerole/stopBatchManegeRole',
    method: 'post',
    data: data
  })
}
// 启用管理员用户
export function normalManegeRole(data) {
  return request({
    url: '/sys/managerole/normalManegeRole',
    method: 'post',
    data: data
  })
}
// 批量启用管理员用户
export function normalBatchManegeRole(data) {
  return request({
    url: '/sys/managerole/normalBatchManegeRole',
    method: 'post',
    data: data
  })
}
