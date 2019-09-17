export default {
    state: {
        menuChange:{},//记录菜单得变化，根据当前得路由高亮左侧的菜单
    },
    getters: {
        getNowMenu: state => state.menuChange
    },
    mutations: {
        changeNowMenu(state,menu){
            let getArr = menu.split("/");
            if(getArr.length>1){
                menu ="/"+ getArr[1];
            }
            state.menuChange = menu;
        }
    },
    actions: {

    },
}