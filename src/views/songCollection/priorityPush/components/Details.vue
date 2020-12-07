<!--
 * @Descripttion: 优先推送详情
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 21:02:03
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-07 21:10:09
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <div class="left">
        <div class="header">
          <div class="left">
            <div class="tag mr10"></div>
            <div class="title">{{ title }}</div>
            <el-switch
              v-model="switchType"
              active-color="#409eff"
              inactive-color="#ff4949"
              inactive-text="曲"
              active-text="词"
              class="ml20"
              @change="switchLyricsMusic"
            >
            </el-switch>
          </div>
          <div class="center">
            <el-input v-model="queryForm.keyword" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
            <el-button type="primary" size="mini" class="ml10 mr20" :loading="loading" @click="getList">查询</el-button>
          </div>
          <div class="right pr30">
            <el-button type="primary" size="mini" :disabled="!selectOption.multiple" @click="openAdd(2,null)">添加到自选库</el-button>
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
              <el-table-column prop="title" min-width="150" label="序号"></el-table-column>
              <el-table-column prop="authorName" min-width="150" label="名称"></el-table-column>
              <el-table-column v-if="!switchType" prop="sharingPersonNames" min-width="150" label="分类"></el-table-column>
              <el-table-column prop="price" min-width="150" label="作品标签"></el-table-column>
              <el-table-column v-if="!switchType" prop="description" min-width="150" label="曲作者"></el-table-column>
              <el-table-column prop="description" min-width="150" label="词作者"></el-table-column>
              <el-table-column prop="description" min-width="150" label="报价"></el-table-column>
              <el-table-column label="添加到自选库" fixed="right" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="openAdd(1,scope.row)">添加</el-button>
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
    <!-- 添加到自选库 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'460px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="listForm" :model="listForm" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="自选库：" prop="optionalId">
                <el-select
                  v-model="listForm.optionalId"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width:100%;"
                >
                  <el-option v-for="item in zxkList" :key="item.id" :label="item.baseName" :value="item.id" />
                </el-select>
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
  getOptionalList,
  addToOptional
} from '@/api/songCollection/needsLibrary/details'
export default {
  name: 'Details',
  components: {
  },
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableKey: 0,
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
      zxkList: [], // 自选库列表
      userList: [], // 用户列表
      title: '', // 标题
      switchType: '', // 需求库类型 0词true 1曲false
      queryForm: {
        id: '', // 需求库ID
        optionalType: '', // 需求库类型 0词true 1曲false
        // keyword: '', // 关键字
        page: 1, // 当前页
        limit: 20 // 每页条数
      },
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      listForm: {
        optionalId: ''
      },
      rules: {
        optionalId: [
          { required: true, message: '请选择目标自选库', trigger: ['blur'] }
        ]
      }
    }
  },
  created() {
    this.title = this.form.name
    this.switchType = this.form.optionalType === 0
    this.queryForm.optionalType = this.form.optionalType
    this.getList()
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      this.queryForm.id = this.form.id
      getList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 切换词曲
    switchLyricsMusic(val) {
      console.log(val)
      console.log(this.switchType, '开关')
      this.queryForm.optionalType = val ? 0 : 1
      this.getList()
    },
    // 列表多选框
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 打开删除 type:1 单个 type:2 批量
    // openDelete(type, row) {
    //   let title = type === 1 ? '单个' : '批量'
    //   this.$confirm('此操作将' + title + '删除自选库歌曲, 是否继续?', '自选库歌曲删除', {
    //     cancelButtonText: '取消',
    //     confirmButtonText: '确定',
    //     type: 'warning'
    //   }).then(() => {
    //     let json = {
    //       optionalId: this.form.id,
    //       musicIds: type === 1 ? row.id : this.selectOption.ids.join(',')
    //     }
    //     console.log('删除')
    //     saveDelete(json).then(res => {
    //       this.$notify.success({
    //         title: '操作成功'
    //       })
    //       this.getList()
    //     })
    //   }).catch(() => {

    //   })
    // },
    // 打开添加到自选库窗口
    openAdd() {
      this.dialogOption = {
        title: '添加到自选库',
        show: true,
        loading: false
      }
      // 获取自选库下拉列表 type:0 词 type:1 曲
      getOptionalList({ optionalType: this.queryForm.optionalType }).then(res => {
        this.zxkList = res.data || []
      })
      this.listForm = {
        worksId: this.selectOption.ids.join(),
        optionalId: '',
        optionalType: this.queryForm.optionalType
      }
      this.resetForm('listForm')
    },
    // 保存回调
    handleConfirm() {
      this.$refs['listForm'].validate((valid) => {
        if (valid) {
          this.dialogOption.loading = true
          addToOptional(this.listForm).then(res => {
            this.$notify.success({
              title: '操作成功'
            })
            this.dialogOption.show = false
            this.dialogOption.loading = false
            this.getList()
          }).catch(() => {
            this.dialogOption.loading = false
          })
        } else {
          return false
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
    >.left{
			flex:1;
			overflow:hidden;
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
        >.center{
          display: flex;
          align-items:center;
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
			}
		}
    }
}
</style>
