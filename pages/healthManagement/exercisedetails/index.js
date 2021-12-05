//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
Page({
  data: {
    webUrl:"",
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '运动详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight:"" ,  
    question:"",
    answer:""
    },
  onLoad: function (options) {
     let link = options.link;
			this.setData({
        statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'] +44,
         webUrl:utils.IMG_URL+link
        
				})
			},
     
})
