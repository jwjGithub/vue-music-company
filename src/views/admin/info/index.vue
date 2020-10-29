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
      <div class="content ptx28">
        <div class="left">
          <div class="left-img pt50">
            <img src="@/assets/images/admin/icon_company.png">
          </div>
          <div class="left-title mt22">
            <img src="@/assets/images/admin/icon_edit.png">
            <span class="ml8">替换公司标志</span>
          </div>
        </div>
        <div class="right mlx42">
          <div class="row">
            <p class="row-title">公司名称</p>
            <p class="row-text">{{ dataInfo.companyName }}</p>
          </div>
          <div class="row">
            <p class="row-title">注册日期</p>
            <p class="row-text">{{ dataInfo.sysUserEntity && dataInfo.sysUserEntity.createTime }}</p>
          </div>
          <div class="row">
            <p class="row-title">公司性质</p>
            <p class="row-text">
              <span class="mr12">{{ setCompanyType(dataInfo.companyType) }}</span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">地址</p>
            <p class="row-text">
              <span class="mr12">{{ dataInfo.address }}</span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">简介</p>
            <p class="row-text">
              <span class="mr12" v-html="dataInfo.introduction"></span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">网址</p>
            <p class="row-text">
              <span class="mr12">{{ dataInfo.url }}</span>
              <img src="@/assets/images/admin/icon_edit.png">
            </p>
          </div>
          <div class="row">
            <p class="row-title">营业执照</p>
            <p class="row-text row-img">
              <img :src="dataInfo.lisence && dataInfo.lisence.url || '@/assets/images/admin/business_license.png'">
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getComInfo
} from '@/api/admin/account'
export default {
  name: 'AdminAccount',
  components: {
  },
  data() {
    return {
      total: 0,
      loading: false,
      dataInfo: {}
    }
  },
  created() {
    this.getComInfo()
  },
  methods: {
    getComInfo() {
      getComInfo().then(res => {
        this.dataInfo = res.data || {}
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
          text-align: center;
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
</style>
<style lang="scss">
</style>

