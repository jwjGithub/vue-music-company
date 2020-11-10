<!--
 * @Description: 公司信息管理
 * @Autor: JWJ
 * @Date: 2020-10-27 22:02:16
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-10 18:16:41
-->
<template>
  <div class="main-page admin-info">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">公司信息管理</div>
        </div>
      </div>
      <div class="content ptx28">
        <el-scrollbar class="custom-scrollbar">
          <div class="content-main">
            <div class="left">
              <div class="left-img">
                <img :src="dataInfo.profile && dataInfo.profile.url || '@/assets/images/admin/icon_company.png'">
              </div>
              <el-button type="text" icon="icon icon-edit" @click="openFileUpload">替换公司标志</el-button>
            </div>
            <div class="right ml50">
              <div class="row">
                <div class="row-title">公司名称</div>
                <div class="row-text">{{ dataInfo.companyName }}</div>
              </div>
              <div class="row">
                <div class="row-title">注册日期</div>
                <div class="row-text">{{ dataInfo.sysUserEntity && dataInfo.sysUserEntity.createTime }}</div>
              </div>
              <div class="row">
                <div class="row-title">公司性质</div>
                <div class="row-text">
                  <span v-if="companyNature" class="mr12">{{ setCompanyType(dataInfo.companyType) }}</span>
                  <span v-else>
                    <el-select v-model="companyInfo.companyType" placeholder="请选择" class="w20">
                      <el-option label="国有企业" :value="1" />
                      <el-option label="集体企业" :value="2" />
                      <el-option label="联营企业" :value="3" />
                      <el-option label="股份合作制企业" :value="4" />
                      <el-option label="私营企业" :value="5" />
                      <el-option label="合伙企业" :value="6" />
                    </el-select>
                    <el-button type="primary" class="ml10" @click="saveCompanyType">保存</el-button>
                  </span>
                  <i v-if="companyNature" class="icon icon-edit pointer" @click="editCompanyType"></i>
                </div>
              </div>
              <div class="row">
                <div class="row-title">地址</div>
                <div class="row-text">
                  <span v-if="addressClick" class="mr12">{{ dataInfo.address }}</span>
                  <span v-else>
                    <el-input v-model="companyInfo.address" class="w20"></el-input>
                    <el-button type="primary" class="ml10" @click="saveCompanyType">保存</el-button>
                  </span>
                  <i v-if="addressClick" class="icon icon-edit pointer" @click="editAddress"></i>
                </div>
              </div>
              <div class="row">
                <div class="row-title">网址</div>
                <div class="row-text">
                  <span v-if="urlClick" class="mr12">{{ dataInfo.url }}</span>
                  <span v-else>
                    <el-input v-model="companyInfo.url" class="w20"></el-input>
                    <el-button type="primary" class="ml10" @click="saveCompanyType">保存</el-button>
                  </span>
                  <i v-if="urlClick" class="icon icon-edit pointer ml10" @click="editUrl"></i>
                </div>
              </div>
              <div class="row">
                <div class="row-title">营业执照</div>
                <div class="row-text">
                  <div class="row-img mb10">
                    <img :src="dataInfo.lisence && dataInfo.lisence.tempUrl || '@/assets/images/admin/business_license.png'">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="row-title">简介</div>
                <div class="row-text">
                  <div style="max-width:550px;">
                    <div v-if="introductionClick">
                      <div class="row-cont" v-html="dataInfo.introduction"></div>
                    </div>
                    <div v-else class="h26 w50">
                      <Editor v-model="companyInfo.introduction" style="width:100%;" />
                    </div>
                  </div>
                  <div>
                    <i v-if="introductionClick" class="icon icon-edit pointer ml10" @click="editIntroduction"></i>
                    <el-button v-else type="primary" class="ml10" @click="saveCompanyType">保存</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- 附件上传 -->
    <input ref="upload-file" type="file" accept="image/*" style="display: none" @change="uploadFileChange" />
  </div>
</template>

<script>
import {
  getComInfo,
  updateCompanyMessage
} from '@/api/admin/account'
import {
  uploadImg
} from '@/api/common'
import Editor from '@/components/Editor'
export default {
  name: 'AdminAccount',
  components: {
    Editor
  },
  data() {
    return {
      total: 0,
      loading: false,
      dataInfo: {},
      companyNature: true,
      addressClick: true,
      introductionClick: true,
      urlClick: true,
      companyInfo: {
        id: null, // 公司ID
        companyType: null, // 公司类型 1国有企业 2集体企业 3联营企业 4股份合作制企业 5私营企业 6合伙企业
        introduction: null, // 公司简介
        address: null, // 公司地址
        profileAtt: null, // 公司图标
        url: null // 网址
      }
    }
  },
  created() {
    this.getComInfo()
  },
  methods: {
    getComInfo() {
      getComInfo().then(res => {
        this.dataInfo = res.data || {}
        this.companyInfo.id = this.dataInfo.id
      })
    },
    setCompanyType(type) {
      let str = ''
      switch (type) {
        case 1:
          str = '国有企业'
          break
        case 2:
          str = '集体企业'
          break
        case 3:
          str = '联营企业'
          break
        case 4:
          str = '股份合作制企业'
          break
        case 5:
          str = '私营企业'
          break
        case 6:
          str = '合伙企业'
          break
        default:
          break
      }
      return str
    },
    // 修改公司性质
    editCompanyType() {
      this.companyNature = false
      this.companyInfo.companyType = this.dataInfo.companyType
    },
    // 编辑地址
    editAddress() {
      this.addressClick = false
      this.companyInfo.address = this.dataInfo.address
    },
    // 修改网址
    editUrl() {
      this.urlClick = false
      this.companyInfo.url = this.dataInfo.url
    },
    // 修改简介
    editIntroduction() {
      this.introductionClick = false
      this.companyInfo.introduction = this.dataInfo.introduction
    },
    // 保存
    saveCompanyType() {
      updateCompanyMessage(this.companyInfo).then(res => {
        this.$message.success('修改成功')
        this.companyNature = true
        this.addressClick = true
        this.introductionClick = true
        this.urlClick = true
        this.getComInfo()
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
          this.companyInfo.profileAtt = res.data.id
          this.saveCompanyType()
          console.log(res, '--')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-info{
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
			overflow:hidden;
      border-top: 4px solid #f7fbfe;
      .content-main{
        display:flex;
        >.left{
          text-align: center;;
          >.left-img{
            width: 200px;
            height: 200px;
            margin: 0 150px 0 80px;
            text-align: center;
            border: 1px solid #cccccc;
            display:flex;
            justify-content: center;
            align-items:center;
            >img{
              width:100%;
              height:100%;
            }
          }
        }
        >.right{
          flex:1;
          >.row{
            display: flex;
            min-height: 50px;
            // align-items:center;
            >.row-title{
              width: 130px;
              color: #999999;
              font-size: 14px;
            }
            >.row-text{
              flex:1;
              color: #333333;
              font-size: 14px;
              display:flex;
              >.row-img{
                height: 102px;
                width: 102px;
                border: 1px solid #cccccc;
                >img{
                  width:100%;
                  height:100%;
                }
              }

            }

          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.admin-info{
  .row-cont{
    max-width: 550px;
    max-height: 350px;
    img{
      max-width: 500px;
      max-height: 300px;
    }
  }
}

</style>

