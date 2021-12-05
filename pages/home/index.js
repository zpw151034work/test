const api = require("../../utils/api.js");
let utils = require("../../utils/util.js");
//获取应用实例
const app = getApp();
// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: utils.IMG_URL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('Token')&&(wx.getStorageSync('author')=="author"||wx.getStorageSync('author')=="scan")){
        wx.navigateTo({
        url:'/pages/empower/index',
      })
     }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  //游客
  onTourist:function(){
    let params={
      userType:2,
      userName:'游客'
    }
    api.registry(params).then(res => {
      if (res.retCode == "USER003") {
        wx.setStorageSync('Token', res.data.token);
        wx.setStorageSync('userId', res.data.userId);
        wx.setStorageSync('author', 'tourist') 
        wx.switchTab({
          url: "../healthManagement/main/index"
        })
      }
    }).catch(function (error) {

    })
  },
  //已注册
  onRegistered:function(){
    wx.setStorageSync('Token', '');
    wx.setStorageSync('userId','');
    wx.setStorageSync('author', ''); 
    wx.navigateTo({
     url:'/pages/empower/index',
   })
  }
})