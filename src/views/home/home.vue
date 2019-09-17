<template>
  <div>
    <div class="tab" style="background: #fff;">
      <i class="icon iconfont iconshangpin"></i>
      <span>商品管理</span>
      <el-button round type="primary" class="fr" @click="addProduct">發佈商品</el-button>
    </div>
    <div class="whiteBac">
      <div class="cardBox" style="position:relative;">
 
      <div  class="companySearch fr">
            <el-input
              placeholder="請輸入商家名稱搜索"
              style="border-radius:21px;"         
              @keyup.enter.native="changeFilter"
              v-model = filter.keyword>
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                style="color:#4594FC;cursor: pointer;"  
                @click="changeFilter"        
              ></i>
            </el-input>
          </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="changeTab">
    <el-tab-pane label="酒店" name="hotel"> 
      <productList :currentType ="1" :search="filter" ref="hotel"></productList>
    </el-tab-pane>
    <el-tab-pane label="汽車" name="car">
      <productList :currentType ="2" :search="filter" ref="car"></productList>
    </el-tab-pane>
    <el-tab-pane label="票券" name="ticket">
       <productList  :currentType ="3" :search="filter" ref="ticket"></productList>
    </el-tab-pane>
    
    </el-tabs>     
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config/config.js";
import { getClientHeight, formatDate } from "@/libs/common.js";

import productList from "./productList.vue";

export default {
  name: "home",
  data() {
    return {
      imgUrl: config.IMAGE_URL,
      activeName:"hotel",
      filter:{
        keyword:""
      }
   
    };
  },
  components:{
     productList
  },
  activated() {
      // this.changeFilter();
  },
  mounted() {
       this.$nextTick(() => {
         this.changeFilter();
      })      
  },
  
  methods: {
    addProduct() {
      this.$router.push({ name: "addProduct" });
    },
    
    changeFilter(){
      let now = this.activeName;
      this.$refs[now].getProductList();
    },
    changeTab(tab){
      var now = tab.name;
      this.$refs[now].getProductList();
    }
    
  }
};
</script>

<style lang='less' scoped>
.tab{
  background: #fff;
}
.whiteBac{
  border-top: 0;
  padding-top:0;
}
/deep/.titleTable > div:hover {
  text-decoration: underline;
}
.companySearch{
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 99;
}
</style>