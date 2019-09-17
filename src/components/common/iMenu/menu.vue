
<template>
  <div>
    <el-scrollbar style="height:100%;">
      <el-menu
        :default-active="getNowPath"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        :router="true"
        :unique-opened="true"
        active-text-color="#fff"
      >
        <el-menu-item index="/home">
          <i class="icon iconfont iconshangpin"></i>
          <p class="ttl">商品管理</p>
        </el-menu-item>
        <el-menu-item index="/shopList">
          <i class="icon iconfont iconshangjiaguanli"></i>
          <p class="ttl">商家管理</p>
        </el-menu-item>
        <el-menu-item index="/orderList">
          <i class="icon iconfont icondingdan"></i>
          <p class="ttl">訂單管理</p>
        </el-menu-item>
        <el-menu-item index="/homeConfig">
          <i class="icon iconfont iconqita"></i>
          <p class="ttl">其他管理</p>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  name: "iMenu",
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    getNowPath() {
      
      let getPath =
        typeof this.$store.getters.getNowMenu === "string"
          ? this.$store.getters.getNowMenu
          : "/home";
      return getPath;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
/deep/.el-menu-item-group__title {
  padding: 0;
}
/deep/.el-scrollbar {
  width: 190px;
  overflow-x: hidden;
}

.iconfont {
  font-size: 45px;
  margin-right: 0;
}
.ttl{
  line-height: 1.6;
}

/deep/.el-menu-item {
  height: 134px;
  text-align: center;
  color: rgba(102, 102, 102, 1);
  font-size: 16px;
  border-bottom: 1px solid rgba(229, 229, 229, 1);
  padding: 25px;
}
/deep/.el-menu-item:first-child {
  border-top: 1px solid rgba(229, 229, 229, 1);
}
</style>
