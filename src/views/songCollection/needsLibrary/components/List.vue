<template>
  <div class="main-page">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">需求库</div>
        </div>
        <div class="right pr30">
          <el-input v-model="queryForm.title" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
          <el-button type="primary" size="mini" class="ml10" :loading="loading" @click="getList">查询</el-button>
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
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="title" min-width="150" label="名称">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">{{ scope.row.optionalName }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="title" min-width="150" label="关联需求"></el-table-column>
            <el-table-column prop="optionalTypeDes" min-width="150" label="类型"></el-table-column>
            <el-table-column prop="creatorName" min-width="150" label="创建人"></el-table-column>
            <el-table-column prop="" min-width="150" label="投稿数"></el-table-column>
            <el-table-column prop="createdTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="截止日期"></el-table-column>
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
  </div>
</template>
<script>
import {
  getList
//   saveAdd,
//   saveEdit,
//   saveDelete,
//   getUserUnderCom
} from '@/api/songCollection/needsLibrary/list'
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
        title: '', // 需求模糊查询
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
  },
  methods: {
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
    // 打开详情
    openDetails(row) {
      let form = {
        id: row.id,
        optionalType: row.optionalType,
        name: row.title
        // createdTime: row.createdTime,
        // updateTime: row.updateTime,
        // sharingPersonNames: row.sharingPersonNames,
        // remark: row.remark
      }
      console.log(form, 'form')
      let json = {
        title: row.title,
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
