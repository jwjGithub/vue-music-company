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
          表格
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Menu',
  components: {
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
        status: '', // 状态 NORMAL正常 STOP停用 DELETE删除
        page: 1, // 当前页
        limit: 999 // 每页条数
      }
    }
  },
  created() {
    // this.getDataList()
  },
  methods: {
    // 查询列表
    // getDataList() {
    //   this.loading = true
    //   getDataList(this.queryForm).then(res => {
    //     this.dataList = this.handleTree(res.data, 'id')
    //     console.log(this.dataList, res)
    //     this.loading = false
    //   })
    // },
  }
}
</script>
<style lang="scss" scoped>
</style>
