<template>
  <div class="main-page role-main">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">菜单权限分配</div>
        </div>
        <div class="right pr30">
          <el-input v-model="queryForm.roleName" class="search-input w20 mr10" size="mini" placeholder="请输入角色名称" @keyup.enter.native="getList"></el-input>
          <el-select v-model="queryForm.status" clearable placeholder="请选择状态" size="mini" class="search-input w20" @change="getList">
            <el-option value="" label="全部" />
            <el-option :value="0" label="正常" />
            <el-option :value="1" label="停用" />
          </el-select>
          <el-button type="primary" size="mini" class="ml10 mrx45" :loading="loading" @click="getList">查询</el-button>
          <el-button type="primary" size="mini" @click="openAdd">创建</el-button>
          <el-button size="mini" type="primary" class="ml20" :disabled="selectOption.multiple" @click="openChangeStatus(2,0,null)">启用</el-button>
          <el-button size="mini" type="primary" class="ml20" :disabled="selectOption.multiple" @click="openChangeStatus(2,1,null)">停用</el-button>
          <el-button size="mini" class="ml20" :disabled="selectOption.multiple" @click="openChangeStatus(2,-1,null)">删除</el-button>
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
            <el-table-column prop="roleName" min-width="150" label="角色名称"></el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'" class="c-darkBlue">启用</span>
                <span v-else class="c-red">停用</span>
              </template>
            </el-table-column>
            <el-table-column prop="sort" min-width="80" label="排序"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="到期时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">编辑</el-button>
                <!-- <el-button size="mini" type="text" @click="openChangeStatus(1,-1,scope.row)">删除</el-button> -->
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
      class="add-role-dialog"
      :title="dialogOption.title"
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
              <el-form-item label="角色名称：" prop="roleName">
                <el-input v-model="form.roleName" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <div>
                  <el-radio v-model="form.status" :label="0">正常</el-radio>
                  <el-radio v-model="form.status" :label="1">无效</el-radio>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input-number v-model="form.sort" style="width:100%;" controls-position="right" :min="1" :max="999999"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="过期时间：" prop="expiredTime">
                <el-date-picker
                  v-model="form.expiredTime"
                  style="width:100%;"
                  type="datetime"
                  placeholder="请选择"
                  default-time="23:59:59"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input v-model="form.remark" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
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
  saveChangeStatus,
  getTreeList,
  getInfo
} from '@/api/admin/role'
export default {
  name: 'AdminLowerAccountRole',
  components: {},
  data() {
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
      loading: false,
      dataList: [],
      treeList: [], // 树列表
      queryForm: {
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        roleName: '', // 角色名称
        status: '', // 角色状态 0正常 1停用
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
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        expiredTime: [
          { required: true, message: '请选择过期时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getTreeList()
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
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
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取菜单选择树
    getTreeList() {
      getTreeList().then(res => {
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
      return arr.join(',')
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
      getInfo(row.id).then(res => {
        this.form = res.data || {}
        this.resetForm('form')
        this.setSelectTree(this.form.menuIds)
      })
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
      this.form.menuIds = this.getSelectTree()
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
    // 打开修改状态 type:1 单个 type:2 批量 	status角色状态 -1删除 0正常 1停用
    openChangeStatus(type, status, row) {
      let title = type === 1 ? '单个' : '批量'
      let statusDesc = status === -1 ? '删除' : (status === 0 ? '启用' : '停用')
      this.$confirm(`此操作将${title}${statusDesc}账号, 是否继续?`, statusDesc, {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let ids = type === 1 ? row.id : this.selectOption.ids.join(',')
        let json = {
          roleIds: ids,
          status: status
        }
        saveChangeStatus(json).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page{
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
