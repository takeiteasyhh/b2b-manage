const codeMap =  {
    "500": "請求超時，請稍後再試",
    "50002":"圖片上傳失敗",
    "50003":"驗證碼已存在",
    "50006":"發送驗證碼失敗",
    "50004":"驗證碼過期",
    "50005":"驗證碼校驗失敗",
    "50010":"兑换码错误",
    "50011":"刪除錯誤",
    "50011":"數據錯誤",
    "51001":"配置保存錯誤",
    "51002":"獲取配置信息失敗",
    "50101": "賬號或密碼不正確",
    "50102":"賬號已存在" ,

    "50110":"舊密碼錯誤",
    "50111":"用戶已被禁用",
    "50112":"用戶已被禁用",
    "50201":"訂單已存在",
    "50202":"訂單不存在",
    "50205":"訂單狀態錯誤，修改失敗",
    "50206":"訂單狀態錯誤，商品已下架",
    
    "50301":"商家已存在",
    "50302":"公司名字已存在",
    "50303":"公司id不能為空",
    "50401":"商品名稱已存在",
    "50402":"商品不存在",
    "50403":"商品操作錯誤",
    "50404":"商品購買期限已結束",
    "50405":"商品庫存有誤",

    "50601":"商品明細不能為空",
    "50602":"商品詳細已經存在"
};

// 目前的商品類型
const statusOpts = [
    // 0=未付款
	// 				1=已付款
	// 				5=未兑换
	// 				10=已兑换
	// 				15=已过期
	// 				20=退货中
	// 				25=已退货
    {
        id:0,
        name:"未付款"
    },
     {
        id:1,
        name:"已付款"
    },
     {
        id:5,
        name:"未兑换"
    },
    {
        id:10,
        name:"已兑换"
    },
    {
        id:15,
        name:"已過期"
    }

];

const goodsTypeOpt = [
    
    {
        id:1,
        name:"酒店"
    },
     {
        id:2,
        name:"汽車"
    },
     {
        id:3,
        name:"票券"
    }
];


// 酒店规格
const hotelLevel = [
    {
        id:1,
        name:"普通房"
    },
     {
        id:2,
        name:"特價房"
    },
     {
        id:3,
        name:"高級房"
    },
    {
        id:4,
        name:"豪華大床房"
    },
    {
        id:5,
        name:"雙人房"
    },
    {
        id:6,
        name:"三人房"
    }
];


// 汽車规格
const carLevel = [
    {
        id:1,
        name:"小汽车"
    },
     {
        id:2,
        name:"商务车"
    },
    {
        id:3,
        name:"麵包車"
    }
];

const priorityOpts = [
    {id:1,name:"1"},
    {id:2,name:"2"},
    {id:3,name:"3"},
    {id:4,name:"4"},
    {id:5,name:"5"}

]

 export default {codeMap,goodsTypeOpt,hotelLevel,carLevel,statusOpts,priorityOpts}