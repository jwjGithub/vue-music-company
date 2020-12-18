<!--
 * @Descripttion: 优先推送详情
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 21:02:03
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-18 19:39:08
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
            <div class="ml50">剩余推送数作品数：{{ leftNum }}</div>
          </div>
          <div class="right pr30">
            <!-- <el-button type="primary" size="mini" :disabled="!selectOption.multiple" @click="openAdd(2,null)">添加到自选库</el-button> -->
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
              <el-table-column prop="title" min-width="150" label="名称"></el-table-column>
              <el-table-column prop="typeDes" min-width="150" label="分类"></el-table-column>
              <el-table-column prop="stypeTagsDesc" min-width="150" label="作品标签"></el-table-column>
              <el-table-column v-if="!switchType" min-width="150" label="曲作者">
                <template slot-scope="scope">
                  <span>{{ setComposers(scope.row.composers) }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="switchType" min-width="150" label="词作者">
                <template slot-scope="scope">
                  <span>{{ setComposers(scope.row.lyricists) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="price" min-width="150" label="报价"></el-table-column>
              <el-table-column prop="createdTime" min-width="150" label="发布时间"></el-table-column>
              <el-table-column prop="postedTime" min-width="150" label="公开发布时间"></el-table-column>
              <el-table-column label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="openAdd(scope.row, 1)">添加到自选库</el-button>
                  <el-button size="mini" type="text" @click="openReserve(scope.row)">预留</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <pagination
              v-show="total>0"
              :total="Number(total)"
              :page.sync="queryForm.page"
              :limit.sync="queryForm.limit"
              @pagination="getList"
            /> -->
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
  addToOptional,
  addReservation
} from '@/api/songCollection/priorityPush/details'
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
      // 选择对象
      // selectOption: {
      //   // 选中数组
      //   ids: [],
      //   // 非单个禁用
      //   single: true,
      //   // 非多个禁用
      //   multiple: true
      // },
      // total: 0,
      loading: false,
      dataList: [],
      zxkList: [], // 自选库列表
      title: '', // 标题
      leftNum: '', // 剩余推送数
      switchType: false, // 需求库类型 0词true 1曲false
      queryForm: {
        author: '', // 作者ID
        optionalType: '1' // 需求库类型 0词true 1曲false
        // page: 1, // 当前页
        // limit: 10 // 每页条数
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
    this.leftNum = this.form.leftNum
    this.getList()
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      this.queryForm.author = this.form.userId
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
      this.queryForm.optionalType = val ? '0' : '1'
      this.getList()
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
    // 列表多选框
    // handleSelectionChange(selection) {
    //   this.selectOption.ids = selection.map(item => item.id)
    //   this.selectOption.single = selection.length !== 1
    //   this.selectOption.multiple = !selection.length
    // },
    // 打开添加到自选库窗口
    openAdd(row, type) {
      this.dialogOption = {
        title: '添加到自选库',
        show: true,
        loading: false
      }
      // 获取自选库下拉列表 optionalType:0 词 type:1 曲
      getOptionalList({ optionalType: this.queryForm.optionalType }).then(res => {
        this.zxkList = res.data || []
      })
      this.listForm = {
        worksId: type === 1 ? row.id : '',
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
    },
    // 预留
    openReserve(row) {
      this.$confirm('预留该作品', '作品预留', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        addReservation({ worksId: row.id }).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getList()
        })
      }).catch(() => {})
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
