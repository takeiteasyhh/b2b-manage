<template>
  <div>
    <div id="feedbackDataTable">
      <el-table
        :data="productlist"
        style="width: 100%;"
        :max-height="getMaxHeight"
        :height="getMaxHeight"
      >
        <el-table-column
          prop="company.companyName"
          label="所屬商家"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="商品图" width="130">
          <template slot-scope="scope">
            <img
              :src="imgUrl+scope.row.photosList[0]"
              alt="预览图"
              style=" width: 100px;height: 100px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="160" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="goodsSkus.originalPrice" label="原始价格" width="120">
          <template slot-scope="scope">{{'MOP $'+scope.row.goodsSkus.originalPrice}}</template>
        </el-table-column>
        <el-table-column label="售卖价格" width="120">
          <template slot-scope="scope">
            <span style="color:red">{{'MOP $'+scope.row.goodsSkus.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsSkus.quantity" label="库存" width="100"></el-table-column>
        <el-table-column prop="validity" label="使用周期" width="100"></el-table-column>
        <el-table-column label="有效期" width="180">
          <template
            slot-scope="scope"
          >{{ formatrange(scope.row.goodsSkus.startDate,scope.row.goodsSkus.endDate)}}</template>
        </el-table-column>

        <el-table-column align="right" width="auto">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="editClick(scope.$index, scope.row)">編輯</el-button>

            <el-button
              type="primary"
              plain
              @click="changeClick(scope.$index, scope.row)"
            >{{scope.row.status==1?"下架商品":"上架商品"}}</el-button>
            <el-button type="danger" plain @click="deleteClick(scope.$index, scope.row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationBottom">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[25, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="pageTotal"
      ></el-pagination>
    </div>
    <el-dialog title="編輯商品" :visible.sync="dialogFormVisible" top="5vh">
      <el-form
        :model="productForm"
        ref="productForm"
        :rules="rules"
        label-width="110px"
        class="productForm"
      >
        <el-form-item label="商品規格：" prop="spmId">
          <el-select v-model="productForm.spmId" @change="selectLevel" placeholder="請選擇">
            <el-option
              v-for="(item,index) in goodsLevelOpts"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span
                style="float: right; color: #a6a6a6; font-size: 13px"
                @click.stop="deleteLevel(item.id,index)"
              >
                <i class="el-icon-error"></i>
              </span>
            </el-option>
          </el-select>
          <span class="addTip" @click="showAddLevel">+新增規格</span>
        </el-form-item>

        <el-form-item label="商品等級：" prop="goodsLevel">
          <el-select v-model="productForm.goodsLevel" placeholder="請選擇">
            <el-option
              v-for="(item,index) in priorityOpts"
              :key="index"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名稱：" prop="goodsName">
          <el-input v-model="productForm.goodsName"></el-input>
        </el-form-item>

        <el-form-item label="商品原價：" prop="originalPrice" class="is-required">
          <el-input type="number" v-model="productForm.goodsSkus.originalPrice" :min="0">
            <span slot="suffix" style="color:#333333">MOP$</span>
          </el-input>
        </el-form-item>

        <el-form-item label="商品售價：" prop="price" class="is-required">
          <el-input type="number" v-model="productForm.goodsSkus.price" :min="0">
            <span slot="suffix" style="color:#333333">MOP$</span>
          </el-input>
        </el-form-item>
        <el-form-item label="商品庫存：" prop="quantity" class="is-required">
          <el-input type="number" v-model="productForm.goodsSkus.quantity" :min="0"></el-input>
        </el-form-item>
        <el-form-item label="使用週期：" prop="validity">
          <el-input type="number" v-model="productForm.validity">
            <span slot="suffix" style="color:#333333">天</span>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期：" class="is-required">
          <el-date-picker
            type="date"
            placeholder="請選擇日期"
            v-model="productForm.goodsSkus.startDate"
            value-format="timestamp"
          ></el-date-picker>
          <span>至</span>
          <el-date-picker
            type="date"
            placeholder="請選擇日期"
            v-model="productForm.goodsSkus.endDate"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商品圖片：">
          <div class="area">
            <p class="tip">·建议图片上传750X270px，单张图片不得超过10M</p>
            <p class="tip">·图片至少上传1张，支持jpg、png格式</p>
            <div class="imgBox">
              <el-upload
                :action="imgUploadUrl"
                :file-list="fileList"
                :limit="6"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-success="succeccUpload"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-row style="overflow: auto; text-align: center;"></el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProduct('productForm')">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- 新增規格彈窗 -->
    <el-dialog :visible.sync="showLevelDialog" title="添加規格" custom-class="smallDialog" center>
      <el-form :model="levelForm" ref="levelForm" :rules="levelRules">
        <div class="center-form">
          <p class="ttl">規格</p>
          <el-form-item label size="medium" prop="name">
            <el-input v-model="levelForm.name" maxlength="10"></el-input>
          </el-form-item>
          <p class="tip">限十個字符以內</p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="medium"
          round
          @click="addLevel('levelForm')"
          style="padding:10px 30px;"
        >確認</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/config/config.js";
import { getClientHeight, formatDate } from "@/libs/common.js";
import options from "@/libs/message";

export default {
  name: "productList",
  data() {
    var validateDate = (rule, value, callback) => {
      if (!this.productForm.goodsSkus.originalPrice) {
        callback(new Error("請輸入商品原價"));
      }
      callback();
    };
    var validatePrice = (rule, value, callback) => {
      if (!this.productForm.goodsSkus.price) {
        callback(new Error("請輸入商品價格 "));
      }
      callback();
    };
    var validateQuantity = (rule, value, callback) => {
      if (!this.productForm.goodsSkus.quantity) {
        callback(new Error("請輸入商品庫存"));
      }
      callback();
    };
    return {
      imgUrl: config.IMAGE_URL,
      imgUploadUrl: config.IMAGE_URL + "uploadImage",
      activeName: "hotel",
      currentPage: 1,
      pageTotal: 0,
      pageSize: 10,
      productlist: [],
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,

      showLevelDialog: false,
      goodsTypeOpts: options.goodsTypeOpt,
      goodsLevelOpts: [],
      priorityOpts: options.priorityOpts,

      fileList: [], //已上傳的文件信息
      fileMap: [],
      productForm: {
        //編輯商品的信息
        id: null,
        companyId: null,
        goodsType: null,
        goodsLevel: null,
        spmId: null,
        goodsSpmName: "",
        goodsName: "",
        validity: null,
        photosList: [], //圖片路徑數組
        goodsSkus: {
          originalPrice: null,
          price: null,
          quantity: null,
          startDate: new Date().getTime(),
          endDate: new Date().getTime()+24*60*60*1000,
        }
      },
      rules: {
        goodsName: [
          { required: true, message: "請輸入商品名稱", trigger: "blur" }
        ],
        companyPhone: [
          { required: true, message: "請輸入聯繫方式", trigger: "blur" }
        ],
        originalPrice: [
          { validator: validateDate, trigger: "blur" }
          // { required: true, message: "請輸入商品原價", trigger: "blur" }
        ],
        price: [{ validator: validatePrice, trigger: "blur" }],
        quantity: [{ validator: validateQuantity, trigger: "blur" }],
        spmId: [
          { required: true, message: "請選擇商品規格", trigger: "change" }
        ],
        goodsLevel: [
          { required: true, message: "請選擇商品等級", trigger: "change" }
        ]
      },
      levelForm: { name: "" },
      levelRules: {
        name: [{ required: true, message: "請輸入規格名稱", trigger: "blur" }]
      },
      allLevel: {
        //酒店，汽車，票圈對應的商品規格下拉
        1: [],
        2: [],
        3: []
      }
    };
  },
  props: ["currentType", "search"], //1=酒店 2=车 3=票卷
  activated() {
    // this.getProductList();
  },
  mounted() {},
  computed: {
    getMaxHeight() {
      return getClientHeight() - 250;
    }
  },
  methods: {
    addProduct() {
      this.$router.push({ name: "addProduct" });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (val < this.pageTotal) {
        this.getProductList();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProductList();
    },
    async getProductList() {
      let params = { size: this.pageSize, page: this.currentPage };
      if (this.currentType) {
        params.goodsType = this.currentType;
      }
      if (this.search && this.search.keyword) {
        params.keyword = this.search.keyword;
      }
      params._t = new Date().getTime();
      let url = "goods/list/" + this.currentPage;
      this.getAxios(url, params)
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.productlist = res.data.list;
              this.pageTotal = res.data.totalCount;
            }
          } else {
            this.$message.error(
              options.codeMap[String(res.code)] || res.message
            );
          }
        })
        .catch(r => {
          //異常捕獲
          if (r) {
            this.$message.error(r.message | "請求超時，請刷新頁面");
          }
        });
    },
    formatrange(startTime, endTime) {
      if (startTime && endTime) {
        return (
          formatDate(Number(startTime)) + "~" + formatDate(Number(endTime))
        );
      }
    },

    // 編輯按鈕點擊事件處理
    editClick(index, data) {
      if (data.status == 1) {
        this.$message({
          message: "請先下架商品，再進行編輯",
          type: "warning"
        });
        return;
      }

      this.fileList = [];
      this.fileMap = [];
      if (data.photosList && Array.isArray(data.photosList)) {
        for (let i = 0; i < data.photosList.length; i++) {
          this.fileList.push({
            id: i + 1,
            name: data.photosList[i],
            url: config.IMAGE_URL + data.photosList[i],
            path: data.photosList[i]
          });
          this.fileMap.push({
            id: i + 1,
            name: data.photosList[i],
            url: config.IMAGE_URL + data.photosList[i],
            path: data.photosList[i]
          });
        }
      }
      this.productForm = data;
      this.changeType();
      this.dialogFormVisible = true;
    },
    // 上架 下架按鈕點擊事件處理
    changeClick(index, data) {
      var params = {
        id: data.id,
        status: 0
      };
      var msg = "下架成功";
      if (data.status == 0) {
        params.status = 1;
        msg = "上架成功";
      }

      this.putAxios("goods/status/" + data.id, params).then(res => {
        if (res.success) {
          this.$message({ message: msg, type: "success" });
          this.getProductList();
        } else {
          this.$message({
            message: options.codeMap[String(res.code)] || res.message,
            type: "warning"
          });
        }
      });
    },
    // 刪除商品
    deleteClick(index, data) {
      var params = {
        id: data.id,
        status: 5
      };
      this.$confirm("是否確認刪除該商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.putAxios("goods/status/" + data.id, params).then(res => {
            if (res.success) {
              this.$message({ message: "商品已刪除", type: "success" });
              // this.getProductList();
              this.productlist.splice(index, 1);
            } else {
              this.$message({
                message: options.codeMap[String(res.code)] || res.message,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },

    handleRemove(file, fileList) {
      console.log(this.fileList);
      for (var i = 0; i < this.fileMap.length; i++) {
        if (file.id == this.fileMap[i].id) {
          this.fileMap.splice(i, 1);
        }
      }
    },
    //上传的图片 类型和大小校验
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isRightType) {
        this.$message.error("上传的图片只能是 JPG/png 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传的图片大小不能超过 10MB!");
      }
      return isRightType && isLt10M;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    exceedFun(files, fileList) {
      this.$message({
        message: "最多只能添加六張圖片",
        type: "warning"
      });
    },
    succeccUpload(response, file, fileList) {
      if (response.success && response.data.url) {
        file.id = file.uid;
        this.fileMap.push({
          url: config.IMAGE_URL + response.data.url,
          path: response.data.url,
          name: response.data.name,
          id: file.uid
        });
        console.log(this.fileMap);
      }
    },

    // 保存商品編輯
    updateProduct(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.fileMap.length) {
            this.$message({
              message: "请至少上传一张图片",
              type: "warning"
            });
          } else {
            // 處理商品圖片的地址信息
            let photosListTemp = [];
            for (var i = 0; i < this.fileMap.length; i++) {
              photosListTemp.push(this.fileMap[i].path);
            }
            this.productForm.photosList = photosListTemp;
            this.productForm.goodsUrl = photosListTemp[0]; //第一張作為默認圖

            this.putAxios(
              "goods/" + this.productForm.id,
              this.productForm
            ).then(res => {
              if (res.success) {
                this.$message({ message: "修改成功", type: "success" });
                this.getProductList();
                this.dialogFormVisible = false; //關閉編輯彈窗
                this.fileList = [];
                this.fileMap = [];
              } else {
                this.$message({
                  message: options.codeMap[String(res.code)] || res.message,
                  type: "warning"
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 改變商品類型，修改規格下拉
    changeType() {
      let url = "goodsSpm/list/1";
      let params = {
        page: 1,
        size: -1,
        goodsType: this.productForm.goodsType
      };
      // 請求後台數據
      this.getAxios(url, params).then(res => {
        if (res.success) {
          if (res.data && res.data.list) {
            this.goodsLevelOpts = res.data.list;
          }
        }
      });
    },
    showAddLevel() {
      if (!this.productForm.goodsType) {
        this.$message.error("請先選擇商家");
      } else {
        this.showLevelDialog = true;
        this.levelForm.goodsType = this.productForm.goodsType;
      }
    },
    // 添加規格
    addLevel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "goodsSpm";
          this.postAxios(url, this.levelForm).then(res => {
            if (res.success) {
              this.$message({ message: "添加規格成功", type: "success" });
              this.showLevelDialog = false;
              this.goodsLevelOpts = res.data;
            } else {
              this.$message.error(
                options.codeMap[String(res.code)] || res.message
              );
            }
          });
        } else {
          return false;
        }
      });
    },
    // 刪除規格
    deleteLevel(id, index) {
      let url = "goodsSpm/delete/" + id;
      let params = {
        id: id
      };
      this.$confirm("是否確認刪除該商品規格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAxios(url, params).then(res => {
            if (res.success) {
              this.$message({ message: "該規格已刪除", type: "success" });
              if (params.id == this.productForm.spmId) {
                this.productForm.spmId = null;
              }
              this.goodsLevelOpts.splice(index, 1);
            } else {
              this.$message({
                message: options.codeMap[String(res.code)] || res.message,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },
    // 獲取下拉選項內容
    selectLevel(val) {
      let obj = {};
      obj = this.goodsLevelOpts.find(item => {
        return item.id == val; //筛选出匹配数据
      });
      this.productForm.goodsSpmName = obj.name;
    }
  }
};
</script>

<style lang='less' scoped>
.tab {
  background: #fff;
}
.whiteBac {
  border-top: 0;
  padding-top: 0;
}
/deep/.titleTable > div:hover {
  text-decoration: underline;
}
.productForm .el-input {
  width: 300px;
}
.productForm .el-date-editor.el-input,
.productForm .el-date-editor.el-input__inner {
  width: 220px;
}
.productForm .area {
  background: rgba(248, 248, 248, 1);
  padding: 0 14px 14px;
}
.productForm .imgBox {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(220, 223, 230, 1);
  padding: 10px;
}
.productForm .tip {
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
}
</style>