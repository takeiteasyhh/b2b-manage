<template>
  <div>
    <div class="tab">
      <i class="icon iconfont iconshangpin"></i>
      <span>發佈商品</span>
    </div>

    <div class="whiteBac">
      <el-row style="min-width: 600px;">
        <el-col :span="14">
          <el-form
            :model="productForm"
            ref="productForm"
            :rules="rules"
            label-width="110px"
            class="form proForm"
          >
            <el-form-item label="選擇商家：" prop="companyId" >
              <el-select v-model="productForm.companyId" placeholder="請選擇"   @change="changeCompany">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"         
                ></el-option>
              </el-select>
              <span class="addTip" @click="showAddShop = true">+新增商家</span>
            </el-form-item>
            <el-form-item label="商品類型：" prop="goodsType">
              <el-select disabled
                v-model="productForm.goodsType"
                filterable
                placeholder="請選擇"
                @change="changeType"
              >
                <el-option
                  v-for="item in goodsTypeOpts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :change="changeType"
                ></el-option>
              </el-select>
            </el-form-item>
                     
            <el-form-item label="商品規格：" prop="spmId">
              <el-select v-model="productForm.spmId"   @change="selectLevel" placeholder="請選擇"  >
                <el-option
                  v-for="(item,index) in goodsLevelOpts"
                  :key="index"
                  :label="item.name"
                  :value="item.id"   
                >
                 <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #a6a6a6; font-size: 13px" @click.stop="deleteLevel(item.id,index)"><i class="el-icon-error"></i></span>
                </el-option>
              </el-select>
               <span class="addTip" @click="showAddLevel">+新增規格</span>
            </el-form-item>

               <el-form-item label="商品等級：" prop="goodsLevel">
              <el-select v-model="productForm.goodsLevel"  placeholder="請選擇"  >
                <el-option  v-for="(item,index) in priorityOpts" :key="index"
                  :value="item.id"  :label="item.name" 
                >       
                </el-option>
              </el-select>             
            </el-form-item>
            <el-form-item label="商品名稱：" prop="goodsName" required>
              <el-input v-model="productForm.goodsName"></el-input>
            </el-form-item>

            <el-form-item label="商品原價：" prop="originalPrice" class="is-required">
              <el-input type="number" v-model.number="productForm.goodsSkus.originalPrice" :min="0">
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
              <el-input v-model="productForm.validity">
                <span slot="suffix" style="color:#333333">天</span>
              </el-input>
            </el-form-item>
            <el-form-item label="有效期：" class="is-required">
              <el-form-item prop="date1" style="display:inline-block;width:220px;">
                <el-date-picker
                  type="date"
                  placeholder="請選擇日期"
                  v-model="productForm.goodsSkus.startDate"
                  value-format="timestamp"
                ></el-date-picker>
              </el-form-item>
              <span>至</span>
              <el-form-item prop="date2" style="display:inline-block;">
                <el-date-picker
                  type="date"
                  placeholder="請選擇日期"
                  v-model="productForm.goodsSkus.endDate"
                  value-format="timestamp"
                ></el-date-picker>
              </el-form-item>
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

            <el-form-item>
              <el-button type="primary" size="medium" @click="submitForm('productForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 图片预览弹窗 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>

      <!-- 新增商家弹窗 -->
      <el-dialog title="新增商家" :visible.sync="showAddShop">
        <addShop  @closeShopDialog = "closeShopDialog" @addShopCallback = "addShopCallback"></addShop>
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
          <el-button type="primary" size="medium" round @click="addLevel('levelForm')" style="padding:10px 30px;">確認</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import config from "@/config/config.js";
import options from "@/libs/message";
import addShop from "@/views/shopList/addShop.vue"

export default {
  data() {
     var validateDate = (rule, value, callback) => {
        if (!this.productForm.goodsSkus.originalPrice ) {
          callback(new Error('請輸入商品原價'));
        }
          callback();
        
      };
      var validatePrice = (rule, value, callback) => {
        if (!this.productForm.goodsSkus.price ) {
          callback(new Error('請輸入商品價格 '));
        }
          callback();
      
      };
      var validateQuantity = (rule, value, callback) => {
        if (!this.productForm.goodsSkus.quantity ) {
          callback(new Error('請輸入商品庫存'));
        }
          callback();     
      };

      var validateDate2 =  (rule, value, callback) => {
        if (this.productForm.goodsSkus.endDate < this.productForm.goodsSkus.startDate) {
          callback(new Error('結束時間不可小於開始時間'));
        }
          callback();     
      };

    return {
      baseImgPath: config.IMAGE_URL,
      imgUploadUrl: config.IMAGE_URL + "uploadImage",
      dialogImageUrl: "",
      dialogVisible: false,
      showLevelDialog:false,
      goodsTypeOpts: options.goodsTypeOpt,
      goodsLevelOpts: [],
      priorityOpts: options.priorityOpts,
      companyList: [],
      fileList: [], //已上傳的文件信息
      fileMap: [],
      productForm: {
        companyId: null,
        goodsType: null,
        goodsLevel: null,    
        spmId :null,
        goodsSpmName:"",
        goodsName: "",
        validity: null,
        photosList: [], //圖片路徑數組
        goodsSkus: {
          originalPrice: null,
          price: null,
          quantity: null,
          startDate: new Date().getTime(),
          endDate: new Date().getTime()+24*60*60*1000
        }
      },
      rules: {
        companyId: [
            { required: true, message: '請選擇商家', trigger: 'change' }
          ],
        goodsType: [
            { required: true, message: '請選擇商品類型', trigger: 'change' }
          ],
        goodsName: [
          { required: true, message: "請輸入商品名稱", trigger: "blur" }
        ],
        companyPhone: [
          { required: true, message: "請輸入聯繫方式", trigger: "blur" }
        ],
       originalPrice: [
          { validator: validateDate, trigger: "blur" }
        ],
        price: [  { validator: validatePrice, trigger: "blur" }],
        quantity: [
           { validator: validateQuantity, trigger: "blur" }
        ],
        // date2: [
        //    { validator: validateDate2, trigger: "change" }
        // ],
        spmId: [
          { required: true, message: "請選擇商品規格", trigger: "change" }
        ],
        goodsLevel: [
          { required: true, message: "請選擇商品等級", trigger: "change" }
        ]
      },
      showAddShop: false,
      levelForm:{name:""},
      levelRules:{
         name:[
          { required: true, message: "請輸入規格名稱", trigger: "blur" }
        ],
      },
      allLevel:{ //酒店，汽車，票圈對應的商品規格下拉
        1:[], 
        2:[],
        3:[]
      }
    };
  },
  components:{
    addShop
  },
  created() {
    //獲取初始化數據
    this.initData();
  },
  methods: {
    initData() {
      let companyUrl = "company/list/" + 1;
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
        } else {
          this.$message.error(options.codeMap[String(res.code)] || res.message);
        }
      });
    },
   
    //修改商家時候
    changeCompany(val){
      for(let i= 0;i<this.companyList.length;i++)
      {
        if(this.companyList[i].id == val){
          this.productForm.goodsType = this.companyList[i].goodsType;
          this.changeType();
          return true;
        }
      }
       
    },
     // 改變商品類型，修改規格下拉
    changeType() {
     let url = "goodsSpm/list/1";
     let params = {
       page:1,
       size:-1,
       goodsType:this.productForm.goodsType
     }
    // 請求後台數據
     if(!this.allLevel[this.productForm.goodsType] ||!this.allLevel[this.productForm.goodsType].length ){
         this.getAxios(url, params).then(res => {
        if (res.success) {
          if (res.data && res.data.list) {
              this.allLevel[this.productForm.goodsType] = res.data.list;
              this.goodsLevelOpts = res.data.list;
          }
        }
      });  
     }else{ //請求過數據，則不再請求
       this.goodsLevelOpts = this.allLevel[this.productForm.goodsType];
     }
    },
    showAddLevel(){
      if(!this.productForm.goodsType){
        this.$message.error("請先選擇商家");
      }else{
        this.showLevelDialog = true;
        this.levelForm.goodsType = this.productForm.goodsType;
      }
    
    },
    // 添加規格
    addLevel(formName){
      this.$refs[formName].validate(valid => {
        if (valid) { 
          let url ="goodsSpm";
            this.postAxios(url, this.levelForm).then(res => {
              if (res.success) {
                this.$message({ message: "添加規格成功", type: "success" });
                this.showLevelDialog = false;
                this.allLevel[this.levelForm.type] = res.data;
                this.goodsLevelOpts=  res.data;
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
    deleteLevel(id,index){
      let url = "goodsSpm/delete/"+id;
       let params = {
        id:id
      };
       this.$confirm("是否確認刪除該商品規格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }) .then(() => {
        this.deleteAxios(url, params).then(res => {
        if (res.success) {
          this.$message({ message: "該規格已刪除", type: "success" });
          if(params.id == this.productForm.spmId){
            this.productForm.spmId = null;
          }
          this.goodsLevelOpts.splice(index,1);
          this.allLevel[this.productForm.goodsType] =  this.goodsLevelOpts 
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
    selectLevel(val){
      let obj = {};
      obj = this.goodsLevelOpts.find((item)=>{
          return item.id == val;//筛选出匹配数据
      });
      this.productForm.goodsSpmName = obj.name;
    },
    // 刪除圖片
    handleRemove(file, fileList) {
      console.log(this.fileList);
      for (var i = 0; i < this.fileMap.length; i++) {
        if (file.id == this.fileMap[i].id) {
          this.fileMap.splice(i, 1);
        }
      }
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

    // 提交商品
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(this.fileMap);
        if (valid) {
          if (!this.fileMap.length) {
            this.$message({
              message: "请至少上传一张图片",
              type: "warning"
            });
          } else {
            let photosListTemp = [];
            for (var i = 0; i < this.fileMap.length; i++) {
              photosListTemp.push(this.fileMap[i].path);
            }
            this.productForm.photosList = photosListTemp;
            this.productForm.goodsUrl = photosListTemp[0];//第一張作為默認圖

            this.postAxios("goods", this.productForm).then(res => {
              if (res.success) {
                this.$message({ message: "添加成功", type: "success" });
                this.fileList = [];
                this.fileMap = [];
                this.productForm = {
                  companyId: null,
                  goodsType: 1,
                  goodsLevel: 1,
                  goodsName: "",
                  validity: null,
                  photosList: [], //圖片路徑數組
                  goodsSkus: {
                    originalPrice: null,
                    price: null,
                    quantity: null,
                    startDate: new Date().getTime(),
                    endDate: new Date().getTime()
                  }
                };

                this.$router.back(-1); //跳轉回首頁
              } else {
                this.$message({
                  message: res.message,
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
   
    // 關閉彈窗
    closeShopDialog(){
      this.showAddShop = false;
    },
    addShopCallback(){
      // 重新獲取商家下拉
        this.initData();
    }
    
  }
};
</script>

<style  lang="less" scoped>

.el-input {
  width: 300px;
}
.el-date-editor.el-input,
.proForm .el-date-editor.el-input__inner {
  width: 220px;
}
.proForm .area {
  background: rgba(248, 248, 248, 1);
  padding: 0 14px 14px;
}
.proForm .imgBox {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(220, 223, 230, 1);
  padding: 10px;
}
.proForm .tip {
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
}




</style>
