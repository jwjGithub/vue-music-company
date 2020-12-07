<!--
 * @Descripttion: 每日更新
 * @version:
 * @Author: jwj
 * @Date: 2020-12-07 20:52:44
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-07 21:50:54
-->
<template>
  <div class="main-page admin-infoSet">
    <div class="main-content">
      <div class="header">
        <div class="left">
          <div class="tag mr10"></div>
          <div class="title">每日更新</div>
        </div>
        <div class="right pr30">
          <el-button type="primary" size="mini" @click="openSetUp">设置</el-button>
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
            <el-table-column width="70" label="序号">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="username" min-width="150" label="名称"></el-table-column>
            <el-table-column prop="realname" min-width="150" label="分类"></el-table-column>
            <el-table-column prop="mobile" min-width="150" label="作品标签"></el-table-column>
            <el-table-column prop="email" min-width="150" label="曲作者"></el-table-column>
            <el-table-column prop="label" min-width="150" label="词作者"></el-table-column>
            <el-table-column prop="label" min-width="150" label="制作人"></el-table-column>
            <el-table-column prop="label" min-width="150" label="上传者"></el-table-column>
            <el-table-column prop="label" min-width="150" label="报价"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openAdd(scope.row)">添加</el-button>
                <el-button size="mini" type="text" @click="openReserve(scope.row)">预留</el-button>
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
    <!-- 设置筛选条件 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="类型：" prop="type">
                <el-select v-model="form.type" clearable placeholder="请选择作品类型" style="width:100%;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="词曲" :value="1"></el-option>
                  <el-option label="Beat/BGM" :value="2"></el-option>
                  <el-option label="作曲" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风格：" prop="realname">
                <el-select v-model="form.type" clearable placeholder="请选择作品类型" style="width:100%;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="词曲" :value="1"></el-option>
                  <el-option label="Beat/BGM" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="情感：" prop="password">
                <el-select v-model="form.type" clearable placeholder="请选择作品类型" style="width:100%;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="词曲" :value="1"></el-option>
                  <el-option label="Beat/BGM" :value="2"></el-option>
                  <el-option label="作曲" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="价格区间：">
                <el-input v-model="form.price" style="width:47%;"></el-input> -
                <el-input v-model="form.price2" style="width:47%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作者：" prop="mobile">
                <el-input v-model="form.mobile" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="">
                <p>
                  <el-radio v-model="form.radioVal" label="1">筛选包含以上任意条件的作品</el-radio>
                </p>
                <p>
                  <el-radio v-model="form.radioVal" label="2">筛选包含以上所以条件的作品</el-radio>
                </p>
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
  saveAdd,
  saveEdit
} from '@/api/admin/lowerAccount'
export default {
  name: 'List',
  components: {},
  data() {
    let validatePhone = (rule, value, callback) => {
      let reg = /^1[0-9]{10}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    let validateEmail = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
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
      queryForm: {
        // realName: '', // 姓名
        page: 1, // 当前页
        limit: 20 // 每页条数
      },
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      form: {},
      rules: {
        type: [
          { required: true, message: '请选择作品类型', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
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
    // 打开设置窗口
    openSetUp() {
      this.dialogOption = {
        title: '设置筛选条件',
        show: true,
        loading: false
      }
      this.form = {
        type: '', // 类型
        username: '', // 用户名
        price: '', // 姓名
        price2: '', // 密码
        mobile: '', // 手机号
        radioVal: ''
      }
      this.resetForm('form')
    },
    // 打开添加自选库窗口
    openAdd(row) {
      // this.dialogOption = {
      //   title: '编辑账号',
      //   show: true,
      //   loading: false
      // }
      // row.password = ''
      // this.form = JSON.parse(JSON.stringify(row))
      // this.resetForm('form')
    },
    // 新增保存
    saveAdd() {
      // this.dialogOption.loading = true
      // saveAdd(this.form).then(res => {
      //   this.$notify.success({
      //     title: '保存成功'
      //   })
      //   this.getList()
      //   this.dialogOption.show = false
      //   this.dialogOption.loading = false
      // }).catch(e => {
      //   this.dialogOption.loading = false
      // })
    },
    // 编辑保存
    saveEdit() {
      // this.dialogOption.loading = true
      // saveEdit(this.form).then(res => {
      //   this.$notify.success({
      //     title: '保存成功'
      //   })
      //   this.getList()
      //   this.dialogOption.show = false
      //   this.dialogOption.loading = false
      // }).catch(e => {
      //   this.dialogOption.loading = false
      // })
    },
    // 保存回调
    handleConfirm() {
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     if (this.form.userId) {
      //       this.saveEdit()
      //     } else {
      //       this.saveAdd()
      //     }
      //   } else {
      //     return false
      //   }
      // })
    },
    // 预留
    openReserve(row) {
      this.$notify.success({ title: '预留' })
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
