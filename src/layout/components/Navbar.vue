<!--
 * @Description:
 * @Autor: JWJ
 * @Date: 2020-10-14 22:52:10
 * @LastEditors: JWJ
 * @LastEditTime: 2020-12-21 13:46:18
-->
<template>
  <div class="navbar layout-navbar-page">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div class="right-menu-input">
        <el-input v-model="song" placeholder="歌曲/歌单/音乐人"></el-input>
        <img src="@/assets/images/common/search.png" alt="">
      </div>
      <div class="right-menu-head">
        <img class="right-menu-img" :src="$store.getters.userInfo.profileUrl || defaultHead" alt="">
      </div>
      <div class="right-user">
        <div>{{ $store.getters.userInfo.username }}</div>
        <el-dropdown class="avatar-container" trigger="click">
          <span class="avatar-wrapper">
            {{ $store.getters.userInfo.realname }}
            <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                主页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb
    // Hamburger
  },
  data() {
    return {
      song: '',
      defaultHead: require('@/assets/images/common/default-head.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    // 是否展开左边导航栏
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/LogOut').then(() => {
          this.goMusic('logOut=Y')
          // location.reload()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  color:#FFFFFF;
  background: #2c70bb;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 70px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    display:flex;
    justify-content: center;

    &:focus {
      outline: none;
    }
    .right-menu-input{
      margin-right: 30px;
      line-height: 70px;
      position: relative;
      .el-input{
        width: 360px;
      }
      img{
        position: absolute;
        top: 24px;
        right: 23px;
      }
    }
    .right-menu-head{
      width:54px;
      height:54px;
      margin-top: 8px;
      margin-right: 10px;
      .right-menu-img{
        border-radius: 50%;
        width:100%;
        height:100%;
      }
    }
    .right-user{
      display:flex;
      flex-direction: column;
      justify-content: center;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.layout-navbar-page{
  .right-menu-input{
    .el-input__inner{
      border-radius: 30px;
    }
  }
  .el-breadcrumb__item{
    .el-breadcrumb__inner{
      color: #FFFFFF;
      a {
        color: #FFFFFF;
      }
    }
    .el-breadcrumb__separator{
      color: #FFFFFF;
    }
  }
  .el-breadcrumb__item:last-child{
    .el-breadcrumb__inner{
      color: #FFFFFF;
    }
    .no-redirect{
        color: #FFFFFF;
      }
  }
  .el-dropdown{
    color: #FFFFFF;
  }
  .el-input__inner{
    background-color: #afd8ff;
    border: 1px solid #afd8ff;
  }
  .el-input__inner::placeholder {
    color: #65a3dd;
  }
}
</style>
