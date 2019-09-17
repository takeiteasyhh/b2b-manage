<template>
  <div class="UserInfoCenter">
    <div class="tab">
      <i class="icon iconfont iconcenter"></i>
      <span>個人中心</span>
      <!-- <el-button round type="primary" class="fr" @click="addProduct">發佈商品</el-button> -->
    </div>

    <div class="grid-content userInfoDetail">
      <p class="user-title">基本信息</p>
      <el-form
        ref="userForm"
        :model="userForm"
        size="mini"
        :rules="userFormRules"
        label-width="100px;"
      >
        <div class="userInfo">
           <el-row>
            <el-col :span="6">
              <el-form-item label="头像：">
                <el-upload
                  class="info avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="succeccUpload"
                  :before-upload="beforeImgUpload"
                >
                  <!-- <img v-if="userInfoGet.photos" :src="baseImgPath + userInfoGet.photos" class="avatar"> -->
                  <img :src="headImage" class="headerImage" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名："  prop="name">
                <el-input v-model="userForm.name" style="width:220px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性別：" >
                <el-radio-group
                  v-model="userForm.sex"
                  size="medium"
                  style="width:230px"
                >
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="電話：" prop="phone">
                <el-input
                  v-model.number="userForm.phone"               
                  maxlength="11"
                  minlength="6"
                  style="width:220px"
                ></el-input>                
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="郵箱：" prop="mail">
                <el-input v-model="userForm.mail"  style="width:220px"></el-input>           
              </el-form-item>
            </el-col>
          </el-row>         
          <el-button type="primary" @click="basisSubmitForm('userForm')">保存</el-button>
        </div>
      </el-form>
    </div>
    <div class="grid-content userInfoDetail" style="border-top:0;">
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        size="mini"
        :rules="passwordRules"
        label-width="100px"
      >
        <div class="numberInfo">
          <p class="user-title">賬號信息</p>
          <el-form-item label="賬號：" >
            <el-col :span="6">
              <el-input v-model="userInfoGet.account" :disabled="accountNumberDisabled"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="舊密碼：" prop="oldPassword">
            <el-col :span="6">
              <el-input
                v-model="passwordForm.oldPassword"
                :show-password="true" placeholder="請輸入舊密碼" 
              ></el-input>
            </el-col>           
          </el-form-item>
          <el-form-item label="新密碼：" prop="password">
            <el-col :span="6">
              <el-input placeholder="請輸入新密碼"
                v-model="passwordForm.password"             
                :show-password="true"
              ></el-input>
            </el-col>           
          </el-form-item>
          <el-form-item label="确认密码：" prop="passwordSure">
            <el-col :span="6">
              <el-input v-model="passwordForm.passwordSure" :show-password="true" placeholder="請再次確認密碼"></el-input>
            </el-col>
          </el-form-item>
        </div>
        <el-button type="primary" @click="passwordSubmitForm('passwordForm')">確認修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import config from "@/config/config.js";
export default {
  name: "UserInfoCenter",
  data() {
    const man = require("@/assets/img/man.png");
    const woman = require("@/assets/img/woman.png");

    
    //输入密码验证
    let passwordValidate = (rule, value, callback) => {
      if (value !== "") {
        this.$refs.passwordForm.validateField("passwordSure");
      }
      callback();
    };
    //再次输入密码得验证
    let passwordSureValidate = (rule, value, callback) => {
      if (value !== this.passwordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      baseImgPath: config.IMAGE_URL,
      uploadUrl: config.IMAGE_URL + "uploadImage",

      headImageList: [],
      manImg: man,
      womanImg: woman,
      userForm: {
        name:"",
        phone: "",
        mail: "",
        sex:1,
        photos: ""
        
      },
      passwordForm: {
        password: "",
        passwordSure: ""
      },
     
      accountNumberDisabled: true,
      passwordDisabled: true,

      userFormRules: {
        name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "输入电话号码", trigger: "blur" }],
        mail: [
          { type: "email", message: "请输入正确邮箱格式", trigger: "blur" }
        ]
      },
      passwordRules: {
      
        oldPassword:[
           { required: true, message: "請輸入舊密碼", trigger: "blur" }
        ],
        password: [
          { required: true, message: "請輸入新密碼", trigger: "blur" },
          { min: 6, max: 20, message: "长度在6到20个字符", trigger: "blur" },
          { validator: passwordValidate, trigger: "blur" }
        ],
        passwordSure: [
          { required: true, message: "請再次確認密碼", trigger: "blur" },
          { validator: passwordSureValidate, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["userInfoGet"]),
    upLoadData() {
      return { id: this.userInfoGet.id };
    },
    headImage() {
      let url = "";
      if (this.userInfoGet.photos) {
        url = config.IMAGE_URL + this.userInfoGet.photos;
      } else {
        url = this.userInfoGet.sex === 1 ? this.manImg : this.womanImg;
      }
      return url;
    }
  },
  activated() {
    this.setInfo();
    console.log(this.userForm)
  },
  methods: {
    setInfo() {
      this.userForm.phone = this.userInfoGet.phone;
      this.userForm.mail = this.userInfoGet.mail;
      this.userForm.name = this.userInfoGet.name;
      this.userForm.sex = this.userInfoGet.sex;
      this.userForm.photos = this.userInfoGet.photos;
      this.passwordForm.account = this.userInfoGet.account;
    },
    modify(type) {
      this[type] = false;
    },
    beforeImgUpload(file) {
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
    basisSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let json = {};
          json = this.userForm;
          json.id = this.userInfoGet.id;
          this.putAxios("user/"+ json.id, json).then(res => {
            if (res.success) {
              let j = this.userInfoGet;
              j.mail = json.mail;
              j.phone = json.phone;
              j.name = json.name;
              j.photos = json.photos;
              j.sex = json.sex;
              this.$store.dispatch("setUserInfo", j);
              this.$message({ message: "保存成功", type: "success" });
            }else{
               this.$message.error(
                this.$codeMap.codeMap[String(res.code)] || res.message
              );
            }
          });
        } else {
          return false;
        }
      });
    },
    passwordSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let j = {};
          j.id = this.userInfoGet.id;
          j.oldPassword = this.passwordForm.oldPassword;
          j.password = this.passwordForm.password;
          this.putAxios("user/change/password", j).then(res => {
            if (res.success) {
              this.$message({ message: "修改成功", type: "success" });
              // localStorage.clear();
              localStorage.removeItem('userLoginInfo');
              
            } else {
               this.$message.error(
                this.$codeMap.codeMap[String(res.code)] || res.message
              );
            }
          });
        } else {
          return false;
        }
      });
    },
    exceedFun(files, fileList) {
      this.$message({
        message: "只能添加一张图片",
        type: "warning"
      });
    },
    succeccUpload(response, file, fileList) {
      console.log(this.headImage);
      if (response.success && response.data.url) {
        this.userInfoGet.photos = response.data.url;
        // this.$store.dispatch("setUserInfo", this.userInfoGet);
        // this.$message({ message: "头像上传成功", type: "success" });
        this.userForm.photos = response.data.url;
      } else {
        this.$message.error("上传头像失败！");
      }
    }
  }
};
</script>

<style lang='less' scoped>
.infoLeft {
  margin-left: 10px;
}

.uploadImage {
  display: inline-block;
  position: relative;
  top: -22px;
  left: 420px;
}
.userInfo {
  padding-bottom: 10px;
}
.numberInfo {
  padding-top: 10px;
}
p.user-title {
  font-size: 14px;
  margin-bottom: 10px;
}
.userInfoShow {
  font-size: 0.6rem;
  color: #666;
}

.UserInfoCenter {
  background: #f5f5f5;
  height: 100%;
  padding: 10px;
}
.grid-content {
  background: #fff;
  border: 1px solid #ddd;
  padding: 20px;
}
.headInfo {
  background: #fff;
  padding: 16px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.headerImage {
  width: 80px;
  height: 80px;
  float: left;
  margin: 4px 14px 0 10px;
  border-radius: 50%;
}

</style>