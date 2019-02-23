<template>
  <div id="index">
    <div class="header">
      <div class="nav clear">
        <div class="fl">
          <router-link to="/login" style="color: #fff;" v-if="userName === ''">Dear, please sign in</router-link>
          <a style="color: #fff;" v-else>Dear,  {{userName}}</a>
          <!-- <router-link to="/login" style="margin-left: 20px;color: #fff;">registered</router-link> -->
          <a @click="logout" style="margin-left: 20px;color: #fff;" v-if="userName !== ''">logout</a>
        </div>
        <div class="fr" style="width: 500px">
          <router-link to="/uploadGoods" style="color: #fff;" v-if="userName !== ''">uploadGoods</router-link>
          <router-link to="/index" style="margin-left: 20px;color: #fff;font-size:20px"><Icon type="ios-home" /></router-link>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/libs/util'
export default {
  data() {
    return {
      userName: ''
    }
  },
  methods: {
    logout() {
      setToken('');
      sessionStorage.removeItem('userName');
      this.userName = '';
      this.$router.push('/login');
    }
  },
  mounted() {
    let self = this;
    if(sessionStorage.userName) {
      self.userName = sessionStorage.userName;
    }
  }
};
</script>

<style lang="less">
#index {
  background: #f4f4f4;
  .header {
    background: #515a6e;
    padding: 0 50px;
    width: 100%;
    height: 44px;
    line-height: 44px;
    color: #fff;
    .nav {
      width: 1200px;
      height: 100%;
      margin: auto;
      div {
        line-height: 44px;
      }
    }
  }
  .content {
    width: 1200px;
    height: 100%;
    margin: auto;
    padding: 20px 0;
  }
}
</style>
