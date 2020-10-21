<!--
 * @Date: 2020-10-21 17:49:06
 * @Description: 自选库
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-21 17:49:32
 * @FilePath: \vue-music-company\src\views\songCollection\optionalLibrary\index.vue
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <el-tabs v-model="editableTabsValue" class="main-tabs" type="border-card">
        <el-tab-pane label="用户管理">
          用户管理
          <el-button type="primary" @click="addTab(editableTabsValue)">添加标签</el-button>
        </el-tab-pane>
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name"
          :closable="true"
        >
          {{ item.content }}
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getList
} from '@/api/songCollection/optionalLibrary'
export default {
  name: '',
  data() {
    return {
      editableTabsValue: '',
      editableTabs: [{
        title: '详情1',
        name: '1',
        content: 'Tab 1 content'
      }, {
        title: '详情2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 3,
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
    addTab(targetName) {
      this.tabIndex++
      let newTabName = this.tabIndex + ''
      this.editableTabs.push({
        title: '详情' + this.tabIndex,
        name: newTabName,
        content: 'New Tab content'
      })
      this.editableTabsValue = newTabName
    },
    // 查询列表
    getList() {
      this.loading = true
      getList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page{
  padding:10px;
  width:100%;
  height:100%;
  .main-content{
    width:100%;
    height:100%;
    .main-tabs{
      width:100%;
      height:100%;
    }
  }
}
</style>
