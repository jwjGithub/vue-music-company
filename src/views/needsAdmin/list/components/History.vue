<template>
  <div class="main-page">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">历史需求</div>
        </div>
        <div class="right pr30">
          <el-input v-model="queryForm.title" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
          <el-button type="primary" size="mini" class="ml10 mrx45" :loading="loading" @click="getList">查询</el-button>
          <!-- <el-button type="primary" size="mini" @click="openAdd">创建</el-button> -->
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
            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
            <el-table-column prop="title" min-width="200" label="名称">
              <!-- <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">{{ scope.row.baseName }}</el-button>
              </template> -->
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" class="c-darkBlue">正常</span>
                <span v-if="scope.row.status === 1">草稿</span>
                <span v-if="scope.row.status === 2" class="c-red">关闭</span>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" min-width="120" label="创建人"></el-table-column>
            <el-table-column prop="createdTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="contributionNum" min-width="100" label="投稿数"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="截止日期"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status === 0" size="mini" type="text" @click="openEdit(scope.row)">修改截止日期</el-button>
                <el-button v-if="scope.row.status === 0" size="mini" type="text" class="c-red" @click="openZuoFei(scope.row)">关闭</el-button>
                <el-button v-if="scope.row.status === 1" size="mini" type="text" @click="openEditPage(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.status === 2" size="mini" type="text" @click="openFaBu(scope.row)">重新发布</el-button>
                <el-button size="mini" type="text" class="c-red" @click="openDelete(1,scope.row)">删除</el-button>
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
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'600px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="截止时间：" prop="expiredTime">
                <el-date-picker
                  v-model="form.expiredTime"
                  style="width:100%;"
                  type="datetime"
                  placeholder="请选择"
                  default-time="23:59:59"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
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
  saveEdit,
  saveDelete
} from '@/api/needsAdmin/releaseNeed'
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
        title: '',
        nowOrHistory: 'history', //
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
        expiredTime: [
          { required: true, message: '请选择截止日期', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getList()
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
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
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
        sort: '' // 排序
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      this.dialogOption = {
        title: '修改截止日期',
        show: true,
        loading: false
      }
      // this.form = JSON.parse(JSON.stringify(row))
      this.form = {
        id: row.id,
        expiredTime: row.expiredTime
      }
      this.resetForm('form')
    },
    // 修改
    openEditPage(row) {
      this.$router.push({ name: 'needsAdminReleaseNeed', params: JSON.parse(JSON.stringify(row)) })
    },
    // 重新发布
    openFaBu(row) {
      this.dialogOption = {
        title: '重新发布',
        show: true,
        loading: false
      }
      // this.form = JSON.parse(JSON.stringify(row))
      this.form = {
        id: row.id,
        status: 0,
        expiredTime: row.expiredTime
      }
      this.resetForm('form')
    },
    // 保存回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
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
        } else {
          return false
        }
      })
    },
    // 打开作废 type:1 单个 type:2 批量
    openZuoFei(row) {
      this.$confirm('此操作将关闭需求, 是否继续?', '需求关闭', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        saveEdit({ status: 2, id: row.id }).then(res => {
          this.$notify.success('操作成功')
          this.getList()
        })
      }).catch(() => {

      })
    },
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将' + title + '删除需求, 是否继续?', '需求删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let ids = type === 1 ? row.id : this.selectOption.ids.join(',')
        saveDelete(ids).then(res => {
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
