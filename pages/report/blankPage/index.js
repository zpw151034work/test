//引入echarts
import * as echarts from '../../../commpents/ec-canvas/echarts';
//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
let chart1 = null;

function healthScore(canvas, width, height, dpr) {
  chart1 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart1);
  return chart1;
}
//营养分析
let chart2 = null;

function nutritionReport(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart2);
  return chart2;
}
Page({
  data: {
    imgUrl: utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题 
    },
    // 此页面 页面内容距最顶部的距离
   statusBarHeight: "", 
   statusBarHeightX:"",//适配机型
   isIphoneX:"",  
  },
  onLoad: function (option) {
    let _this = this;
    _this.setData({
      'navbarData.title':option.title
    })
    let statusBarHeight = app.globalData.statusBarHeight+44;
    let statusBarHeightX;
    if(app.globalData.isIphoneX ==true){
      statusBarHeightX = app.globalData.statusBarHeight+60
    }
    else if(app.globalData.isIphoneX ==false){
      statusBarHeightX = app.globalData.statusBarHeight+26
    }
    _this.setData({
      statusBarHeight:statusBarHeight,
      statusBarHeightX:statusBarHeightX,
    })
    let isIphoneX = app.globalData.isIphoneX;
      _this.setData({
        isIphoneX: isIphoneX
     })
  },
  //页面跳转
  jumpPage: function () {
    // "pages/record/dietRecord/index",
    // "pages/record/sleepRecord/index",
    // "pages/record/motionRecord/index",
    // "pages/record/psychologicalRecord/index",
    if(this.data.navbarData.title=="营养报告"){
      wx.navigateTo({
        url: '/pages/record/dietRecord/index',
      })
    }
    if(this.data.navbarData.title=="运动报告"){
      wx.navigateTo({
        url: '/pages/record/motionRecord/index',
      })
    }
    if(this.data.navbarData.title=="睡眠报告"){
      wx.navigateTo({
        url: '/pages/record/sleepRecord/index',
      })
    }
    if(this.data.navbarData.title=="心理报告"){
      wx.navigateTo({
        url: '/pages/record/psychologicalRecord/index',
      })
    }
  }
})