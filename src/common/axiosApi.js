import axios from 'axios'
import {Loading} from 'element-ui'
import { Message } from 'element-ui'
import config from "@/config/config.js"
import cookies from "vue-cookies"
//请求拦截器，发送请求之前处理事件 
let loading;
axios.interceptors.request.use(function (config) {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.6)'
  });
  // this.fullscreenLoading = true;
  return config
}, function (err) {
  //请求错误时事件处理
  return Promise.reject(err)
})
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
  return response.data
}, function (err) {
  if(err.message.indexOf('timeout') !== -1){
    Message({
      message: '请求超时',
      type: 'warning',
      center: true
    })
  }
  // 对响应错误做点什么
  return Promise.reject(err)
})
// 封装数据返回失败提示函数
function errorState(response) {
  let loginUrl = process.env.NODE_ENV==="production"?"/login":"/login";

  loading.close();
  // token 失效，跳轉回登錄頁
  if(response && response.response && response.response.data.status === 50404){
    // localStorage.clear();
    localStorage.removeItem('userLoginInfo');//清除登录信息
    showTokenError();
    setTimeout(function(){
      window.location.href = loginUrl;
    },1000);
   
  }else{
    console.log(response) ; //輸出錯誤信息
  }
  // 隐藏loading
  // 如果http状态码正常，则直接返回数据
  // if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
  //   // 如果不需要除了data之外的数据，可以直接 return response.data
  //   return response
  // } else {
  //   console.log(response)
  // }
}
// 封装数据返回成功提示函数
function successState(res) {
  // --todo 路径要改
  let loginUrl = process.env.NODE_ENV==="production"?"/login":"/login";
  //getSession 如果关闭页面登录信息清空，需要重新登录
  let getSession = sessionStorage.getItem("setSession")
  //getCookie 控制如果半個小時沒有操作，需要重新登陸
  let getCookie = cookies.get("cookieLogin");
  if(!getSession||!getCookie){
    Message({
      message: '登录信息失效，请重新登录',
      type: 'warning',
      center: true
    })
    setTimeout(() => {
      window.location.href = loginUrl
    }, 1000);
  }
  sessionStorage.setItem("setSession", "setSession"); //存放session中如果退出浏览器会退回登录页面
  cookies.set("cookieLogin","loginCookie",60*60);
  
  // token失效跳转回登录页面
  // if(res.code==="2022"){
  //   localStorage.clear();
  //   showTokenError();
  //   window.location.href = loginUrl
  // }
  loading.close();
  return res
}
function showTokenError(){
  Message({
    message: 'token失效，请重新登录',
    type: 'warning',
    center: true
  });
}
function apiAxios(method, url, params,img) {
  
  //获取用户id如果存在，header中添加userId,如果不存在说明是登录状态，不用userId
  let getUserInfo = null
  if(localStorage.getItem("userLoginInfo")!=="undefined"){
    getUserInfo =JSON.parse(localStorage.getItem("userLoginInfo"))
  }
  let httpDefault = {
    method,
    baseUrl: img?config.IMAGE_URL:config.BASE_URL,
    url:img?config.IMAGE_URL+url:config.BASE_URL+url,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    // params是即将与请求一起发送的 URL 参数
    // data是作为请求主体被发送的数据
    params: method === 'GET' || method === 'DELETE' ? params : null,
    data: method === 'POST' || method === 'PUT' ? params : null,
    //请求时长
    timeout: 60000
  }

   //默认把token加到请求头
  if(getUserInfo){
    // httpDefault.headers.userId = getUserInfo.userId;
    httpDefault.headers.Authorization = getUserInfo.token;
  }


   //默认把token加到请求头
  // let token = localStorage.getItem("projectManageToken");
  // if(token && token!=="undefined" && token!= null){
  //   httpDefault.headers.Authorization = token;
  // }
  

  
  return new Promise((resolve, reject) => {
    axios(httpDefault)
      //then属于axios
      .then((res) => {
       successState(res);
        resolve(res)
      })
      .catch((err) => {
        errorState(err);
        reject(err);
      })
  })
}
// Vue的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
export default {
  install: function (Vue) {
    Vue.prototype.getAxios = (url, params) => apiAxios('GET', url, params)
    Vue.prototype.postAxios = (url, params,img) => apiAxios('POST', url, params,img)
    Vue.prototype.putAxios = (url, params) => apiAxios('PUT', url, params)
    Vue.prototype.deleteAxios = (url, params) => apiAxios('DELETE', url, params)
  },
  postAxios:async function(url, params){
    return await apiAxios('POST', url, params)
  }
}