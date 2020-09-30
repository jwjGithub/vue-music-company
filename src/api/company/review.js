import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/company/signup/company_admin_list',
    method: 'post',
    data: data
  })
}
// 发送手机验证码
export function getPhoneSendCode(data) {
  return request({
    url: '/company/signup/do_mobile_username_verification',
    method: 'post',
    data: data
  })
}
// 发送邮箱验证码
export function getEmailSendCode(data) {
  return request({
    url: '/company/signup/do_email_verification',
    method: 'post',
    data: data
  })
}
// 注册保存
export function saveAdd(data) {
  return request({
    url: '/company/signup/do_company_application_for_registration',
    method: 'post',
    data: data
  })
}
