export function getClientHeight() {
    return document.body.clientHeight
}
export function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}
//根据传入得时间获取倒退相应天数的时间
export function getBackDate(d){
    let date = null;
    //获取当前的毫秒数
    let getNowTime = new Date().getTime();
    let getBackTime = d*24*60*60*1000;
    let getSetTime = getNowTime - getBackTime;
    getSetTime = new Date(getSetTime)
    let dateYear = getSetTime.getFullYear()+""
    let dateMonth = getSetTime.getMonth()+1
    let getDate = getSetTime.getDate()+""
    date = dateYear+"-"+dateMonth+"-"+getDate+" 00:00:00"
    return new Date(date)
}
//格式化时间 年月日
export function formatDate(time){
    let getSetTime = new Date(time);
    let dateYear = getSetTime.getFullYear()+""
    let getMonth = getSetTime.getMonth()+1
    let dateMonth = getMonth<10?"0"+getMonth:getMonth
    let getDate = getSetTime.getDate()<10?"0"+getSetTime.getDate():getSetTime.getDate()
    return dateYear+"."+dateMonth+"."+getDate;
}
//格式化时间 年月日
export function formatTime(time){
    if(!time){return ""}else{
    let getSetTime = new Date(time);
    let dateYear = getSetTime.getFullYear()+""
    let getMonth = getSetTime.getMonth()+1
    let dateMonth = getMonth<10?"0"+getMonth:getMonth
    let getDate = getSetTime.getDate()<10?"0"+getSetTime.getDate():getSetTime.getDate()
    let hour = getSetTime.getHours()<10?"0"+getSetTime.getHours():getSetTime.getHours()
    let min = getSetTime.getMinutes()<10?"0"+getSetTime.getMinutes():getSetTime.getMinutes()
    return dateYear+"."+dateMonth+"."+getDate+"  "+hour+":"+min;
    }
}