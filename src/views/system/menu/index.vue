<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="菜单名称" prop="username">
              <el-input v-model="queryForm.username" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="NORMAL" label="正常" />
                <el-option value="STOP" label="停用" />
              </el-select>
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
      <el-row class="pt20 pb10">
        <el-col :span="24">
          <el-button type="primary" class="mr20 mb10" @click="openAdd(null)">新增</el-button>
        </el-col>
      </el-row>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="title" min-width="150" label="菜单名称"></el-table-column>
            <el-table-column prop="icon" min-width="80" label="图标">
              <template slot-scope="scope">
                <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
              </template>
            </el-table-column>
            <el-table-column prop="sort" min-width="120" label="排序"></el-table-column>
            <el-table-column prop="component" min-width="180" label="组件路径"></el-table-column>
            <el-table-column prop="statusDes" min-width="180" label="状态"></el-table-column>
            <el-table-column prop="isHidden" min-width="180" label="是否隐藏">
              <template slot-scope="scope">
                <span v-if="scope.row.isHidden == 'Y'" class="c-red">隐藏</span>
                <span v-else class="c-darkBlue">显示</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
                <el-button size="mini" type="text" @click="openAdd(scope.row)">新增</el-button>
                <el-button v-if="scope.row.status != 'NORMAL'" size="mini" type="text" class="c-darkBlue" @click="normalManageMenu(scope.row)">启用</el-button>
                <el-button v-else size="mini" type="text" class="c-red" @click="stopManageMenu(scope.row)">停用</el-button>
                <el-button size="mini" type="text" class="c-red" @click="openDelete(1, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级菜单：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  class="lh20"
                  :no-results-text="'未搜索到数据'"
                  :no-options-text="'暂无数据'"
                  :no-children-text="'没有子级'"
                  :options="treeList"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择上级菜单"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单类型：" prop="type">
                <el-radio v-model="form.type" label="CONTENTS">目录</el-radio>
                <el-radio v-model="form.type" label="MENU ">菜单</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单图标">
                <el-popover
                  placement="bottom-start"
                  width="460"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selectedIcon" />
                  <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                    <svg-icon
                      v-if="form.icon"
                      slot="prefix"
                      :icon-class="form.icon"
                      class="el-input__icon"
                      style="height: 32px;width: 16px;"
                    />
                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  </el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称：" prop="title">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由名称：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序：" prop="sort">
                <el-input-number v-model="form.sort" style="width:100%;" controls-position="right" :min="1" :max="999999"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由地址：" prop="path">
                <el-input v-model="form.path"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件路径：" prop="component">
                <el-input v-model="form.component"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示状态：" prop="isHidden">
                <div class="w24">
                  <el-radio v-model="form.isHidden" label="N">显示</el-radio>
                  <el-radio v-model="form.isHidden" label="Y">隐藏</el-radio>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单状态：" prop="status">
                <div class="w24">
                  <el-radio v-model="form.status" label="NORMAL">正常</el-radio>
                  <el-radio v-model="form.status" label="STOP">停用</el-radio>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否外链：" prop="isExlink">
                <div class="w24">
                  <el-radio v-model="form.isExlink" label="Y">是</el-radio>
                  <el-radio v-model="form.isExlink" label="N">否</el-radio>
                </div>
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
  getDataList,
  saveAdd,
  saveEdit,
  getManageMenuSelectTree,
  getInfoById,
  deleteManageMenu,
  stopManageMenu,
  normalManageMenu
} from '@/api/system/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
export default {
  name: 'Menu',
  components: {
    Treeselect,
    IconSelect
  },
  data() {
    return {
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      treeList: [], // 角色列表
      queryForm: {
        title: '', // 菜单名称
        status: '' // 状态 NORMAL正常 STOP停用 DELETE删除
      },
      form: {
        isExlink: '', // 是否外链
        icon: '', // 图标
        sort: '', // 排序
        title: '', // 菜单标题
        type: '', // 菜单类型
        parentId: '', // 父级菜单id
        isHidden: '', // 是否隐藏
        path: '', // 路由地址
        parentName: '', // 父级菜单名称
        component: '', // 组件路径
        createTime: '', // 创建时间
        name: '', // 路由名称
        status: '' // 菜单状态
      },
      rules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件路径', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 选择图标
    selectedIcon(name) {
      this.form.icon = name
    },
    // 查询列表
    getDataList() {
      this.loading = true
      getDataList(this.queryForm).then(res => {
        this.dataList = this.handleTree(res.data, 'id')
        console.log(this.dataList, res)
        this.loading = false
      })
    },
    // 查询菜单列表树
    getManageMenuSelectTree() {
      getManageMenuSelectTree().then(res => {
        this.treeList = []
        const menu = { id: 0, title: '主类目', children: [] }
        menu.children = res.data || []
        this.treeList.push(menu)
        // this.treeList = res.data
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children === null || (node.children && !node.children.length)) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    // 打开新增窗口
    openAdd(row) {
      this.getManageMenuSelectTree()
      this.dialogOption = {
        title: '新增菜单',
        show: true,
        loading: false
      }
      this.form = {
        isExlink: 'N', // 是否外链
        icon: '', // 图标
        sort: '', // 排序
        title: '', // 菜单标题
        type: 'CONTENTS', // 菜单类型
        parentId: 0, // 父级菜单id
        isHidden: 'N', // 是否隐藏
        path: '', // 路由地址
        parentName: '', // 父级菜单名称
        component: '', // 组件路径
        name: '', // 路由名称
        status: 'NORMAL' // 菜单状态
      }
      if (row != null) {
        this.form.parentId = row.id
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      row.parentId = row.parentId === 0 ? null : row.parentId
      this.getManageMenuSelectTree()
      this.dialogOption = {
        title: '编辑菜单',
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
      // let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将删除菜单, 是否继续?', '菜单删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = type === 1 ? [row.id] : this.selectOption.ids
        deleteManageMenu(json, type).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    // 启用保存
    normalManageMenu(row) {
      this.$confirm('此操作将启用菜单, 是否继续?', '菜单启用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        normalManageMenu({ id: row.id }).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        }).catch(() => {
        })
      }).catch(() => {

      })
    },
    // 打开停用
    stopManageMenu(row) {
      this.$confirm('此操作将单个停用菜单, 是否继续?', '菜单停用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        stopManageMenu({ id: row.id }).then(res => {
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
