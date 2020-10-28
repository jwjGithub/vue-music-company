<!--
 * @Description: 发布需求
 * @Autor: JWJ
 * @Date: 2020-10-27 22:02:16
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-28 22:05:53
-->
<template>
  <div class="main-page needsAdmin-releaseNeed">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">发布需求</div>
        </div>
      </div>
      <div class="content">
        <div v-if="showAndHide === 1" class="top">
          <el-form ref="form" class="label-position-top" :model="form" :rules="rules" label-width="130px" label-position="top" size="mini">
            <el-row></el-row>
            <el-form-item label="请输入标题" prop="title">
              <el-input v-model="form.title" style="width:100%;"></el-input>
            </el-form-item>
            <el-form-item label="请输入需求详情" prop="content" style="min-height:300px;">
              <Editor v-model="form.content" style="width:100%;" />
              <!-- <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入" :resize="'none'" style="width:100%;"></el-input> -->
            </el-form-item>
            <el-form-item class="text-center">
              <el-button type="primary" size="medium" @click="addNeed">发布</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="footer">
          <div class="footer-img mt50">
            <img src="@/assets/images/needsAdmin/icon_success.png">
          </div>
          <div class="footer-btn mt50">
            <div class="mb20">恭喜发布成功！</div>
            <el-button type="primary" size="mini" class="mt60" @click="intoNeeds">进入需求库</el-button>
            <el-button type="primary" size="mini" class="ml40 mt60" @click="intoNeeds">再来一条</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addNeed
} from '@/api/needsAdmin/releaseNeed'
import Editor from '@/components/Editor'
export default {
  name: '',
  components: {
    Editor
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
    // 发布需求
    addNeed() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addNeed(this.form).then(res => {
            if (res.msg === 'success') {
              this.showAndHide = 2
            }
            console.log(res, '发布需求')
          })
        } else {
          return false
        }
      })
    },
    intoNeeds() {
      this.showAndHide = 1
      this.form = {
        title: '', // 需求标题
        content: ''// 需求内容
      }
      this.resetForm('form')
    }
  }
}
</script>

<style lang="scss" scoped>
.needsAdmin-releaseNeed{
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
			>.top{
				width:60%;
				min-width: 400px;
				max-width: 1000px;
				margin:0 auto;
      }
      >.footer{
        width: 100%;
        >.footer-img{
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        >.footer-btn{
          margin: 0 auto;
          text-align: center;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.songCollection-optionalLibrary{
//   .main-tabs{
//     width:100%;
//     height:100%;
//     display:flex;
//     flex-direction: column;
//     .el-tabs__content{
//       padding:0;
//       flex:1;
//       overflow:hidden;
//       .el-tab-pane{
//         height:100%;
//       }
//     }
//   }
}
</style>
