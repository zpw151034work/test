//获取应用实例
const app = getApp()
const api = require("../../utils/api.js")
let utils = require("../../utils/util.js")
Page({
  data: {
    imgUrl:utils.IMG_URL,
    author:""
  },
  //事件处理函数
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 0
      })
    }
  },
  onLoad: function () {
      this.setData({
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'] +44
      })
   },
  
  //关闭页面跳转
  close:function(){
    wx.switchTab({//传参告诉健康管理没有扫描
     url: '/pages/healthManagement/main/index?author=noScan',
   })
  },
 
 //测评报告
 evaluation:function(){
  wx.navigateTo({
    url: '../questionnaire/firstScreen/index',
  })
},
//触发事件  扫描院机二维码
scanningCode:function(){
  this.panelNoScan()
},
/**
 * 调取摄像头
 * 扫描院机二维码
 */
panelNoScan: function () {
let that = this
// let result = "图一方法非常,19880211,内蒙古自治区,7,1,2,170,50,2,1,1,C43.400,1,0,1,1,0,0-1-2,R42.x00x004-R51.x00,0-1-2-3,3,0,2,0,1,3.0,0.5,1.0,1.0,1.0,0.5,1.0,1.0,1.0,1,1,1,2,1,2,1,1,2,1,2,1,2,0,0,1,0,1,1,1,2,1,2,p,1,2,1,2,1,2,0,2,1,0,3,1,0,1,3,0,0,4,1,1,1,0,4,0,1,2,3,0,3,0,2,1,4,0,1,2,1,1,0,3,0,3,0,2,1,0,4,2,0,2,1,3,1,1,0,0,4,0,4,0,1,2,1,3,3,4,2,2,1,0,2,0,2,1,1,2,2,1,2,1,1,1,2,1,2,1,2,2,1,s,23,0,6,7,0,1,2,1,2,1,2,1,2,1,0,2,1,1,1,北京测试医院-外科"
// wx.showLoading({
//         title: '请等待。。。',
//       })
// that.requestHelthReport(result)
  wx.scanCode({
     onlyFromCamera: true,
    success(res) {
      wx.showLoading({
        title: '请等待。。。',
      })
      that.requestHelthReport(res.result)
    }
  })
},
/**
 * 扫码上传广告机字符串，获取健康评估id
 */
requestHelthReport: function (result) {

  let that = this
  //从扫码中获取医院
  let resTempArr = result.split(",");
  let tempStr = resTempArr[resTempArr.length - 1];
  let restArr = tempStr.split('-');

  let userIDTemp = wx.getStorageSync("userId")
  let params = { "userId": userIDTemp, "userPageAnswerArr": result }
  api.userPageAnswerCreate(params).then(res => {
    wx.hideLoading()
    if (res.msg == "success") {
      wx.setStorageSync('author', "scan")//已经扫码结束
      //接口访问成功后记录扫码获取的医院信息
      wx.setStorageSync('hospitalName', restArr[0])
      wx.setStorageSync('departmentName', restArr[1])

      wx.setStorageSync('reportID', res.data);
      wx.setStorageSync('healthAssement', 1);
      
      wx.switchTab({
        url: "../healthManagement/main/index"
      })
    }
  }).catch(function (error) {

  })
}
})
