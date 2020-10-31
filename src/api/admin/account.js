/*
 * @Date: 2020-10-22 09:18:46
 * @Description: 自选库接口
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-22 17:51:12
 * @FilePath: \vue-music-company\src\api\songCollection\optionalLibrary.js
 */
import request from '@/utils/request'

// 获取公司信息
export function getComInfo(data) {
  return request({
    url: `/comadmin/getMessage`,
    method: 'post',
    data: data
  })
}
// 发送验证码
export function sendVerificationCode(data) {
  return request({
    url: `/comadmin/checkMobileOrEmail`,
    method: 'post',
    data: data
  })
}
// 修改密码
export function updatePassword(data) {
  return request({
    url: `/comadmin/updatePassword`,
    method: 'post',
    data: data
  })
}
// 修改手机号/邮箱
export function updateEmailOrMobile(data) {
  return request({
    url: `/comadmin/updateEmailOrMobile`,
    method: 'post',
    data: data
  })
}
// 修改公司信息
export function updateCompanyMessage(data) {
  return request({
    url: `/comadmin/updateCompanyMessage/`,
    method: 'post',
    data: data
  })
}
// 修改管理员信息
export function updateMessage(data) {
  return request({
    url: `/comadmin/updateMessage`,
    method: 'post',
    data: data
  })
}
