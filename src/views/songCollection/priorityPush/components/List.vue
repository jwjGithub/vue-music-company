<!--
 * @Descripttion: 优先推送列表
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 21:01:42
 * @LastEditors: JWJ
 * @LastEditTime: 2021-02-04 16:52:29
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">优先推送作者</div>
        </div>
        <div class="right pr30">
          <!-- <el-input v-model="queryForm.title" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input> -->
          <el-button type="primary" size="mini" class="ml10" :loading="loading" @click="openAdd">添加作者</el-button>
        </div>
      </div>
      <div class="content">
        <el-scrollbar class="custom-scrollbar">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
          >
            <el-table-column width="80" label="序号">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column min-width="150" label="作者">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">{{ scope.row.realName }}({{ scope.row.stageName }})</el-button>
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="工种">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.professionDesArray) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sumPostNum" min-width="150" label="总推送作品数"></el-table-column>
            <el-table-column prop="postedNum" min-width="150" label="已推送作品数"></el-table-column>
            <el-table-column prop="leftNum" min-width="150" label="剩余推送作品数"></el-table-column>
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
    <!-- 添加作者 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'500px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="authorForm" :model="authorForm" :rules="rules" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="选择作者：" prop="authors">
                <el-select
                  v-model="authorForm.authors"
                  filterable
                  clearable
                  multiple
                  remote
                  placeholder="请选择作者"
                  style="width:100%;"
                >
                  <!--
                   :remote-method="searchAuthorsList"
                  :loading="authorsLoading"
                 -->
                  <el-option v-for="(item,index) in authorList" :key="index" :label="item.des" :value="item.userId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="推送数量：" prop="size">
                <el-input-number v-model="authorForm.size" style="width:100%;" controls-position="right" :min="1" :max="999999"></el-input-number>
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
  queryAuthorSelect,
  saveAuthor,
  querySet
//   saveDelete,
//   getUserUnderCom
} from '@/api/songCollection/priorityPush/list'
export default {
  name: 'List',
  components: {
  },
  data() {
    return {
      total: 0,
      loading: false,
      dataList: [],
      queryForm: {
        optionalType: '', // 0词 1曲
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
      authorList: [], // 作者列表
      authorsLoading: false,
      authorForm: {
        authors: [],
        size: 1
      },
      rules: {
        authors: [
          { required: true, message: '请选择作者', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    // 设置作者
    setComposers(row) {
      let arr = []
      row && row.forEach(item => {
        if (item) {
          arr.push(item)
        }
      })
      return arr.join(',')
    },
    // 打开详情
    openDetails(row) {
      let form = {
        userId: row.userId,
        name: `${row.realName || ''}(${row.stageName})`,
        leftNum: row.leftNum
        // updateTime: row.updateTime,
        // sharingPersonNames: row.sharingPersonNames,
        // remark: row.remark
      }
      console.log(form, 'form')
      let json = {
        title: `${row.realName || ''}(${row.stageName})`,
        form: form
      }
      this.$emit('addTab', json)
    },
    // 作者下拉框
    queryAuthorSelect(val) {
      queryAuthorSelect({ stageName: val, limit: '999' }).then(res => {
        this.authorsLoading = false
        this.authorList = res.data || []
      }).catch(() => {
        this.authorsLoading = false
      })
    },
    // 作者远程搜索
    searchAuthorsList(val) {
      this.authorsLoading = true
      this.queryAuthorSelect(val)
    },
    // 打开添加作者
    openAdd() {
      this.queryAuthorSelect(null)
      this.dialogOption = {
        title: '添加作者',
        show: true,
        loading: false
      }
      this.authorForm = {
        authors: [],
        size: 1
      }
      this.resetForm('authorForm')
      // querySet().then(res => {
      //   this.authorForm.authors = res.data.authors || []
      // })
    },
    // 保存回调
    handleConfirm() {
      this.$refs['authorForm'].validate((valid) => {
        if (valid) {
          saveAuthor(this.authorForm).then(res => {
            this.$notify.success({ title: '添加成功' })
            this.getList()
            this.dialogOption.show = false
            this.dialogOption.loading = false
          }).catch(e => {
            this.dialogOption.loading = false
          })
        }
      })
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
