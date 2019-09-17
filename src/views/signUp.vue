<template>
  <div class="login">
    <div class="loginBoxDiv">
      <div class="loginHead">新项目管理系统</div>

      <div class="loginBox">
        <h3 class="title text-center">注册</h3>
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm">
          <el-form-item label prop="account" size="medium" >
            <el-input
              v-model="loginForm.account"
              placeholder="請輸入用戶名"
            >
            <template slot="prepend"><i class="icon iconfont iconyonghuming"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="name" size="medium" >
            <el-input
              v-model="loginForm.name"
              placeholder="請輸入暱稱"
            ><template slot="prepend"><i class="icon iconfont iconyonghuming"></i></template></el-input>
          </el-form-item>

          <el-form-item label prop="password1" size="medium">
            <el-input
            
              class="inputTxt"
              type="password"
              v-model="loginForm.password1"
              placeholder="請輸入您的密碼"
              autocomplete="off"
            ><template slot="prepend"><i class="icon iconfont iconmima"></i></template></el-input>
          </el-form-item>
          <el-form-item label prop="password" size="medium">
            <el-input
              class="inputTxt"
              type="password"
              v-model="loginForm.password"
              placeholder="請再次輸入密碼"
              autocomplete="off"
            ><template slot="prepend"><i class="icon iconfont iconmima"></i></template></el-input>
          </el-form-item>

          <el-form-item label size="medium" prop="vCode">
            <el-input
              class="inputTxt"
              v-model="loginForm.vCode"
              placeholder="請輸入驗證碼"
            > <template slot="suffix">
              <span style="color:#4594FC;cursor: pointer;line-height: 50px;"  @click="getCode">獲取驗證碼</span>
              </template> 
            <template slot="prepend"><i class="icon iconfont iconcode"></i></template>
             
            </el-input>
          </el-form-item>

          <el-form-item class="btnList text-center">
            <el-button
              type="primary"
              @click="signUpApi('loginForm')"
              style="background-color: #0D58BA;font-size:20px;width:100%;padding:16px 20px;"
            >注册</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="signUp">
        已有账号
        <router-link :to="{ name: 'login'}">点击登录</router-link>
      </div>
    </div>

    <div class="footer">
      <div>新项目管理系统</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginForm.password !== "") {
          this.$refs.loginForm.validateField("password");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.password1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        password: "",
        password1: ""
      },
      rules: {
        account: [
          {
            required: true,
            message: "請輸入用戶名",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "請輸入暱稱",
            trigger: "blur"
          }
        ],
        vCode: [
          {
            required: true,
            message: "請輸入驗證碼",
            trigger: "blur"
          }
        ],
        password1: [
          { validator: validatePass, trigger: "blur" },
          { min: 6, max: 20, message: "密碼長度在6到20個字符", trigger: "blur" }
        ],
        password: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  mounted() {
    let _this = this;
    document.onkeydown = function(event) {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        // 按下enter则登录
        _this.signUpApi("loginForm");
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    signUpApi(formName) {
     
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.loginForm.password !== this.loginForm.password1) {
            this.$message.error("兩次輸入的密碼不一致");
          }
          this.postAxios("user", this.loginForm).then(res => {
            if (res.success) {
              this.$message("註冊成功，將跳轉到登錄頁");
              setTimeout( () =>{
                 this.$router.push({
                  name: "login",params: {account:this.loginForm.account,password:this.loginForm.password}
                });
              }, 1000);
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
    forgetPassword() {},
    getCode() {
      sessionStorage.setItem("setSession", "setSession"); //存放session中如果退出浏览器会退回登录页面
      this.$cookies.set("cookieLogin", "loginCookie", 60 * 60); //登录之后cookieLogin有效期是60分钟，如果有axios操作重新计时
      // 根據用戶名獲取驗證碼
      if (!this.loginForm.account) {
        this.$message.error("請先填寫用戶名");
        return false;
      }
      var params = {
        account: this.loginForm.account
      };
      this.getAxios("sendEmail/" + params.account, params).then(res => {
        console.log(res);
        if (res.success) {
          this.$message({
            message: "驗證碼已發送到郵箱，請查收",
            type: "success"
          });
        }else {
              this.$message.error(
                this.$codeMap.codeMap[String(res.code)] || res.message
              );
            }
      });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.iconfont {
  font-size: 24px;
  margin-right:0;
  color:#fff;
}
/deep/.el-input-group__prepend{
    background-color: rgba(204,204,204,1);
}
.loginHead {
  margin-bottom: 10px;
}
.loginBox {
  width: 340px;
  padding: 40px;
  border-radius: 4px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 2px 3px 10px 0px rgba(193, 193, 193, 0.28);

  .forget {
    margin-top: -20px;
    color: #666666;
  }
  .forget:hover {
    cursor: pointer;
  }
}

.login {
  display: flex;
  justify-content: center;
  align-items: Center;
  height: 100%;

  .loginHead {
    text-align: center;
    font-size: 1.8rem;
    color: #0d58ba;
  }

  h3.title {
    margin-top: 0;
    font-size: 24px;
    font-weight: 400;
  }

  .inputTxt {
    height: 50px;
  }

  .signUp {
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    margin-top: 15px;
    color: rgba(51, 51, 51, 1);
  }

  background: linear-gradient(to top, #e1e6ee, #fff);
}

.footer {
  color: #909399;
  font-size: 16px;
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  line-height: 26px;
  color: rgba(51, 51, 51, 1);
}
</style>
