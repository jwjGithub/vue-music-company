<template>
  <div class="main-body role-main">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryForm.roleName" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="权限字符" prop="permission">
              <el-input v-model="queryForm.permission" class="w24"></el-input>
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
          <el-button type="warning" class="mr20 mb10" :disabled="selectOption.multiple" @click="normalBatchManegeRole">批量启用</el-button>
          <el-button type="warning" class="mr20 mb10" :disabled="selectOption.multiple" @click="stopBatchManegeRole">批量停用</el-button>
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
            <el-table-column prop="roleName" min-width="150" label="角色名称"></el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'" class="c-darkBlue">{{ scope.row.statusDes }}</span>
                <span v-else class="c-red">{{ scope.row.statusDes }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="permission" min-width="150" label="权限字符"></el-table-column>
            <el-table-column prop="sort" min-width="80" label="排序"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="到期时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
                <el-button v-if="scope.row.status != '0'" size="mini" type="text" class="c-darkBlue" @click="normalManegeRole(scope.row)">启用</el-button>
                <el-button v-else size="mini" type="text" class="c-red" @click="stopManegeRole(scope.row)">停用</el-button>
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
      class="add-role-dialog"
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" :inline="true">
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="form.roleName" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="权限字符：" prop="permission">
            <el-input v-model="form.permission" class="w24"></el-input>
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
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" class="w24"></el-input>
          </el-form-item>
          <div class="role-tree">
            <el-scrollbar class="custom-scrollbar">
              <el-tree
                ref="roleTree"
                :data="treeList"
                node-key="id"
                show-checkbox
                accordion
                default-expand-all
                :expand-on-click-node="true"
              >
                <span slot-scope="{ data }" class="custom-tree-node">
                  <span>{{ data.title }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
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
  getManageMenuSelectTree,
  getInfoById,
  deleteMnageRole,
  stopManegeRole,
  stopBatchManegeRole,
  normalManegeRole,
  normalBatchManegeRole
} from '@/api/system/role'
export default {
  name: 'Role',
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
      treeList: [], // 树列表
      queryForm: {
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        roleName: '', // 角色名称
        permission: '', // 权限字符
        status: '', // 状态 0正常 1停用
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {
        roleName: '', // 角色名称
        remark: '', // 备注
        permission: '', // 权限字符
        sort: '', // 排序
        expiredTime: '', // 过期日期
        status: '', // 	角色状态 0正常 1停用
        menuIds: [] // 菜单ids
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getManageMenuSelectTree()
    this.getDataList()
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
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
    // 获取菜单选择树
    getManageMenuSelectTree() {
      getManageMenuSelectTree().then(res => {
        this.treeList = res.data || []
      })
    },
    // 获取选择的树
    getSelectTree() {
      let treeArr = this.$refs['roleTree'].getCheckedNodes(false, true)
      let arr = []
      treeArr.forEach(item => {
        arr.push(item.id)
      })
      return arr
    },
    // 设置选择的树
    setSelectTree(data) {
      let arr = []
      data.forEach(item => {
        arr.push({ id: item })
      })
      setTimeout(() => {
        this.$refs['roleTree'].setCheckedNodes(arr)
      }, 0)
    },
    // 打开新增窗口
    openAdd() {
      this.dialogOption = {
        title: '新增角色',
        show: true,
        loading: false
      }
      this.form = {
        roleName: '', // 角色名称
        remark: '', // 备注
        permission: '', // 权限字符
        sort: '', // 排序
        expiredTime: '', // 过期日期
        status: 0, // 	角色状态 0正常 1停用
        menuIds: [] // 菜单ids
      }
      this.resetForm('form')
      this.setSelectTree([])
    },
    // 打开编辑窗口
    openEdit(row) {
      this.dialogOption = {
        title: '编辑角色',
        show: true,
        loading: false
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.resetForm('form')
      this.setSelectTree(this.form.menuIds)
    },
    // 保存回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
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
      this.form.menuIds = this.getSelectTree()
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
      this.form.menuIds = this.getSelectTree()
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
      this.$confirm('此操作将' + title + '删除角色, 是否继续?', '角色删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = type === 1 ? [row.id] : this.selectOption.ids
        deleteMnageRole(json, type).then(res => {
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
        this.$confirm('此操作将单个启用角色, 是否继续?', '角色启用', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.dialogNormal.loading = true
          normalManegeRole(this.normalForm).then(res => {
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
        this.$confirm('此操作将批量启用角色, 是否继续?', '角色启用', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.dialogNormal.loading = true
          normalBatchManegeRole(this.normalForm).then(res => {
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
    normalManegeRole(row) {
      // 启用对象
      this.dialogNormal = {
        title: '单个启用',
        show: true,
        loading: false
      }
      this.normalForm = {
        type: 1,
        expiredTime: '',
        id: row.id
      }
    },
    // 打开批量启用
    normalBatchManegeRole() {
      // 启用对象
      this.dialogNormal = {
        title: '批量启用',
        show: true,
        loading: false
      }
      this.normalForm = {
        type: 2,
        expiredTime: '',
        id: this.selectOption.ids
      }
    },
    // 打开停用
    stopManegeRole(row) {
      this.$confirm('此操作将单个停用角色, 是否继续?', '角色停用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        stopManegeRole({ id: row.id }).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    // 打开批量停用
    stopBatchManegeRole() {
      this.$confirm('此操作将批量停用角色, 是否继续?', '角色停用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        stopBatchManegeRole(this.selectOption.ids).then(res => {
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
  .role-main{
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      font-size: 12px;
      padding-right: 8px;
    }
  }
  .role-tree{
    height:300px;
    overflow: hidden;
  }
</style>
<style lang="scss">
  .role-main{
    .add-role-dialog{
      .el-tree{
        >.el-tree-node{
          >.el-tree-node__content{
            background-color:#f5f8fa;
            border: solid 1px #e5e5e5;
            height:50px;
          }
          .el-tree-node__children{
            .el-tree-node__content{
              border-left: solid 1px #e5e5e5;
              border-right: solid 1px #e5e5e5;
              border-bottom: solid 1px #e5e5e5;
              height:35px;
            }
          }
        }
      }
    }
  }
</style>
