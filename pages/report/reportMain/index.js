//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js");
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康档案', //导航栏 中间的标题
    },
    statusBarHeight: "", // 此页面 页面内容距最顶部的距离
    statusBarHeightX: "", //适配机型
    isIphoneX: "",
    imgUrl: utils.IMG_URL,
    List: [{
        name: "",
        url: utils.IMG_URL + '/images/healthRecords/1.png'
      },
      {
        name: "",
        'url': utils.IMG_URL + '/images/healthRecords/2.png'
      },
      {
        name: "",
        'url': utils.IMG_URL + '/images/healthRecords/3.png'
      },
      {
        name: "",
        'url': utils.IMG_URL + '/images/healthRecords/4.png'
      },
      {
        name: "",
        'url': utils.IMG_URL + '/images/healthRecords/5.png'
      },
    ],
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 2
      })
    }
  },
  onLoad: function () {
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    let statusBarHeightX;
    if (app.globalData.isIphoneX == true) {
      statusBarHeightX = app.globalData.statusBarHeight + 128
    } else if (app.globalData.isIphoneX == false) {
      statusBarHeightX = app.globalData.statusBarHeight + 94
    }
    _this.setData({
      statusBarHeight: statusBarHeight,
      statusBarHeightX: statusBarHeightX,
    })
    let isIphoneX = app.globalData.isIphoneX;
    _this.setData({
      isIphoneX: isIphoneX
    })
  },


  healthRecord1: function () {
      var that = this;
      let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.daysAgo(),
      "flag":1,
    }
    api.checkReport(params).then(res => {
      if(res.data==1){
        wx.navigateTo({
        url: '../../report/nutritionReport/index',
        })
      }else{
       let title = "营养报告";
      wx.navigateTo({
        url: '/pages/report/blankPage/index?title=' + title,
      })
      }
    }).catch(function (error) {})
    
  },
  healthRecord2: function () {
    var that = this;
    let params = {
    "endTime": utils.today + " 23:59:59",
    "startTime": utils.daysAgo(),
    "flag":2,
  }
  api.checkReport(params).then(res => {
    if(res.data==1){
      wx.navigateTo({
      url: '../../report/motionReport/index',
      })
    }else{
     let title = "运动报告";
    wx.navigateTo({
      url: '/pages/report/blankPage/index?title=' + title,
    })
    }
  }).catch(function (error) {})

  },
  healthRecord3: function () {
    var that = this;
    let params = {
    "endTime": utils.today + " 23:59:59",
    "startTime": utils.daysAgo(),
    "flag":3,
  }
  api.checkReport(params).then(res => {
    if(res.data==1){
      wx.navigateTo({
        url: '../../report/sleepReport/index',
      })
    }else{
     let title = "睡眠报告";
    wx.navigateTo({
      url: '/pages/report/blankPage/index?title=' + title,
    })
    }
  }).catch(function (error) {})
   
  },
  healthRecord4: function () {
    var that = this;
    let params = {
    "endTime": utils.today + " 23:59:59",
    "startTime": utils.daysAgo(),
    "flag":4,
  }
  api.checkReport(params).then(res => {
    if(res.data==1){
      wx.navigateTo({
        url: '../../report/psychologyReport/index',
      })
    }else{
     let title = "心理报告";
    wx.navigateTo({
      url: '/pages/report/blankPage/index?title=' + title,
    })
    }
  }).catch(function (error) {})
   
  },
  healthRecord5: function () {
    //待下期做
  }

})