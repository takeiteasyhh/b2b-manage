<template>
  <div>
    <el-form
      :model="shopForm"
      ref="shopForm"
      :rules="shopRules"
      label-width="110px"
      class="shopDialog"
    >
      <el-form-item label="商家名稱：" prop="companyName">
        <el-input v-model="shopForm.companyName"></el-input>
      </el-form-item>
      <el-form-item label="商品類型：" prop="goodsType">
        <el-select v-model="shopForm.goodsType" filterable placeholder="請選擇">
          <el-option
            v-for="item in goodsTypeOpts"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="shopForm.goodsType===1" label="商品星級">
        <el-rate v-model="shopForm.star" style="margin-top:5px;"></el-rate>
      </el-form-item>

      <el-form-item label="聯係方式：" prop="companyPhone" class="hasPrefix">
        <el-input v-model.number="shopForm.companyPhone" maxlength="11" minlength="6">
          <i slot="prefix" style="color:rgba(51,51,51,1);">+853</i>
        </el-input>
      </el-form-item>
      <el-form-item label="郵箱：" prop="email">
        <el-input v-model="shopForm.email"></el-input>
      </el-form-item>
      <el-form-item label="商家地址：" prop="address">
        <el-input v-model="shopForm.address"></el-input>
      </el-form-item>
      <el-form-item label="負責人名稱：" prop="name">
        <el-input v-model="shopForm.name"></el-input>
      </el-form-item>
      <el-form-item label="負責人電話：" prop="phone">
        <el-input v-model="shopForm.phone">
          <i slot="prefix" style="color:rgba(51,51,51,1);">+853</i>
        </el-input>
      </el-form-item>
      <el-form-item label="商家圖片：">
        <div>
          <el-upload
            class="avatar-uploader"
            :action="imgUploadUrl"
            :show-file-list="false"
            :on-success="handlecompanyImg"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="shopForm.companyImg" :src="baseImgPath + shopForm.companyImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="color:rgba(13,88,186,1);">上傳商家圖片</p>
        </div>
      </el-form-item>
      <el-form-item label="商家介紹：" prop="introduction">
        <el-input type="textarea" v-model="shopForm.introduction" maxlength="300" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="資質證書（營業執照）：">
        <div>
          <el-upload
            class="avatar-uploader"
            :action="imgUploadUrl"
            :show-file-list="false"
            list-type="picture"
            :on-success="handleShopAvatarScucess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="shopForm.businessLicense"
              :src="baseImgPath + shopForm.businessLicense"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="color:rgba(13,88,186,1);">上傳證書照片</p>
        </div>
      </el-form-item>
      <el-form-item label="公司加盟到期時間：" label-width="150px">
        <el-date-picker
          type="date"
          placeholder="請選擇日期"
          v-model="shopForm.createTime"
          value-format="timestamp"
        ></el-date-picker>
        <span>到</span>
        <el-date-picker
          type="date"
          placeholder="請選擇日期"
          v-model="shopForm.endTime"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="附加信息：">
        <el-input type="textarea" v-model="shopForm.extra"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="text-align:right;">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitShop('shopForm')">提 交</el-button>
    </div>
  </div>
</template>

<script>
import config from "@/config/config.js";
import options from "@/libs/message";
export default {
  data() {
    return {
      baseImgPath: config.IMAGE_URL,
      imgUploadUrl: config.IMAGE_URL + "uploadImage",
      dialogImageUrl: "",
      dialogVisible: false,
      goodsTypeOpts: this.$codeMap.goodsTypeOpt,
      shopForm: {
        companyName: "",
        companyPhone: "",
        businessLicense: "",
        companyImg: "",
        goodsType: 1,
        star: 0,
        createTime: new Date().getTime(),
        endTime: new Date().getTime() + 24 * 60 * 60 * 1000,
        advice: "",
        extra: ""
      },
      shopRules: {
        companyName: [
          { required: true, message: "請輸入商家名稱", trigger: "blur" }
        ],
        goodsType: [
          { required: true, message: "請選擇商品類型", trigger: "change" }
        ],
        companyPhone: [
          { required: true, message: "請輸入聯係方式", trigger: "blur" }
        ],
        address: [
          { required: true, message: "請輸入商家地址", trigger: "blur" }
        ],
        email: [
          { required: true, message: "請輸入郵箱", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱格式", trigger: "blur" }
        ],
        name: [
          { required: true, message: "請輸入負責人名稱", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "請輸入負責人電話", trigger: "blur" }
        ],
        introduction: [
          { max: 300, message: "长度不超過300个字符", trigger: "blur" }
        ]
      }
    };
  },
  props: {},
  methods: {
    closeDialog() {
      this.$emit("closeShopDialog", "");
    },
    // 編輯時 父組件傳值
    getData(row) {
      this.shopForm = row;
    },
    // 上传文件后保存后台返回的路径
    handleShopAvatarScucess(response, file) {
      if (response.success && response.data.url) {
        this.shopForm.businessLicense = response.data.url;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    //
    handlecompanyImg(response, file) {
      if (response.success && response.data.url) {
        this.shopForm.companyImg = response.data.url;
      } else {
        this.$message.error("上传商家图片失败！");
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
    // 保存商家
    submitShop(formName) {
      this.$refs[formName].validate(valid => {
      
        if (valid) {
          if (!this.shopForm.businessLicense) {
            this.$message({
              message: "請上傳營業執照",
              type: "warning"
            });
          } else if (!this.shopForm.companyImg) {
            this.$message({
              message: "請上傳商家圖片",
              type: "warning"
            });
          } else {
            let url = "company/";
            if (this.shopForm.id) {
              url = url + this.shopForm.id;
              this.putAxios(url, this.shopForm).then(res => {
                if (res.success) {
                  this.$message({ message: "已修改", type: "success" });
                  this.$emit("addShopCallback");
                } else {
                  this.$message.error(
                    this.$codeMap.codeMap[String(res.code)] || res.message
                  );
                }
              });
            } else {
              this.postAxios(url, this.shopForm).then(res => {
                if (res.success) {
                  this.$message({ message: "添加成功", type: "success" });
                  this.$refs[formName].resetFields();
                  this.closeDialog();
                  this.$emit("addShopCallback");
                } else {
                  this.$message.error(
                    options.codeMap[String(res.code)] || res.message
                  );
                }
              });
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
}
.el-date-editor.el-input {
  width: 220px;
}
</style>