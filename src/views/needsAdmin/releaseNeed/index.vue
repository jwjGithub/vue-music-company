<!--
 * @Description: 发布需求
 * @Autor: JWJ
 * @Date: 2020-10-27 22:02:16
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-17 11:54:03
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
            <el-form-item label="请输入标题" prop="title">
              <el-input v-model="form.title" style="width:100%;"></el-input>
            </el-form-item>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="自选库类型/名称" prop="optionalName">
                  <el-select v-model="form.optionalType" style="width:30%;">
                    <el-option label="词" :value="0" />
                    <el-option label="曲" :value="1" />
                    <el-option label="词/曲" :value="2" />
                  </el-select>
                  <el-input v-model="form.optionalName" placeholder="请输入名称" style="width:70%;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截止时间" prop="expiredTime">
                  <el-date-picker
                    v-model="form.expiredTime"
                    type="datetime"
                    style="width:100%;"
                    placeholder="请选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="请输入需求详情" prop="content" style="min-height:300px;">
              <Editor v-model="form.content" style="width:100%;" />
            </el-form-item>
            <el-form-item class="text-center">
              <el-button type="primary" :loading="loading" class="mr50" size="medium" @click="addNeed(0)">发布</el-button>
              <el-button class="ml50" :loading="loading" size="medium" @click="addNeed(1)">保存为草稿</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="footer">
          <div class="footer-img mt50">
            <img src="@/assets/images/needsAdmin/icon_success.png">
          </div>
          <div class="footer-btn mt50">
            <div class="mb20">恭喜发布成功！</div>
            <el-button type="primary" size="mini" class="mt60" @click="Go('/needsAdmin/list')">进入需求库</el-button>
            <el-button type="primary" size="mini" class="ml40 mt60" @click="intoNeeds">再来一条</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addNeed,
  saveEdit
} from '@/api/needsAdmin/releaseNeed'
import Editor from '@/components/Editor'
export default {
  name: 'NeedsAdminReleaseNeed',
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
        optionalName: '', // 需求库名称
        optionalType: 0, // 需求库类型 0：词库 1：曲库 2：既是曲库又是词库传
        expiredTime: '', // 截止时间
        status: '', // 状态，0正常 1草稿
        content: ''// 需求内容
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        expiredTime: [
          { required: true, message: '请选择截止时间', trigger: ['blur', 'change'] }
        ],
        optionalName: [
          { required: true, message: '请输入需求库名称', trigger: 'blur' }
        ]
      },
      showAndHide: 1
    }
  },
  created() {
    if (this.$route.params.id) {
      this.form = this.$route.params
    }
  },
  methods: {
    // 发布需求
    addNeed(status) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.status = status
          this.form.effectiveTime = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}') // sb代码
          // 编辑
          if (this.form.id) {
            saveEdit(this.form).then(res => {
              this.loading = false
              this.showAndHide = 2
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 新增
            addNeed(this.form).then(res => {
              this.loading = false
              this.showAndHide = 2
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    intoNeeds() {
      this.showAndHide = 1
      this.form = {
        title: '', // 需求标题
        optionalName: '', // 需求库名称
        optionalType: 0, // 需求库类型 0：词库 1：曲库 2：既是曲库又是词库传
        expiredTime: '', // 截止时间
        status: '', // 状态，0正常 1草稿
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
