<!--
 * @Descripttion: 预留库曲作品
 * @version:
 * @Author: jwj
 * @Date: 2020-12-04 13:29:43
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-04 14:24:42
-->
<template>
  <div class="main-page admin-infoSet">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">预留曲作品</div>
        </div>
        <div class="right pr30">
          <el-select v-model="queryForm.type" clearable placeholder="请选择作品类型" size="mini" class="mr10">
            <el-option label="全部" value=""></el-option>
            <el-option label="词曲" :value="1"></el-option>
            <el-option label="Beat/BGM" :value="2"></el-option>
            <el-option label="作曲" :value="3"></el-option>
          </el-select>
          <el-input v-model="queryForm.title" class="search-input w20" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
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
            <el-table-column min-width="55" label="序号">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="title" min-width="150" label="名称"></el-table-column>
            <el-table-column prop="typeDes" min-width="150" label="分类"></el-table-column>
            <el-table-column prop="emotionTagsDesc" min-width="150" label="作品标签"></el-table-column>
            <el-table-column min-width="150" label="曲作者" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.composers) }}</span>
                <!-- <div v-if="scope.row.composers">
                  <span v-for="(item,index) in scope.row.composers" :key="index">{{ item.name }}</span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="词作者" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.lyricists) }}</span>
                <!-- <div v-if="scope.row.lyricists">
                  <span v-for="(item,index) in scope.row.lyricists" :key="index">{{ item.name }}</span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="制作人" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.producers) }}</span>
                <!-- <div v-if="scope.row.producers">
                  <span v-for="(item,index) in scope.row.producers" :key="index">{{ item.name }}</span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column prop="creator" min-width="150" label="上传者"></el-table-column>
            <el-table-column prop="price" min-width="150" label="报价"></el-table-column>
            <el-table-column prop="reservationTime" min-width="152" label="预留日期"></el-table-column>
            <el-table-column prop="reservationNum" min-width="150" label="预留公司数"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="OpenCancel(1,scope.row)">取消预留</el-button>
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
  </div>
</template>
<script>
import {
  getList,
  cancelReservation
} from '@/api/songCollection/reservedLibrary'
export default {
  name: 'List',
  components: {},
  data() {
    return {
      total: 0,
      loading: false,
      dataList: [],
      queryForm: {
        type: '', // 作品类型
        title: '', // 关键字
        optionalType: 1, // 0词 1曲
        page: 1, // 当前页
        limit: 20 // 每页条数
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
        if (item.name) {
          arr.push(item.name)
        }
      })
      return arr.join(',')
    },
    // 打开取消预留 type:1 单个 type:2 批量
    OpenCancel(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将' + title + '取消预留, 是否继续?', '预留取消', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        // let ids = type === 1 ? row.userId : this.selectOption.ids.join(',')
        cancelReservation({ workIds: row.id }).then(res => {
          this.$notify.success({ title: '操作成功' })
          this.getList()
        })
      }).catch(() => {

      })
    }
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
