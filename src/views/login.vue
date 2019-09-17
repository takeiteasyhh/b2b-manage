<template>
<div class="login">
    <div class="loginBoxDiv">

        <div class="loginHead">新项目管理系统</div>
        <div class="loginBox">
            <h3 class="title text-center">登录</h3>
            <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginForm">
                <el-form-item label prop="account" size="medium" style="margin-bottom:20px">
                    <el-input v-model="loginForm.account" autocomplete="off" placeholder="请输入用户名">
                          <template slot="prepend"><i class="icon iconfont iconyonghuming"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item label prop="password" size="medium">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码">
                         <template slot="prepend"><i class="icon iconfont iconmima"></i></template>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item class="forget text-right">
                    <div @click="forgetPassword('loginForm')">忘记密码？</div>
                </el-form-item> -->
                <el-form-item class="btnList text-center" size="medium">
                    <el-button type="primary" @click="loginApi('loginForm')" style="background-color: #0D58BA;font-size:20px;width:100%;padding:16px 20px;">登录</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="signUp">还没账号 <router-link :to="{ name: 'signUp'}">点击注册</router-link>
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
        return {
            loginForm: {
                account: "",
                password: ""
            },
            loginFormRules: {
                account: [{
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }]
            }
        };
    },
    mounted() {
        // 開發環境
        if (process.env.NODE_ENV === "development") {
            this.loginForm.account = "david"
            this.loginForm.password = "12"
        }
        if(this.$route.params && this.$route.params.account){
            this.loginForm.account = this.$route.params.account;         
        }
        if(this.$route.params && this.$route.params.password){
            this.loginForm.password = this.$route.params.password;         
        }
        
        let _this = this;
        document.onkeydown = function (event) {
            var e = event || window.event;
            if (e && e.keyCode == 13) { // 按下enter则登录 
                _this.loginApi('loginForm')
            }
        };
    },
    destroyed() {
        document.onkeydown = null;
    },
    methods: {
        loginApi(formName) {

            this.$refs[formName].validate(valid => {
                if (valid) {
                    sessionStorage.setItem("setSession", "setSession"); //存放session中如果退出浏览器会退回登录页面
                    this.$cookies.set("cookieLogin", "loginCookie", 60 * 60); //登录之后cookieLogin有效期是60分钟，如果有axios操作重新计时
                    this.postAxios("user/login", this.loginForm).then(res => {
                        if (res.success) {   
                            //token 存储到localStorage
                            // localStorage.setItem("projectManageToken", res.data.token);                         
                            this.$store.dispatch("setUserInfo", {token:res.data.token});
                            this.$router.push({ name: "home"});  
                            this.getAxios("user/my/information", {_t:new Date().getTime()}).then(_res => {
                                // 请求用户信息后再跳转到首页
                                if (_res.success) {
                                    _res.data.token = res.data.token;
                                     
                                    // this.$router.push({ name: "home"});   
                                     this.$store.dispatch("setUserInfo", _res.data);                   
                                } else {
                                    this.$message.error(this.$codeMap.codeMap[String(_res.code)] || _res.message);
                                }
                            });
                        } else {               
                            this.$message.error(this.$codeMap.codeMap[String(res.code)] || res.message);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        forgetPassword() {}
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
        color: #0D58BA;
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
