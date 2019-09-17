// let BASE_URL = "http://192.168.2.155:8089/";//本地
// let IMAGE_URL = "http://192.168.2.155:8089/";//本地图片

let BASE_URL = "http://47.56.122.144:8089/";
let IMAGE_URL = "http://47.56.122.144:8089/";

window.SET_UEDITOR_HOME_URL = process.env.NODE_ENV  ===  "production"?"http://47.56.122.144:8089/":IMAGE_URL
if(process.env.NODE_ENV  ===  "production"){
    BASE_URL = "http://47.56.122.144:8089/"
    IMAGE_URL = "http://47.56.122.144:8089/"
};
export default{
    BASE_URL,
    IMAGE_URL
}