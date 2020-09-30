import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/managemenu/getManageMenuList',
    method: 'post',
    data: data
  })
}
// 新增
export function saveAdd(data) {
  return request({
    url: '/sys/managemenu/addManageMenu',
    method: 'post',
    data: data
  })
}
// 编辑
export function saveEdit(data) {
  return request({
    url: '/sys/managemenu/updateManageMenu',
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
    url: `/sys/managemenu/info/${id}`,
    method: 'post'
  })
}
// 删除 type:1 单个 type:2 批量
export function deleteManageMenu(data, type) {
  const url = type === 1 ? '/sys/managemenu/deleteManageMenu' : '/sys/managemenu/deleteBathManageMenu'
  const json = type === 1 ? { id: data[0] } : data
  return request({
    url: url,
    method: 'post',
    data: json
  })
}

// 停用后台菜单
export function stopManageMenu(data) {
  return request({
    url: '/sys/managemenu/stopManageMenu',
    method: 'post',
    data: data
  })
}
// 批量停用后台菜单
export function stopBatchManageMenu(data) {
  return request({
    url: '/sys/managemenu/stopBatchManageMenu',
    method: 'post',
    data: data
  })
}
// 启用后台菜单
export function normalManageMenu(data) {
  return request({
    url: '/sys/managemenu/normalManageMenu',
    method: 'post',
    data: data
  })
}
// 批量启用后台菜单
export function normalBatchManageMenu(data) {
  return request({
    url: '/sys/managemenu/normalBatchManageMenu',
    method: 'post',
    data: data
  })
}
