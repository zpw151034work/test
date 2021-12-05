//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
Page({
  data: {
    imgUrl:utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '推荐饮食', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight:"",  
    recommendedDiet:[
      { "name":"高丽菜", "reason":"推荐理由：十字花科","imgUrl":utils.IMG_URL+'/nutritionProgram/蔬菜.png'},
      { "name":"甘蓝", "reason":"推荐理由：十字花科","imgUrl":utils.IMG_URL+'/nutritionProgram/蔬菜.png'},
      { "name":"西兰花", "reason":"推荐理由：十字花科","imgUrl":utils.IMG_URL+'/nutritionProgram/蔬菜.png'}
    ],
  },
  onLoad: function () {
		this.setData({
			statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'] +44
		})
  },
  //页面数据
  pageData:function(){
    let params = {}
      api.insertSleepRecord(params).then(res=> {}).catch(function(error) { })
  }
})
