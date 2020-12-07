<!--
 * @Descripttion: 自选库曲库详情
 * @version:
 * @Author: jwj
 * @Date: 2020-10-28 22:53:06
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-07 20:30:03
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <div class="left">
        <div class="header">
          <div class="left">
            <div class="tag mr10"></div>
            <div class="title">{{ form.title }}</div>
          </div>
          <div class="center">
            <el-input v-model="queryForm.title" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
            <el-button type="primary" size="mini" class="ml10 mr20" :loading="loading" @click="getList">查询</el-button>
          </div>
          <div class="right pr30">
            <el-button type="primary" size="mini" :disabled="selectOption.multiple" @click="$message.error('暂时没接口')">播放</el-button>
            <el-button size="mini" :disabled="selectOption.multiple" @click="openDialogOption(1)">移动</el-button>
            <el-button size="mini" class="ml10" :disabled="selectOption.multiple" @click="openDialogOption(2)">复制</el-button>
            <el-button size="mini" class="ml10" :disabled="selectOption.multiple" @click="openDelete(2,null)">删除</el-button>
            <el-button size="mini" class="ml10" @click="$message.error('暂时没接口')">共享</el-button>
            <el-button size="mini" class="ml10" @click="$message.error('暂时没接口')">下载</el-button>
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
              <el-table-column prop="title" min-width="150" label="名称"></el-table-column>
              <el-table-column prop="authorName" min-width="150" label="作者"></el-table-column>
              <!-- <el-table-column prop="sharingPersonNames" min-width="150" label="时长"></el-table-column> -->
              <el-table-column prop="price" min-width="150" label="价格"></el-table-column>
              <el-table-column prop="description" min-width="150" label="标签"></el-table-column>
            <!-- <el-table-column label="操作" fixed="right" width="180">
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
							</template>
							</el-table-column> -->
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
      <div class="right">
        <div class="right-img mt18">
          <img src="@/assets/images/songCollection/song.png">
        </div>
        <div class="content">
          <p class="row">
            <span class="row-title">创建人：</span>
            <span class="row-text">{{ form.realname }}</span>
          </p>
          <p class="row">
            <span class="row-title">创建时间：</span>
            <span class="row-text">{{ form.createdTime }}</span>
          </p>
          <p class="row">
            <span class="row-title">最后修改时间：</span>
            <span class="row-text">{{ form.updateTime }}</span>
          </p>
          <p class="row">
            <span class="row-title">分享人：</span>
            <span class="row-text">{{ form.sharingPersonNames }}</span>
          </p>
          <p class="row">
            <span class="row-title">备注：</span>
            <span class="row-text">{{ form.remark }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 新增/修改 弹窗 -->
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
              <el-form-item label="目标自选库：" prop="toOptionalId">
                <el-select
                  v-model="listForm.toOptionalId"
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
  copyToOptional,
  moveToOptional,
  saveDelete
} from '@/api/songCollection/optionalLibrary/details'
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
      queryForm: {
        id: '', // 自选库详情id
        optionalType: 1, // 自选库类型 0词 1曲
        title: '', // 关键字
        page: 1, // 当前页
        limit: 20 // 每页条数
      },
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      listForm: {
        toOptionalId: ''
      },
      rules: {
        toOptionalId: [
          { required: true, message: '请选择目标自选库', trigger: ['blur'] }
        ]
      }
    }
  },
  created() {
    this.getOptionalList()
    this.getList()
  },
  methods: {
    // 查询自选库列表下拉
    getOptionalList() {
      getOptionalList({ baseName: '', optionalType: 1 }).then(res => {
        this.zxkList = res.data || []
      })
    },
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
    // 列表多选框
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将' + title + '删除自选库歌曲, 是否继续?', '自选库歌曲删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = {
          optionalId: this.form.id,
          workIds: type === 1 ? row.id : this.selectOption.ids.join(','),
          optionalType: 1 // 自选库类型 0词 1曲
        }
        saveDelete(json).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getList()
        })
      }).catch(() => {

      })
    },
    // type 1:移动 2:复制
    openDialogOption(type) {
      let title = type === 1 ? '移动到' : '复制到'
      this.listForm = {
        type: type,
        fromOptionalId: this.form.id,
        toOptionalId: '',
        workIds: this.selectOption.ids.join(','),
        optionalType: 1 // 自选库类型 0词 1曲
      }
      this.dialogOption = {
        title: title,
        show: true,
        loading: false
      }
      this.resetForm('listForm')
    },
    // 保存回调
    handleConfirm() {
      this.$refs['listForm'].validate((valid) => {
        if (valid) {
          if (this.listForm.type === 1) {
            this.dialogOption.loading = true
            moveToOptional(this.listForm).then(res => {
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
            this.dialogOption.loading = true
            copyToOptional(this.listForm).then(res => {
              this.$notify.success({
                title: '操作成功'
              })
              this.dialogOption.show = false
              this.dialogOption.loading = false
              this.getList()
            }).catch(() => {
              this.dialogOption.loading = false
            })
          }
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
    flex-direction: row ;
    >.left{
			flex:1;
      height:100%;
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
		>.right{
			width:330px;
			height:100%;
			background-color: #e7EDF5;
			>.right-img{
				width: 210px;
				height: 210px;
				margin: 0 auto;
				>img{
					width: 100%;
					height:100%;
				}
			}
			>.content{
				margin-top: 23px;
				>.row{
					display: flex;
					font-size: 14px;
          align-items:center;
					.row-title{
						width: 120px;
						text-align: right;
						color: #999999;
					}
					.row-text{
						line-height: 20px;
						width: 180px;
						color: #333333;
					}
				}
			}
		}
  }
}
</style>
