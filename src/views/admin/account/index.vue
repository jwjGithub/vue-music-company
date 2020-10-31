<!--
 * @Description: 管理员账号管理
 * @Autor: JWJ
 * @Date: 2020-10-27 22:02:16
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-31 16:25:30
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
            <img :src="dataInfo.sysUserEntity && dataInfo.sysUserEntity.profileUrl || '@/assets/images/admin/icon_company.png'">
          </div>
          <div class="left-title mt22">
            <el-button type="text" icon="icon icon-edit" @click="openFileUpload">替换头像</el-button>
          </div>
        </div>
        <div class="right mlx42">
          <div class="row">
            <p class="row-title">公司名称</p>
            <p class="row-text">{{ dataInfo.companyName }}</p>
          </div>
          <div class="row">
            <p class="row-title">账号</p>
            <p class="row-text">{{ dataInfo.sysUserEntity && dataInfo.sysUserEntity.username }}</p>
          </div>
          <div class="row">
            <p class="row-title">密码</p>
            <p class="row-text">
              <span class="mr12">*****</span>
              <img class="pointer" src="@/assets/images/admin/icon_edit.png" @click="openUpdatePassword">
            </p>
          </div>
          <div class="row">
            <p class="row-title">手机</p>
            <p class="row-text">
              <span class="mr12">{{ dataInfo.sysUserEntity && dataInfo.sysUserEntity.mobile }}</span>
              <img class="pointer" src="@/assets/images/admin/icon_edit.png" @click="openDialogOption('mobile')">
            </p>
          </div>
          <div class="row">
            <p class="row-title">邮箱</p>
            <p class="row-text">
              <span class="mr12">{{ dataInfo.sysUserEntity && dataInfo.sysUserEntity.email }}</span>
              <img class="pointer" src="@/assets/images/admin/icon_edit.png" @click="openDialogOption('email')">
            </p>
          </div>
          <div class="row">
            <p class="row-title">注册日期</p>
            <p class="row-text">{{ dataInfo.sysUserEntity && dataInfo.sysUserEntity.createTime }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 附件上传 -->
    <input ref="upload-file" type="file" accept="image/*" style="display: none" @change="uploadFileChange" />
    <!-- 修改密码 弹窗 -->
    <mus-dialog
      title="修改密码"
      :loading="dialogUpdatePassword.loading"
      :is-show="dialogUpdatePassword.show"
      :width="'600px'"
      @handleClose="dialogUpdatePassword.show = false"
      @handleConfirm="saveUpdatePassword"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="130px" :inline="true" class="text-center">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="验证方式：" prop="type">
                <el-select v-model="passwordForm.type" placeholder="请选择" class="w30">
                  <el-option label="手机号验证" value="mobile" />
                  <el-option label="邮箱验证" value="email " />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="passwordForm.type" label="手机验证码：" prop="vercode">
                <div class="w30 text-left">
                  <el-input v-model="passwordForm.vercode" class="w15"></el-input>
                  <el-button v-loading="passLoading" type="primary" class="btn-success w14 ml10" :disabled="passSendCodeType" @click="getPassSendCode">{{ passSendCodeCount }}</el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="旧密码：" prop="password">
                <el-input v-model="passwordForm.password" type="password" placeholder="请输入" class="w30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码：" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入" class="w30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="确认密码：" prop="newPassword2">
                <el-input v-model="passwordForm.newPassword2" type="password" placeholder="请输入" class="w30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </mus-dialog>
    <!-- 修改手机号/邮箱密码 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'600px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" :inline="true" class="text-center">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item v-if="form.type" :label="form.type == 'mobile' ? '邮箱验证码：' : '手机验证码：'" prop="vercode">
                <div class="w30 text-left">
                  <el-input v-model="form.vercode" class="w15"></el-input>
                  <el-button v-loading="phoneLoading" type="primary" class="btn-success w14 ml10" :disabled="phoneSendCodeType" @click="getPhoneSendCode">{{ phoneSendCodeCount }}</el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="form.type == 'mobile'" :span="24">
              <el-form-item label="修改后的手机号：" prop="mobile">
                <el-input v-model="form.mobile" type="text" placeholder="请输入" class="w30"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="form.type == 'email'" :span="24">
              <el-form-item label="修改后的邮箱：" prop="email">
                <el-input v-model="form.email" type="text" placeholder="请输入" class="w30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>

<script>
import {
  getComInfo,
  sendVerificationCode,
  updatePassword,
  updateEmailOrMobile,
  updateMessage
} from '@/api/admin/account'
import {
  uploadImg
} from '@/api/common'
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
      dataInfo: {},
      phoneLoading: false,
      phoneSendCodeType: false, // 获取手机验证码状态 false 可以获取 true 不可获取
      phoneSendCodeCount: '获取验证码',
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      form: {
        vercode: '', // 验证码
        type: '', // 修改项mobile/email
        mobile: '', // 修改后的手机号
        email: '' // 修改后的邮箱
      },
      rules: {
        vercode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入新的手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入新的邮箱', trigger: 'blur' }
        ]
      },
      // 修改密码弹框
      dialogUpdatePassword: {
        title: '',
        show: false,
        loading: false
      },
      passLoading: false,
      passSendCodeType: false, // 获取手机验证码状态 false 可以获取 true 不可获取
      passSendCodeCount: '获取验证码',
      passwordForm: {}, // 修改密码表单
      passwordRules: {
        type: [
          { required: true, message: '请选择验证方式', trigger: ['blur', 'change'] }
        ],
        vercode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' }
        ]
      },
      showAndHide: 1
    }
  },
  created() {
    this.getComInfo()
  },
  methods: {
    getComInfo() {
      getComInfo().then(res => {
        this.dataInfo = res.data || {}
        console.log(this.dataInfo, '-sysUserEntity-')
      })
    },
    // 打开修改密码窗口
    openUpdatePassword() {
      this.dialogUpdatePassword = {
        show: true,
        loading: false
      }
      this.passwordForm = {
        password: '', // 密码
        newPassword: '', // 新密码
        newPassword2: '', // 确认密码
        vercode: '', // 验证码
        type: '' // mobile 验证手机，email 验证邮箱
      }
      this.resetForm('passwordForm')
    },
    // 打开修改手机/邮箱 弹框
    openDialogOption(type) {
      this.form = {
        vercode: '', // 验证码
        type: type, // 修改项mobile/email
        mobile: '', // 修改后的手机号
        email: '' // 修改后的邮箱
      }
      this.dialogOption = {
        title: type === 'mobile' ? '修改手机' : '修改邮箱',
        show: true,
        loading: false
      }
      this.resetForm('form')
    },
    // 获取修改密码 验证码
    getPassSendCode() {
      let json = {
        updateType: this.passwordForm.type,
        type: 'updatePassword'
      }
      this.passLoading = true
      sendVerificationCode(json).then(res => {
        let _this = this
        this.passSendCodeType = true
        this.passSendCodeCount = '60秒后重新获取'
        let count = 60
        let indexS = ''
        this.passLoading = false
        function countTimeout() {
          indexS = setTimeout(() => {
            if (count <= 1) {
              _this.passSendCodeType = false
              _this.passSendCodeCount = '获取验证码'
            } else {
              count -= 1
              _this.passSendCodeCount = count + '秒后重新获取'
              countTimeout()
            }
          }, 1000)
        }
        countTimeout()
      }).catch(() => {
        this.passLoading = false
      })
    },
    // 获取修改手机号/邮箱 验证码
    getPhoneSendCode() {
      let json = {
        updateType: this.form.type === 'mobile' ? 'email' : 'mobile',
        type: 'updateOther '
      }
      this.phoneLoading = true
      sendVerificationCode(json).then(res => {
        let _this = this
        this.phoneSendCodeType = true
        this.phoneSendCodeCount = '60秒后重新获取'
        let count = 60
        let indexS = ''
        this.phoneLoading = false
        function countTimeout() {
          indexS = setTimeout(() => {
            if (count <= 1) {
              _this.phoneSendCodeType = false
              _this.phoneSendCodeCount = '获取验证码'
            } else {
              count -= 1
              _this.phoneSendCodeCount = count + '秒后重新获取'
              countTimeout()
            }
          }, 1000)
        }
        countTimeout()
      }).catch(() => {
        this.phoneLoading = false
      })
    },
    // 修改密码确认回调
    saveUpdatePassword() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          this.dialogUpdatePassword.loading = true
          updatePassword(this.passwordForm).then(res => {
            this.$message.success('修改成功')
            this.dialogUpdatePassword.loading = false
            this.dialogUpdatePassword.show = false
          }).catch(() => {
            this.dialogUpdatePassword.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 修改 手机/邮箱回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogOption.loading = true
          updateEmailOrMobile(this.form).then(res => {
            this.$message.success('修改成功')
            this.dialogOption.loading = false
            this.dialogOption.show = false
          }).catch(() => {
            this.dialogOption.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 打开附件上传
    openFileUpload() {
      this.$refs['upload-file'].click()
    },
    uploadFileChange() {
      let fileObj = this.$refs['upload-file']
      let files = fileObj.files
      if (files.length > 0) {
        let file = files[0]
        const reg = '.*\\.(jpg|JPG|png|PNG)'
        if (file.name.match(reg) == null) {
          this.$notify.error({ title: '请选择格式为“jpg”或“png”的文件' })
          return false
        }
        if (file.size > 1024 * 1024 * 5) {
          this.$notify.error({ title: '对不起，文件不能大于5M，请重新上传' })
          return false
        }
        let formData = new FormData()
        console.log(file, '-file')
        formData.append('file', file)
        uploadImg(formData).then(res => {
          let info = {
            profile: res.data.id
          }
          updateMessage(info).then(res => {
            this.$message.success('修改成功')
            this.getComInfo()
          })
        })
      }
    }
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
          width: 200px;
          height: 200px;
          margin: 0 auto;
          border: 1px solid #cccccc;
          >img{
            height: 100%;
            width: 100%;
          }
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
