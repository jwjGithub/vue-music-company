import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/optional/base/getOptionalPage',
    method: 'post',
    data: data
  })
}
