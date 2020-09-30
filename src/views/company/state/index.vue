<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="公司名称" prop="com_name">
              <el-input v-model="queryForm.com_name" class="w24"></el-input>
            </el-form-item>
          </div>
          <div class="right-btn">
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="getDataList">
                <i class="el-icon-search"></i>
                <span>搜索</span>
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="realname" min-width="150" label="申请人姓名">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.realname }}
              </template>
            </el-table-column>
            <el-table-column prop="companyName" min-width="150" label="公司名称"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="申请时间">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.createTime }}
              </template>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
              <template slot-scope="scope">
                <template v-if="scope.row.sysUserEntity">
                  <span v-if="scope.row.sysUserEntity.status == 0" class="c-darkBlue">正常</span>
                  <span v-if="scope.row.sysUserEntity.status == 1" class="c-red">作废</span>
                  <span v-if="scope.row.sysUserEntity.status == 2" class="c-darkBlue">审核中</span>
                  <span v-if="scope.row.sysUserEntity.status == 3" class="c-red">退回</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <pagination
        v-show="total>0"
        :total="Number(total)"
        :page.sync="queryForm.page"
        :limit.sync="queryForm.limit"
        @pagination="getDataList"
      />
    </div>
    <!-- 新增/修改 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :is-show-ok="false"
      :is-show-close="false"
      :width="'800px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
          <el-form-item class="mb1" label="用户名：" prop="username">
            <div class="w24">{{ form.username }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="邮箱：" prop="email">
            <div class="w24">{{ form.email }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="手机号：" prop="mobile">
            <div class="w24">{{ form.mobile }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="用户姓名：" prop="realname">
            <div class="w24">{{ form.realname }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="性别：" prop="gender">
            <div class="w24">{{ form.gender == 'male' ? '男' : (form.gender == 'female' ? '女' : '未知') }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="公司名：" prop="companyName">
            <div class="w24">{{ form.companyName }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="地址：" prop="address">
            <div class="w24">{{ form.address }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="公司介绍：" prop="introduction">
            <div class="w24">{{ form.introduction }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="状态：" prop="status">
            <div class="w24">
              <span v-if="form.status == 0" class="c-darkBlue">正常</span>
              <span v-if="form.status == 1" class="c-red">作废</span>
              <span v-if="form.status == 2" class="c-darkBlue">审核中</span>
              <span v-if="form.status == 3" class="c-red">退回</span>
            </div>
          </el-form-item>
          <!-- <el-row v-if="form.status == 2">
            <el-col :span="24">
              <el-form-item label="备注：" prop="auditRemarks">
                <el-input v-model="form.auditRemarks" style="width:600px;" type="textarea" :rows="4" :resize="'none'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label=" ">
                <el-button type="primary" class="w14 mt24 mr24" @click="handleConfirm(1)">通过</el-button>
                <el-button type="danger" class="w14 mt24 mr24" @click="handleConfirm(2)">作废</el-button>
                <el-button type="warning" class="w14 mt24" @click="handleConfirm(3)">驳回</el-button>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getDataList,
  saveAdd
} from '@/api/company/review'
export default {
  name: 'Review',
  data() {
    return {
      total: 0,
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      queryForm: {
        com_name: '', // 公司名称
        status: '0,1,2,3', // 审核状态，0正常，1作废，2审核中，3退回，多种状态传 1,2
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {
        phoneCode: '', // 手机验证码
        emailCode: '', // 邮箱验证码
        username: '', // 用户名
        email: '', // 邮箱
        mobile: '', // 手机号
        realname: '', // 真名
        gender: '', //  性别 male 男 female 女 unknown 未知
        companyName: '', // 公司名
        address: '', // 地址
        introduction: '', // 公司介绍
        file: '' // 公司附件
      },
      rules: {
        // username: [
        //   { required: true, message: '请输入用户名', trigger: 'blur' }
        // ],
        // mobile: [
        //   { required: true, message: '请输入手机号', trigger: 'blur' }
        // ],
        // phoneCode: [
        //   { required: true, message: '请输入手机验证码', trigger: 'blur' }
        // ],
        // userType: [
        //   { required: true, message: '请选择用户类型', trigger: ['blur', 'change'] }
        // ],
        // status: [
        //   { required: true, message: '请选择用户状态', trigger: ['blur', 'change'] }
        // ],
        // gender: [
        //   { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
        // ],
        // userManageroleId: [
        //   { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        // ]
      }

    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 查询列表
    getDataList() {
      this.loading = true
      getDataList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 打开详情接口
    openDetails(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
      let json = row.sysUserEntity || {}
      this.form = {
        status: json.status,
        userId: json.userId,
        username: json.username, // 用户名
        email: json.email, // 邮箱
        mobile: json.mobile, // 手机号
        realname: json.realname, // 真名
        gender: json.gender, //  性别 male 男 female 女 unknown 未知
        companyName: row.companyName, // 公司名
        address: row.address, // 地址
        introduction: row.introduction, // 公司介绍
        auditRemarks: row.auditRemarks // 备注
      }
      console.log(row, this.form)
      this.resetForm('form')
    },
    // 保存回调 1通过 2作废 3驳回
    handleConfirm(type) {
      let json = {
        status: 0,
        user_id: this.form.userId,
        mobile: this.form.mobile,
        auditRemarks: this.form.auditRemarks
      }
      let title = ''
      let message = ''
      if (type === 1) {
        json.status = 0
        title = '申请通过'
        message = '此操作将通过当前申请, 是否继续?'
      }
      if (type === 2) {
        json.status = 1
        title = '申请作废'
        message = '此操作将作废当前申请, 是否继续?'
      }
      if (type === 3) {
        json.status = 3
        title = '申请驳回'
        message = '此操作将驳回当前申请, 是否继续?'
      }
      this.$confirm(message, title, {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.dialogOption.loading = true
        saveAdd(json).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
          this.dialogOption.show = false
          this.dialogOption.loading = false
        }).catch(() => {
          this.dialogOption.loading = false
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
