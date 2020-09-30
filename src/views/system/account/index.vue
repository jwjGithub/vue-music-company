<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="queryForm.username" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="queryForm.mobile" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option :value="0" label="正常" />
                <el-option :value="1" label="停用" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="status">
              <el-date-picker
                v-model="timeList"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="开始时间" prop="starttime">
              <el-date-picker
                v-model="queryForm.starttime"
                class="w24"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endtime">
              <el-date-picker
                v-model="queryForm.endtime"
                class="w24"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item> -->
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
      <el-row class="pt20 pb10">
        <el-col :span="24">
          <el-button type="primary" class="mr20 mb10" @click="openAdd">新增</el-button>
          <el-button type="warning" class="mr20 mb10" :disabled="selectOption.multiple" @click="normalBatchAdmin">批量启用</el-button>
          <el-button type="warning" class="mr20 mb10" :disabled="selectOption.multiple" @click="stopBatchAdmin">批量停用</el-button>
          <el-button type="danger" class="mr20 mb10" :disabled="selectOption.multiple" @click="openDelete(2,null)">批量删除</el-button>
        </el-col>
      </el-row>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="realname" min-width="150" label="姓名"></el-table-column>
            <el-table-column prop="status" min-width="80" label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.gender == 'MALE'" class="c-darkBlue">男</span>
                <span v-else-if="scope.row.gender == 'FEMALE'" class="c-red">女</span>
                <span v-else class="c-red">未知</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="userId" min-width="120" label="编号"></el-table-column> -->
            <el-table-column prop="username" min-width="120" label="账号"></el-table-column>
            <!-- <el-table-column prop="password" min-width="120" label="密码"></el-table-column> -->
            <el-table-column prop="status" min-width="80" label="账号状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'" class="c-darkBlue">{{ scope.row.statusDes }}</span>
                <span v-else class="c-red">{{ scope.row.statusDes }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" min-width="120" label="手机"></el-table-column>
            <el-table-column prop="email" min-width="180" label="邮箱"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="账号到期时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
                <el-button v-if="scope.row.status != '0'" size="mini" type="text" class="c-darkBlue" @click="normalAdmin(scope.row)">启用</el-button>
                <el-button v-else size="mini" type="text" class="c-red" @click="stopAdmin(scope.row)">停用</el-button>
                <el-button size="mini" type="text" class="c-red" @click="openDelete(1, scope.row)">删除</el-button>
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
      :width="'860px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" :inline="true">
          <el-form-item label="用户名称：" prop="username">
            <el-input v-model="form.username" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="登录密码：" prop="password">
            <el-input v-model="form.password" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="form.email" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input v-model="form.mobile" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <div class="w24">
              <el-radio v-model="form.status" :label="0">正常</el-radio>
              <el-radio v-model="form.status" :label="1">无效</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="form.sort" class="w24" controls-position="right" :min="1" :max="999999"></el-input-number>
          </el-form-item>
          <el-form-item label="用户姓名：" prop="realname">
            <el-input v-model="form.realname" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="用户类型：" prop="userType">
            <el-select v-model="form.userType" clearable placeholder="" class="w24">
              <el-option label="超级管理员" :value="0" />
              <el-option label="管理员" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-select v-model="form.gender" clearable placeholder="" class="w24">
              <el-option label="男" value="MALE" />
              <el-option label="女" value="FEMALE" />
              <el-option label="未知" value="UNKNOW" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户角色：" prop="userManageroleId">
            <el-select v-model="form.userManageroleId" filterable clearable placeholder="" class="w24">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="过期时间：" prop="expiredTime">
            <el-date-picker
              v-model="form.expiredTime"
              class="w24"
              type="datetime"
              placeholder="请选择"
              default-time="23:59:59"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </mus-dialog>
    <!-- 启用 弹窗 -->
    <mus-dialog
      :title="dialogNormal.title"
      :loading="dialogNormal.loading"
      :is-show="dialogNormal.show"
      :width="'480px'"
      @handleClose="dialogNormal.show = false"
      @handleConfirm="normalConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="normalForm" :model="normalForm" label-width="130px" :inline="true" style="text-align:center;">
          <el-form-item label="过期时间：" prop="expiredTime">
            <el-date-picker
              v-model="normalForm.expiredTime"
              class="w24"
              type="datetime"
              placeholder="请选择"
              default-time="23:59:59"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getDataList,
  saveAdd,
  saveEdit,
  getSelectList,
  getInfoById,
  deleteUser,
  stopAdmin,
  stopBatchAdmin,
  normalAdmin,
  normalBatchAdmin
} from '@/api/system/account'
export default {
  name: 'Account',
  data() {
    return {
      total: 0,
      // 选择对象
      selectOption: {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true
      },
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      // 启用对象
      dialogNormal: {
        title: '',
        show: false,
        loading: false
      },
      // 启用表单
      normalForm: {
        type: '', // 1单个 2批量
        expiredTime: '' // 过期日期
      },
      tabs: '',
      timeList: [],
      loading: false,
      dataList: [],
      roleList: [], // 角色列表
      queryForm: {
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        username: '', // 用户名称
        mobile: '', // 手机号
        status: '', // 用户状态 0正常 1停用
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {
        username: '', // 用户名称
        password: '', // 登陆密码
        email: '', // 邮箱
        mobile: '', // 手机
        status: '', // 数据状态 0.正常 1 无效 -1删除
        sort: '', // 排序
        realname: '', // 用户姓名
        userType: '', // 用户类型 0超级管理员给/1管理员
        gender: '', // 性别(MALE男/FEMALE女/UNKNOW未知)
        userManageroleId: '', // 后台用户管理员角色id
        expiredTime: '' // 过期日期
      },
      rules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: ['blur', 'change'] }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
        ],
        userManageroleId: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  created() {
    this.getSelectList()
    this.getDataList()
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.userId)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 查询列表
    getDataList() {
      this.loading = true
      this.queryForm.starttime = this.timeList && this.timeList[0]
      this.queryForm.endtime = this.timeList && this.timeList[1]
      getDataList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 查询角色列表
    getSelectList() {
      getSelectList().then(res => {
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
        username: '', // 用户名称
        password: '', // 登陆密码
        email: '', // 邮箱
        mobile: '', // 手机
        status: 0, // 数据状态 0.正常 1 无效 -1删除
        sort: '', // 排序
        realname: '', // 用户姓名
        userType: '', // 用户类型 0超级管理员给/1管理员
        gender: '', // 性别(MALE男/FEMALE女/UNKNOW未知)
        userManageroleId: '', // 后台用户管理员角色id
        expiredTime: '' // 过期日期
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
      this.form = JSON.parse(JSON.stringify(row))
      this.resetForm('form')
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
    // 新增保存
    saveAdd() {
      this.dialogOption.loading = true
      saveAdd(this.form).then(res => {
        this.$notify.success({
          title: '保存成功'
        })
        this.getDataList()
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
        this.getDataList()
        this.dialogOption.show = false
        this.dialogOption.loading = false
      }).catch(e => {
        this.dialogOption.loading = false
      })
    },
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将' + title + '删除账号, 是否继续?', '账号删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = type === 1 ? [row.userId] : this.selectOption.ids
        deleteUser(json, type).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    // 启用保存
    normalConfirm() {
      if (this.normalForm.type === 1) {
        this.$confirm('此操作将单个启用账号, 是否继续?', '账号启用', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.dialogNormal.loading = true
          normalAdmin(this.normalForm).then(res => {
            this.$notify.success({
              title: '操作成功'
            })
            this.getDataList()
            this.dialogNormal.show = false
            this.dialogNormal.loading = false
          }).catch(() => {
            this.dialogNormal.loading = false
          })
        }).catch(() => {

        })
      } else {
        this.$confirm('此操作将批量启用账号, 是否继续?', '账号启用', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.dialogNormal.loading = true
          normalBatchAdmin(this.normalForm).then(res => {
            this.$notify.success({
              title: '操作成功'
            })
            this.getDataList()
            this.dialogNormal.show = false
            this.dialogNormal.loading = false
          }).catch(() => {
            this.dialogNormal.loading = false
          })
        }).catch(() => {

        })
      }
    },
    // 打开启用
    normalAdmin(row) {
      // 启用对象
      this.dialogNormal = {
        title: '单个启用',
        show: true,
        loading: false
      }
      this.normalForm = {
        type: 1,
        expiredTime: '',
        userId: row.userId
      }
    },
    // 打开批量启用
    normalBatchAdmin() {
      // 启用对象
      this.dialogNormal = {
        title: '批量启用',
        show: true,
        loading: false
      }
      this.normalForm = {
        type: 2,
        expiredTime: '',
        userId: this.selectOption.ids
      }
    },
    // 打开停用
    stopAdmin(row) {
      this.$confirm('此操作将单个停用账号, 是否继续?', '账号停用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        stopAdmin({ userId: row.userId }).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    // 打开批量停用
    stopBatchAdmin() {
      this.$confirm('此操作将批量停用账号, 是否继续?', '账号停用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        stopBatchAdmin(this.selectOption.ids).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
