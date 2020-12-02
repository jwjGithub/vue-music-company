<!--
 * @Descripttion: 自选库曲库列表
 * @version:
 * @Author: jwj
 * @Date: 2020-10-27 23:36:26
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-02 14:20:39
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">曲库</div>
        </div>
        <div class="right pr30">
          <el-input v-model="queryForm.baseName" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
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
            <el-table-column prop="baseName" min-width="150" label="库名">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">{{ scope.row.baseName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="sort" min-width="150" label="排序"></el-table-column>
            <el-table-column prop="sharingPersonNames" min-width="150" label="分享人"></el-table-column>
            <!-- <el-table-column prop="companyName" min-width="150" label="创建人"></el-table-column> -->
            <el-table-column prop="createdTime" min-width="150" label="创建时间"></el-table-column>
            <!-- <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column> -->
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
              <el-form-item label="自选库名称：" prop="baseName">
                <el-input v-model="form.baseName" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分享人：" prop="selectLists">
                <el-select
                  v-model="form.selectLists"
                  multiple
                  filterable
                  clearable
                  placeholder="输入用户搜索选择"
                  style="width:100%;"
                >
                  <el-option v-for="item in userList" :key="item.userId" :label="item.realname" :value="item.userId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大限制数：" prop="upperLimit">
                <el-input-number v-model="form.upperLimit" controls-position="right" style="width:100%;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input-number v-model="form.sort" controls-position="right" style="width:100%;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="sort">
                <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入" :resize="'none'" style="width:100%;"></el-input>
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
  getUserUnderCom
} from '@/api/songCollection/optionalLibrary/list'
export default {
  name: 'List',
  components: {
  },
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
      userList: [], // 用户列表
      queryForm: {
        baseName: '', // 自选库名称
        optionalType: 1, // 自选库类型 0词 1曲
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
        baseName: [
          { required: true, message: '请输入自选库名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getUserUnderCom()
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
    // 查询用户列表
    getUserUnderCom() {
      getUserUnderCom().then(res => {
        this.userList = res.data || []
      })
    },
    // 打开新增窗口
    openAdd() {
      this.dialogOption = {
        title: '新增自选库',
        show: true,
        loading: false
      }
      this.form = {
        selectLists: [], // 临时数据 多选选择列表
        baseName: '', // 自选库名称
        sharingPersons: '', // 分享人ID，多人用逗号隔开
        remark: '', // 备注
        upperLimit: '', // 最大限制数
        sort: '', // 排序
        optionalType: 1
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      this.dialogOption = {
        title: '编辑自选库',
        show: true,
        loading: false
      }
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
          this.form.sharingPersons = this.form.selectLists.join(',') // sb写法 需要转一次
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
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将' + title + '删除自选库, 是否继续?', '自选库删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let ids = type === 1 ? row.id : this.selectOption.ids.join(',')
        saveDelete({ optionalIds: ids, optionalType: 1 }).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getList()
        })
      }).catch(() => {

      })
    },
    // 打开详情
    openDetails(row) {
      let form = {
        id: row.id,
        realname: row.user && row.user.realname,
        createdTime: row.createdTime,
        updateTime: row.updateTime,
        sharingPersonNames: row.sharingPersonNames,
        remark: row.remark
      }
      console.log(form, 'form')
      let json = {
        title: row.baseName + '-详情',
        form: form
      }
      this.$emit('addTab', json)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page{
  width:100%;
  height:100%;
  >.main-content{
    width:100%;
    height:100%;
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
