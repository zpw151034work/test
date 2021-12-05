//获取应用实例
const app = getApp();
let utils = require("../../../utils/util.js");
Page({
  data: {
    imgUrl:utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '问答详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight:"" ,  
    question:"",
    answer:""
    },
  onLoad: function (options) {
     let question = options.question;
     let answer = options.answer;
			this.setData({
        statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'] +44,
        question:question,
        answer:answer
				})
			},
     
})
