<template>
  <div class="iHead">
    <logo></logo>
    <user-info></user-info>
  </div>
</template>
<script>
import Logo from "./logo.vue"
import UserInfo from "./userInfo.vue"

export default {
  name:"iHead",
  components:{
    Logo,
    UserInfo
  },
  data() {
    return {
    };
  },
  methods:{
    
  }
};
</script>
<style lang="less" scoped>
.iHead {
  height: 60px;
  background: #0D58BA;
  color: #fff;
  padding: 0 20px;
}
</style>
