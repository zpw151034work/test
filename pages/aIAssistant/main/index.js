//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js");
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    imgUrl:utils.IMG_URL,
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'AI助手', //导航栏 中间的标题
    },
   // 此页面 页面内容距最顶部的距离
   statusBarHeight: "", 
   statusBarHeightX:"",//适配机型
   isIphoneX:"", 
   meShow:false,
   robotShow:false,
   myImg:wx.getStorageSync('userInfo').avatarUrl? wx.getStorageSync('userInfo').avatarUrl:utils.IMG_URL+'/aIAssistant/miImg.png'
    },
  //TabBar
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 1
      })
    }
  },
  onLoad: function () {
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight+44;
    let statusBarHeightX;
    if(app.globalData.isIphoneX ==true){
      statusBarHeightX = app.globalData.statusBarHeight+128
    }
    else if(app.globalData.isIphoneX ==false){
      statusBarHeightX = app.globalData.statusBarHeight+94
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
   Diet:function(){
    wx.navigateTo({
      url: '/pages/aIAssistant/recordDiet/index',
    })
   },
   exercise:function(){
    wx.navigateTo({
      url: '/pages/aIAssistant/recordMotion/index',
    })
   },
   sleep:function(){
    wx.navigateTo({
      url: '/pages/record/sleepRecord/index',
    })
   },
   feeling:function(){
    wx.navigateTo({
      url: '/pages/record/psychologicalRecord/index',
    })
  },
  questionsAnswer:function(){
    let that = this;
    that.setData({
      meShow:false,
      robotShow:false,
    });
    wx.navigateTo({
      url: '/pages/aIAssistant/questionsAnswer/index?type='+'随问随答',
    });
    
   },
   intelligentRecording:function(){
    let that = this;
    that.setData({
      meShow:true,
    });
    setTimeout(()=>{
      that.setData({
        robotShow:true,
      });
     },1000);
    }
})