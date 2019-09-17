<template>
  <div>
    <div class="tab" style="background: #fff;">
      <i class="icon iconfont icondingdan"></i>
      <span>訂單管理</span>
    </div>
    <div class="whiteBac">
      <div class="box">
        <!-- 篩選行 -->
        <el-row class="filterRow">
          <el-col :span="4">
            <el-select
              v-model="filter.companyId"
              filterable
              clearable
              placeholder="請選擇商家"
              @change="changeFilter"
            >
              <el-option label="全部商家" value key></el-option>
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="filter.goodsType"
              filterable
              placeholder="請選擇訂單類型"
              @change="changeFilter"
            >
              <el-option label="全部類型" value key></el-option>
              <el-option
                v-for="item in goodsTypeOpts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select
              v-model="filter.orderStatus"
              filterable
              placeholder="請選擇訂單狀態"
              @change="changeFilter"
            >
              <el-option label="全部訂單狀態" value key></el-option>
              <el-option
                v-for="item in statusOpts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="4" class="fr">
            <el-input
              placeholder="請輸入訂單號查詢"
              v-model="filter.keyword"
              style="border-radius:21px;"
              @keyup.enter.native="changeFilter"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                style="color:#4594FC;cursor: pointer;"
                @click="changeFilter"
              ></i>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="orderList" stripe>
          <el-table-column prop="orderNo" label="訂單號">
            <template slot-scope="scope">
              <span style="color: #3F9BF8">{{ scope.row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="所屬商家"></el-table-column>
          <el-table-column label="訂單類型">
            <template slot-scope="scope">{{scope.row.goodsType | filterGoodsType}}</template>
          </el-table-column>
          <el-table-column label="商品名稱">
            <template slot-scope="scope">{{scope.row.orderItems[0].goodsName}}</template>
          </el-table-column>

          <el-table-column label="總金額">
            <template slot-scope="scope">
              <span style="color:red">MOP ${{scope.row.totalAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalQuantity" label="總數量"></el-table-column>
          <el-table-column label="訂單狀態">
            <template slot-scope="scope">{{scope.row.orderStatus | filterStatus}}</template>
          </el-table-column>
          <el-table-column label="付款類型">
            <template slot-scope="scope">{{scope.row.paymentType | filterPay}}</template>
          </el-table-column>
          <el-table-column label="下單時間">
            <template slot-scope="scope">{{formatMyTime(scope.row.createTime)}}</template>
          </el-table-column>

          <el-table-column align="right" width="auto" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="detailClick(scope.$index, scope.row)">查看</el-button>
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

    <el-dialog :title="detail.showDetailTitle" :visible.sync="isShowDetail" width="898px">
      <div class="detailBase">
        <el-row>
          <el-col :span="3">收貨信息:</el-col>
          <el-col :span="4">{{detail.receiveName}}</el-col>
          <el-col :span="6">{{detail.receivePhone}}</el-col>
           <el-col :span="6">{{detail.email}}</el-col>
        </el-row>
        <!-- <div class="status">{{detail.orderStatus | filterStatus}}</div> -->

        <img class="status-img" :src="statusImgs[detail.orderStatus]" />
        <el-row>
          <el-col :span="12" :offset="3">{{detail.address}}</el-col>
        </el-row>
      </div>
      <div class="itemList">
        <div class="item" v-for="item in detail.orderItems" :key="item.id">
          <img :src="imgUrl+item.goods.goodsUrl" class="showImg" />
          <p class="name">{{item.goodsName}}</p>
          <p class="price">{{"MOP $"+item.totalAmount}}</p>
          <P style="min-width:100px;">{{item.goods.validity+"天"}}</P>
        </div>
      </div>
      <div class="payInfo">
        <div class="fl">
          <p class="small">商品總價</p>
          <!-- <p>運費（快遞）</p> -->
          <p class="big">訂單總價</p>
        </div>
        <div style="text-align:right;padding-right:20px">
          <P class="small">{{"MOP $"+Number(detail.totalAmount)}}</P>
          <P class="big">{{"MOP $"+Number(detail.totalAmount)}}</P>
        </div>
        <i class="arrow el-icon-arrow-up"></i>
      </div>
      <div class="payInfo" style="border-bottom:0;">
        <div class="fl">
          <p class="big">實付款</p>
        </div>
        <div style="text-align:right;padding-right:20px">
          <P class="big price">{{"MOP $"+Number(detail.totalAmount)}}</P>
        </div>
      </div>
      <div class="line"></div>

      <div class="orderInfo">
        <p class="big">訂單信息</p>
        <div class="small">
          <el-row>
            <el-col :span="2">訂單編號：</el-col>
            <el-col :span="20">{{detail.orderNo}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="2">支付類型：</el-col>
            <el-col :span="20">{{detail.paymentType | filterPay}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="2">創建時間：</el-col>
            <el-col :span="20">{{formatMyTime(detail.createTime)}}</el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  v-if="detail.orderStatus===0" type="primary" @click="changeOrder(detail)">確認已付款</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatTime, formatDate } from "@/libs/common.js";
import config from "@/config/config.js";

export default {
  data() {
    const status0 = require("@/assets/img/0.png");
    const status1 = require("@/assets/img/1.png");
    const status10 = require("@/assets/img/10.png");
    const status15 = require("@/assets/img/15.png");

    return {
      imgUrl: config.IMAGE_URL,

      pageSize: 20,
      currentPage: 1,
      pageTotal: 0,
      companyList: [],
      goodsTypeOpts: this.$codeMap.goodsTypeOpt,
      statusOpts: this.$codeMap.statusOpts,
      filter: {
        orderNo: ""
      },
      statusImgs: {
        0: status0,
        1: status1,
        10: status10,
        15: status15
      },

      orderList: [],
      isShowDetail: false,
      detail: {
        showDetailTitle: "",
        isShowDetail: false
      }
    };
  },
  filters: {
    filterGoodsType(val) {
      switch (Number(val)) {
        case 1:
          return "酒店";
        case 2:
          return "汽車";
        case 3:
          return "票券";
        default:
          return "";
      }
    },
    filterStatus(val) {
      //                0=未付款
      // 				1=已付款
      // 				5=未兑换
      // 				10=已兑换
      // 				15=已过期
      // 				20=退货中
      // 				25=已退货
      switch (Number(val)) {
        case 0:
          return "未付款";
        case 1:
          return "已付款";
        case 5:
          return "未兑换";
        case 10:
          return "已兑换";
        case 15:
          return "已过期";
        case 20:
          return "退货中";
        case 25:
          return "已退货";
        default:
          return "";
      }
    },
    filterPay(val) {
      switch (Number(val)) {
        case 1:
          return "支付寶";
        case 2:
          return "微信";
        case 3:
          return "銀聯";
        case 4:
          return "線下支付";
        default:
          return "";
      }
    }
  },
  activated() {
    this.initData(); //初始化篩選下拉
    this.getOrderList(); //獲取訂單列表
  },

  methods: {
    initData() {
      let companyUrl = "company/list/name/" + 1;
      let params = {
        page: 1,
        size: -1 //請求所有數據
      };
      // 請求商家信息
      this.getAxios(companyUrl, params).then(res => {
        if (res.success) {
          if (res.data) {
            this.companyList = res.data.list;
          }
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
    },
    changeFilter() {
      this.getOrderList();
    },
    formatMyTime(val) {
      if (Number(val)) {
        return formatTime(Number(val));
      } else if (!val || isNaN(Number(val))) {
        return "";
      }
    },
    formatrange(startTime, endTime) {
      if (startTime && endTime) {
        return (
          formatDate(Number(startTime)) + "~" + formatDate(Number(endTime))
        );
      } else {
        return "";
      }
    },
    // 修改訂單狀態
    changeOrder(detail) {
      if (!detail.id) {
        return;
      }
      let url = "order/change/pay/" + detail.id;

      this.$confirm("是否確認已付款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.putAxios(url, {}).then(res => {
            if (res.success) {
              this.isShowDetail = false;
               this.$message.success("訂單狀態已修改");
               this.getOrderList();
             
            } else {
              this.$message.error(
                this.$codeMap.codeMap[String(res.code)] || res.message
              );
            }
          });
        })
        .catch(() => {});
    },

    async getOrderList() {
      let params = { size: this.pageSize, page: this.currentPage };

      //沒有輸入訂單編號 則按下拉進行篩選
      if (!this.filter.keyword) {
        if (this.filter.companyId !== "") {
          params.companyId = this.filter.companyId;
        }
        if (this.filter.goodsType !== "") {
          params.goodsType = this.filter.goodsType;
        }
        if (this.filter.orderStatus !== "") {
          params.orderStatus = this.filter.orderStatus;
        }
      } else {
        params.keyword = this.filter.keyword;
      }

      let url = "order/list/" + this.currentPage;
      //篩選參數處理
      this.getAxios(url, params).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.orderList = res.data.list;
            this.pageTotal = res.data.totalCount;
          }
        } else {
          this.$message.error(
            this.$codeMap.codeMap[String(res.code)] || res.message
          );
        }
      });
    },
    // 查看訂單詳情
    detailClick(index, row) {
      this.detail = row;

      this.detail.showDetailTitle = row.companyName
        ? row.companyName
        : "訂單詳情";
      this.isShowDetail = true;
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  border: 1px solid rgba(224, 229, 237, 1);
  border-radius: 0px 0px 4px 4px;
}
.filterRow {
  background: rgba(245, 247, 250, 1);
  padding: 5px 10px;
}

.detailBase {
  position: relative;
  background: rgba(245, 247, 250, 1);
  border-radius: 4px;
  padding: 8px 15px;
  margin-top: -15px;
  color: #000;
  font-size: 16px;
  line-height: 2;

  .status {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    line-height: 60px;
    border: 1px solid #66cc00;
    border-radius: 50%;
    color: #66cc00;
    font-size: 14px;
    text-align: center;
    transform: rotate(-15deg);
    -ms-transform: rotate(-15deg); /* Internet Explorer */
    -moz-transform: rotate(-15deg); /* Firefox */
    -webkit-transform: rotate(-15deg); /* Safari 和 Chrome */
    -o-transform: rotate(-15deg); /* Opera */
  }
  .status-img {
    position: absolute;
    top: 0;
    right: 15px;
  }
}
.item {
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: space-between;
  .showImg {
    width: 100px;
    height: 100px;
  }
  .name {
    margin: 0 20px;
    min-width: 280px;
  }
}
.price {
  color: red;
  flex: 1;
}
.big {
  font-size: 16px;
  line-height: 2;
}
.small {
  color: rgba(153, 153, 153, 1);
  line-height: 1.8;
}
.payInfo {
  padding: 10px 0;
  position: relative;
  border-bottom: 1px solid #e5e5e5;
  p {
    line-height: 1.8;
  }
  .arrow {
    position: absolute;
    background: #fff;
    right: 5%;
    bottom: -6px;
    color: #e5e5e5;
    font-size: 16px;
  }
}
.line {
  height: 10px;
  background: rgba(245, 245, 245, 1);
  margin-left: -20px;
  margin-right: -20px;
}
.orderInfo {
  padding-top: 15px;
}
</style>