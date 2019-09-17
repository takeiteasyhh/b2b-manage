
export default {
    state:{
        menuList:[],
        userInfo:null,//用户信息
        userLimit:null,//用户权限
    },
    getters:{
        menuListGet:(state)=>state.menuList,
        userInfoGet:(state)=>{
            if(!state.userInfo){
                state.userInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
            }
            return state.userInfo
        },
        userLimitGet:(state)=>{
            if(!state.userLimit){
                state.userLimit = JSON.parse(localStorage.getItem("userLoginLimit"));
            }
            return state.userLimit
        }
    },
    mutations:{
        SET_MENU_LIST(state,list){
            state.menuList = list
        },
        SET_USERINFO(state,userInfo){
            localStorage.setItem("userLoginInfo",JSON.stringify(userInfo));
            state.userInfo = userInfo;
        },//权限
        SET_USERLIMIT(state,limit){
            localStorage.setItem("userLoginLimit",JSON.stringify(limit));
            state.userLimit = limit;
        }
    },
    actions:{
        setMenuList({ commit },list){
            commit("SET_MENU_LIST",list)
        },
        setUserInfo({commit},info){
            commit("SET_USERINFO",info)
        },
        setUserLimit({commit},limit){
            commit("SET_USERLIMIT",limit)
        },
    }
}