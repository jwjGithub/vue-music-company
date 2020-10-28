/*
 * @Date: 2020-09-30 17:23:27
 * @Description:
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-28 22:07:47
 * @FilePath: \vue-music-company\src\store\getters.js
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes
}
export default getters
