//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '基本信息', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "" ,    
    avatarUrl:'',
    userName:'',
    sex:'',
  },
  //事件处理函数 
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'] +44,
      avatarUrl:wx.getStorageSync('userInfo').avatarUrl,
      userName:wx.getStorageSync('userInfo').nickName,
      sex:wx.getStorageSync('userInfo').gender==1?"男":"女",
      })
		this.getUserInfo();
  },
  
  getUserInfo: function(){
    let that = this;
    let data= {};
    api.userInfoFindUserInfo(data).then(res => {
      if(res.data){
        let birthday = utils.formatDate(new Date(res.data.birthday));
        let height = res.data.height;
        let weight = res.data.weight;
        let disease = res.data.disease;
        let diseaseHistory = res.data.diseaseHistory;
        
        that.setData({
          birthday: birthday,
          height: height,
          weight: weight,
          disease: disease,
          diseaseHistory: diseaseHistory,
          showView:true
      })
      }
      }).catch(function(error) {
      })
  }
 
})
