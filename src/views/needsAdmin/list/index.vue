<!--
 * @Date: 2020-10-21 17:49:06
 * @Description: 需求列表
 * @LastEditors: JWJ
 * @LastEditTime: 2020-10-26 21:59:36
 * @FilePath: \vue-music-company\src\views\songCollection\optionalLibrary\index.vue
-->
<template>
  <div class="main-page needsAdmin-list">
    <div class="main-content">
      <el-tabs
        v-model="tabActiveName"
        class="main-tabs"
        type="border-card"
        @tab-remove="removeTab"
      >
        <el-tab-pane label="发布中需求" name="now">
          <now v-if="tabActiveName == 'now'" @addTab="addTab"></now>
        </el-tab-pane>
        <el-tab-pane label="历史需求" name="history">
          <history v-if="tabActiveName == 'history'" @addTab="addTab"></history>
        </el-tab-pane>
        <el-tab-pane label="草稿箱" name="draft">
          <draft v-if="tabActiveName == 'draft'" @addTab="addTab"></draft>
        </el-tab-pane>
        <!-- <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.title"
          :name="item.name"
          :closable="true"
        >
          <Details :form="item.form"></Details>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getList
} from '@/api/songCollection/optionalLibrary'
import Now from './components/Now'
import History from './components/History'
import Draft from './components/Draft'
// import Details from './components/Details'
export default {
  name: '',
  components: {
    'now': Now,
    'history': History,
    'draft': Draft
    // Details
  },
  data() {
    return {
      tabActiveName: 'now',
      tabList: [],
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
  },
  methods: {
    addTab(row) {
      let newTabName = row.title + row.form.id
      let bl = true
      for (let i = 0, len = this.tabList.length; i < len; i++) {
        let item = this.tabList[i]
        if (item.name === newTabName) {
          this.tabActiveName = newTabName
          bl = false
          break
        }
      }
      if (bl) {
        this.tabList.push({
          title: row.title,
          form: row.form,
          name: newTabName
        })
        this.tabActiveName = newTabName
      }
    },
    removeTab(name) {
      for (let i = 0, len = this.tabList.length; i < len; i++) {
        let item = this.tabList[i]
        if (name === item.name) {
          this.tabList.splice(i, 1)
          if (i > 0) {
            this.tabActiveName = this.tabList[i - 1].name
          } else {
            this.tabActiveName = 'index'
          }
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.needsAdmin-list{
  padding:10px;
  width:100%;
  height:100%;
  >.main-content{
    width:100%;
    height:100%;

  }
}
</style>
<style lang="scss">
.needsAdmin-list{
  .main-tabs{
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    .el-tabs__content{
      padding:0;
      flex:1;
      overflow:hidden;
      .el-tab-pane{
        height:100%;
      }
    }
  }

}

</style>
