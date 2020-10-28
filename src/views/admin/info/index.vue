<!--
 * @Description: 公司信息管理
 * @Autor: JWJ
 * @Date: 2020-10-27 22:02:16
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-28 22:23:47
-->
<template>
  <div class="main-page admin-account">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">公司信息管理</div>
        </div>
      </div>
      <div class="content">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminInfo',
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
      margin-bottom: 10px;
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
    }
  }
}
</style>
<style lang="scss">
</style>
