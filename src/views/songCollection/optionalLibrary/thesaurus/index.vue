<!--
 * @Descripttion: 词库主组件
 * @version:
 * @Author: jwj
 * @Date: 2020-12-02 15:04:55
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-02 15:30:10
-->
<template>
  <div class="main-page songCollection-optionalLibrary">
    <div class="main-content">
      <el-tabs
        v-model="tabActiveName"
        class="main-tabs"
        type="border-card"
        @tab-remove="removeTab"
      >
        <el-tab-pane label="词库列表" name="index">
          <list @addTab="addTab"></list>
        </el-tab-pane>
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.title"
          :name="item.name"
          :closable="true"
        >
          <Details :form="item.form"></Details>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import List from './components/List.vue'
import Details from './components/Details'
export default {
  name: '',
  components: {
    'list': List,
    Details
  },
  data() {
    return {
      tabActiveName: 'index',
      tabList: []
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
.songCollection-optionalLibrary{
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
.songCollection-optionalLibrary{
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
