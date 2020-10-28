<!--
 * @Description: 管理员账号管理
 * @Autor: JWJ
 * @Date: 2020-10-27 22:02:16
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-28 22:22:04
-->
<template>
  <div class="main-page admin-account">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">管理员账号管理</div>
        </div>
      </div>
      <div class="content ptx28">
        <div class="left">
          <div class="left-img">
            <img src="@/assets/images/admin/user_head.png">
          </div>
          <div class="left-title mt22">
            <img src="@/assets/images/admin/icon_edit.png">
            <span class="ml8">替换头像</span>
          </div>
        </div>
        <div class="right mlx42">
          <div class="row">
            <p class="row-title">公司名称</p>
            <p class="row-text">和回房间的撒谎近段时间</p>
          </div>
          <div class="row">
            <p class="row-title">账号</p>
            <p class="row-text">fdhfd</p>
          </div>
          <div class="row">
            <p class="row-title">密码</p>
            <p class="row-text">
              <span class="mr12">*****</span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">手机</p>
            <p class="row-text">
              <span class="mr12">18224055666</span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">邮箱</p>
            <p class="row-text">
              <span class="mr12">12345787@qq.com</span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">注册日期</p>
            <p class="row-text">2012-10-24</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAccount',
  components: {
  },
  data() {
    return {
      tabList: [],
      total: 0,
      loading: false,
      dataList: [],
      queryForm: {
        baseName: '', // 自选库名称
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {
        title: '', // 需求标题
        content: ''// 需求内容
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      },
      showAndHide: 1
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.admin-account{
  padding:10px;
  width:100%;
  height:100%;
  >.main-content{
    width:100%;
    height:100%;
    background-color: white;
		display:flex;
    flex-direction: column;
    >.header{
      height:60px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      >.left{
        padding-left:20px;
        display: flex;
        align-items:center;
        >.tag{
          width: 4px;
          height: 24px;
          background: #65a3dd;
        }
        >.title{
          font-size: 20px;
          color: #65a3dd;
        }
      }
    }
    >.content{
      flex:1;
			overflow: hidden;
      display: flex;
      border-top: 4px solid #f7fbfe;
      >.left{
        width: 370px;
        >.left-img{
          width: 202px;
          margin: 0 auto;
          border: 1px solid #cccccc;
        }
        >.left-title{
          text-align: center;
        }
      }
      >.right{
        >.row{
          display: flex;
          >.row-title{
            width: 130px;
            color: #999999;
            font-size: 14px;
          }
          >.row-text{
            color: #333333;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
</style>
