<template>
  <div class="main-page admin-infoSet">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">业务人员账号管理</div>
        </div>
        <div class="right pr30">
          <el-input v-model="queryForm.username" class="search-input w20 mr10" size="mini" placeholder="请输入账号" @keyup.enter.native="getList"></el-input>
          <el-input v-model="queryForm.realName" class="search-input w20" size="mini" placeholder="请输入姓名" @keyup.enter.native="getList"></el-input>
          <el-button type="primary" size="mini" class="ml10 mrx45" :loading="loading" @click="getList">查询</el-button>
          <el-button type="primary" size="mini" @click="openAdd">创建</el-button>
          <el-button size="mini" class="ml20" :disabled="selectOption.multiple" @click="openDelete(2,null)">删除</el-button>
        </div>
      </div>
      <div class="content">
        <el-scrollbar class="custom-scrollbar">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="username" min-width="150" label="用户名"></el-table-column>
            <el-table-column prop="realname" min-width="150" label="姓名"></el-table-column>
            <el-table-column prop="mobile" min-width="150" label="手机号"></el-table-column>
            <el-table-column prop="email" min-width="150" label="邮箱"></el-table-column>
            <el-table-column prop="label" min-width="150" label="标签"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="Number(total)"
            :page.sync="queryForm.page"
            :limit.sync="queryForm.limit"
            @pagination="getList"
          />
        </el-scrollbar>
      </div>
    </div>
    <!-- 新增/修改 弹窗 -->
    <mus-dialog
      :title="dialogOption.title + '(可新增业务人员账号数：'+ userNumLimit +')'"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名：" prop="username">
                <el-input v-model="form.username" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="realname">
                <el-input v-model="form.realname" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="!form.userId" :span="12">
              <el-form-item label="密码：" prop="password">
                <el-input v-model="form.password" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-else :span="12">
              <el-form-item label="密码：">
                <el-input v-model="form.password" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="form.mobile" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="form.email" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标签：">
                <el-input v-model="form.label" style="width:100%;" placeholder="请输入标签，多个用逗号隔开"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色：">
                <el-select
                  v-model="form.userCompanyroleId"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width:100%;"
                >
                  <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
                </el-select>
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
  getList,
  saveAdd,
  saveEdit,
  saveDelete,
  getCompanyRoleList
} from '@/api/admin/lowerAccount'
export default {
  name: 'List',
  components: {},
  data() {
    let validatePhone = (rule, value, callback) => {
      let reg = /^1[0-9]{10}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    let validateEmail = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    return {
      // 选择对象
      selectOption: {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true
      },
      total: 0,
      userNumLimit: 0,
      loading: false,
      dataList: [],
      roleList: [], // 角色列表
      queryForm: {
        username: '', // 账号
        realName: '', // 姓名
        page: 1, // 当前页
        limit: 20 // 每页条数
      },
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      form: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getCompanyRoleList()
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.userId)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 查询列表
    getList() {
      this.loading = true
      getList(this.queryForm).then(res => {
        console.log(this.queryForm)
        this.dataList = res.data || []
        this.total = res.count || 0
        this.userNumLimit = res.userNumLimit || 0 // 可新增业务人员账号数
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询角色列表
    getCompanyRoleList() {
      getCompanyRoleList().then(res => {
        this.roleList = res.data || []
      })
    },
    // 打开新增窗口
    openAdd() {
      this.dialogOption = {
        title: '新增账号',
        show: true,
        loading: false
      }
      this.form = {
        userCompanyroleId: '', // 角色id
        username: '', // 用户名
        realname: '', // 姓名
        password: '', // 密码
        mobile: '', // 手机号
        email: '', // 邮箱
        label: '' // 标签
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      this.dialogOption = {
        title: '编辑账号',
        show: true,
        loading: false
      }
      row.password = ''
      this.form = JSON.parse(JSON.stringify(row))
      this.resetForm('form')
    },
    // 新增保存
    saveAdd() {
      this.dialogOption.loading = true
      saveAdd(this.form).then(res => {
        this.$notify.success({
          title: '保存成功'
        })
        this.getList()
        this.dialogOption.show = false
        this.dialogOption.loading = false
      }).catch(e => {
        this.dialogOption.loading = false
      })
    },
    // 编辑保存
    saveEdit() {
      this.dialogOption.loading = true
      saveEdit(this.form).then(res => {
        this.$notify.success({
          title: '保存成功'
        })
        this.getList()
        this.dialogOption.show = false
        this.dialogOption.loading = false
      }).catch(e => {
        this.dialogOption.loading = false
      })
    },
    // 保存回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.userId) {
            this.saveEdit()
          } else {
            this.saveAdd()
          }
        } else {
          return false
        }
      })
    },
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将' + title + '删除账号, 是否继续?', '自选库删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let ids = type === 1 ? row.userId : this.selectOption.ids.join(',')
        saveDelete(ids).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getList()
        })
      }).catch(() => {

      })
    }
    // 打开详情
    // openDetails(row) {
    //   let form = {
    //     id: row.id,
    //     realname: row.user && row.user.realname,
    //     createdTime: row.createdTime,
    //     updateTime: row.updateTime,
    //     sharingPersonNames: row.sharingPersonNames,
    //     remark: row.remark
    //   }
    //   console.log(form, 'form')
    //   let json = {
    //     title: row.baseName + '-详情',
    //     form: form
    //   }
    //   this.$emit('addTab', json)
    // }
  }
}
</script>

<style lang="scss" scoped>
.admin-infoSet{
  width:100%;
  height:100%;
  padding: 10px;
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
      >.right{
        display: flex;
        align-items:center;
        .search-input{
          ::v-deep .el-input__inner{
            background-color:#f8f8f8;
          }
        }
      }
    }
    >.content{
      flex:1;
      overflow: hidden;
      >.lists{
        width:100%;
        height:100%;
      }
    }
  }
}
</style>
