import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/user/getAdminList',
    method: 'post',
    data: data
  })
}
// 新增
export function saveAdd(data) {
  return request({
    url: '/sys/user/addAdminUser',
    method: 'post',
    data: data
  })
}
// 编辑
export function saveEdit(data) {
  return request({
    url: '/sys/user/updateAdmin',
    method: 'post',
    data: data
  })
}
// 获取角色下拉框
export function getSelectList(data) {
  return request({
    url: '/sys/managerole/getSelectList',
    method: 'post',
    data: data
  })
}
// 获取单个数据信息
export function getInfoById(id) {
  return request({
    url: `sys/user/info/${id}`,
    method: 'post'
  })
}
// 删除 type:1 单个 type:2 批量
export function deleteUser(data, type) {
  const url = type === 1 ? '/sys/user/deleteAdmin' : '/sys/user/deleteBatchAdmin'
  const json = type === 1 ? { userId: data[0] } : data
  return request({
    url: url,
    method: 'post',
    data: json
  })
}
// 停用管理员用户
export function stopAdmin(data) {
  return request({
    url: '/sys/user/stopAdmin',
    method: 'post',
    data: data
  })
}
// 批量停用管理员用户
export function stopBatchAdmin(data) {
  return request({
    url: '/sys/user/stopBatchAdmin',
    method: 'post',
    data: data
  })
}
// 启用管理员用户
export function normalAdmin(data) {
  return request({
    url: '/sys/user/normalAdmin',
    method: 'post',
    data: data
  })
}
// 批量启用管理员用户
export function normalBatchAdmin(data) {
  return request({
    url: '/sys/user/normalBatchAdmin',
    method: 'post',
    data: data
  })
}
