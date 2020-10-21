<template>
  <div class="main-page">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">自选课</div>
        </div>
        <div class="right pr30">
          <el-input v-model="queryForm.baseName" class="search-input w30" size="mini" placeholder="请输入关键字"></el-input>
          <el-button type="primary" size="mini" class="ml10 mrx45" :loading="loading" @click="getList">查询</el-button>
          <el-button type="primary" size="mini" @click="addTab">创建</el-button>
          <el-button size="mini" class="ml20" @click="addTab">删除</el-button>
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
            <el-table-column prop="realname" min-width="150" label="名称"></el-table-column>
            <el-table-column prop="companyName" min-width="150" label="创建人"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <!-- <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
              </template> -->
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </div>
    <!-- <el-button type="primary" @click="addTab">添加标签</el-button> -->
  </div>
</template>
<script>
import {
  getList
} from '@/api/songCollection/optionalLibrary'
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
        baseName: '', // 自选库名称
        page: 1, // 当前页
        limit: 10 // 每页条数
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    addTab() {
      let json = {
        title: '详情页',
        id: '1'
      }
      this.$emit('addTab', json)
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
