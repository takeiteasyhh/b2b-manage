<template>
  <div>
    <div class="tab">
      <i class="icon iconfont iconshangjiaguanli"></i>
      <span>商家管理</span>
      <!-- <el-button round type="primary" class="fr" @click="addProduct">發佈商品</el-button> -->
    </div>
    <div class="whiteBac">
      <div class="cardBox">
        <el-table :data="shopList" stripe>
          <el-table-column prop="companyName" label="商家名稱"></el-table-column>
          <el-table-column prop="companyPhone" label="聯繫電話">
            <template slot-scope="scope">
              <span style="color: #3F9BF8">{{ scope.row.companyPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="郵箱"></el-table-column>
          <el-table-column prop="address" label="商家地址"></el-table-column>

          <el-table-column align="right" width="auto">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="editClick(scope.$index, scope.row)">編輯</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationBottom">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[25, 50, 100]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="pageTotal"
          ></el-pagination>
        </div>
      </div>
    </div>
  
    <el-dialog title="編輯商家" :visible.sync="showAddShop" :close-on-click-modal="false">
      <addShop
        @closeShopDialog="closeShopDialog"
        @addShopCallback="addShopCallback" ref="addShopForm"
      ></addShop>
    </el-dialog>
  </div>
</template>
<script>
//  import addShop from "./addShop.vue";
import config from "@/config/config.js";
import options from "@/libs/message";
import addShop from "@/views/shopList/addShop.vue";

export default {
  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      pageTotal: 0,
      shopList: [],
    
      baseImgPath: config.IMAGE_URL,
      imgUploadUrl: config.IMAGE_URL + "uploadImage",
      showAddShopTitle: "新增商家",
      showAddShop: false,
     
    };
  },
  components: {
    addShop
  },
  mounted() {
    this.getshoptList();
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProductList();
    },
    // 請求後台接口獲取商家
    async getshoptList() {
      let params = { size: this.pageSize, page: this.currentPage };
      let url = "company/list/" + this.currentPage;
      this.getAxios(url, params).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.shopList = res.data.list;
            this.pageTotal = res.data.totalCount;
          }
        } else {
          this.$message.error(
            this.$codeMap.codeMap[String(res.code)] || res.message
          );
        }
      });
    },
    // 点击 编辑按钮，打开弹窗
    editClick(index, row) {
      this.showAddShop = true;
      // this.showAddShopTitle = "編輯商家";
      // this.shopForm = row;
      this.$nextTick(() => {
          this.$refs.addShopForm.getData(row);
      })  
    },  
    // 關閉彈窗
    closeShopDialog() {
      this.showAddShop = false;
    },
    addShopCallback() {
      this.closeShopDialog();
      this.getshoptList(); //重新獲取列表數據
    }
  }
};
</script>

<style scoped>

</style>