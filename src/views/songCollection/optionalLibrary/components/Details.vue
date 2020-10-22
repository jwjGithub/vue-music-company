<template>
  <div class="main-page">
    <div class="main-content">
      <div class="left">
        <div class="header">
          <div class="left">
            <div class="tag mr10"></div>
            <div class="title">自选库内存歌曲</div>
          </div>
          <div class="right pr30">
            <el-input v-model="queryForm.keyword" class="search-input w30" size="mini" placeholder="请输入关键字" @keyup.enter.native="getList"></el-input>
            <el-button type="primary" size="mini" class="ml10 mrx45" :loading="loading" @click="getList">查询</el-button>
            <el-button size="mini" @click="deleteMusic">移动</el-button>
            <el-button size="mini" class="ml20" @click="deleteMusic">复制</el-button>
            <el-button size="mini" class="ml20" @click="deleteMusic">删除</el-button>
            <el-button size="mini" class="ml20" @click="deleteMusic">共享</el-button>
            <el-button size="mini" class="ml20" @click="deleteMusic">下载</el-button>
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
            <span class="row-text">蒋文俊</span>
          </p>
          <p class="row">
            <span class="row-title">创建时间：</span>
            <span class="row-text">2020-12-12 12:12:12</span>
          </p>
          <p class="row">
            <span class="row-title">最后修改时间：</span>
            <span class="row-text">2020-12-12 12:12:12</span>
          </p>
          <p class="row">
            <span class="row-title">备注：</span>
            <span class="row-text">2020-12-12 12:12:12备注备注备注备注备注备注备注备注备注</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getList,
  deleteMusic
} from '@/api/songCollection/optionalLibrary/details'
export default {
  name: 'Details',
  components: {
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      loading: false,
      dataList: [],
      userList: [], // 用户列表
      queryForm: {
        opBaseId: '', // 自选库详情id
        keyword: '', // 关键字
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      selectOption: []// 列表多选选中对象
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      this.queryForm.opBaseId = this.id
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
      this.selectOption = selection
    },
    // 删除歌曲
    deleteMusic() {

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
