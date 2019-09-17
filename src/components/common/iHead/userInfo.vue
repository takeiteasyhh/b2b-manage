<template>
<div class="userInfo">
    <div class="rightUserInfo">
        <el-tooltip class="item" effect="dark" content="進入個人中心" placement="bottom-end" >
            <img :src="headImage"  @click ="goUserCenter" style="cursor:pointer;" >
        </el-tooltip> 
    </div>
    <div class="leftUserInfo">
        <i class="icon iconfont icontuichu"></i>
        <span class="line" @click ="signOut">退出</span>
        <span> {{userInfoGet.name}}</span>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import config from "@/config/config.js";
export default {
    name: "UserInfo",
    data() {
        const man = require("../../../assets/img/man.png");
        const woman = require("../../../assets/img/woman.png");
        return {
            manImg: man,
            womanImg: woman,
            //控制个人信息得显隐
            userPoper: false
        };
    },
    // created(){      
    //  this.getAxios("user/my/information", {}).then(_res => {
    //   // 请求用户信息
    //   if (_res.success &&_res.data ) {
    //      let j = this.userInfoGet;
    //      j.id = _res.data.id;
    //      j.name = _res.data.name;
    //      j.account = _res.data.account;
    //      j.sex = _res.data.sex;
    //      j.phone = _res.data.phone;
    //      j.mail = _res.data.mail;       
    //      this.$store.dispatch("setUserInfo",j);      
    //   }
    // });
    // },
    computed: {
        ...mapGetters(["userInfoGet"]),
        headImage() {
            console.log(this.userInfoGet)
            let url = "";
            if (this.userInfoGet && this.userInfoGet.photos) {
                url = config.IMAGE_URL + this.userInfoGet.photos
            } else {
                url = this.userInfoGet.sex === "M" ? this.manImg : this.womanImg
            }
            return url;
        }
    },
    methods: {
        //退出登录
        signOut() {
            // localStorage.clear();
            localStorage.removeItem('userLoginInfo');
            this.$router.push({
                path: "/login"
            });
           
        },
        
        //进入个人中心
        goUserCenter() {
            this.$router.push({
                path: "/userInfoCenter"
            });
        }
    }
};
</script>

<style lang="less" scoped>
.userInfo {
    position: relative;
    padding: 10px 0 0;
}

.leftUserInfo {
    margin: 10px;
    font-size: 14px;
    .line {
        display: inline-block;
        padding-right: 15px;
        margin-right: 10px;
        border-right: 1px solid #fff;
         cursor: pointer;
    }

}

.leftUserInfo,
.rightUserInfo {
    float: right;
    text-align: right;
}

.rightUserInfo img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>
