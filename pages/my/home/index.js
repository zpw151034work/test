//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康管理', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    active: "",
    avatarUrl: "",
    userName: '',
    sex: '',
    showOneButtonDialog: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    tourist:false,
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 3
      })
    }
    this.setData({
      tourist:wx.getStorageSync('author')
    })
  },
  onLoad: function () {
    let tourist = wx.getStorageSync('author');
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44,
      avatarUrl: userInfo.avatarUrl,
      userName:tourist=='tourist'?'游客': userInfo.nickName,
      sex: userInfo.gender == 1 ? "男" : "女",
      tourist,
    });
    console.log("游客数据");
    console.log(this.data.tourist)
    console.log("游客数据");
  },

  /**
   * 健康评估报告跳转
   */
  iHealthClick: function () {

    wx.navigateTo({
      url: '../../questionnaire/firstScreen/index',
    })
  },

  /**
   * 扫码获取健康评估报告
   */
  iHealthScanClick: function () {
    this.scanCode()
  },

  scanCode: function () {
    let that = this
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

        wx.setStorageSync('author', "scan")//已经获取了则授权标记恢复初始化
        that.setData({ author: 0 })

        //接口访问成功后记录扫码获取的医院信息
        wx.setStorageSync('hospitalName', restArr[0])
        wx.setStorageSync('departmentName', restArr[1])
        that.setData({ hospital: restArr[0] });
        that.setData({ department: restArr[1] });

        wx.setStorageSync('reportID', res.data)
        wx.setStorageSync('healthAssement', 3);

        wx.switchTab({
          url: "../../healthManagement/main/index"
        })
      }
    }).catch(function (error) {

    })
  },

  /**
   * 版本
   */
  setClick: function () {
     wx.showModal({
      title: "版本",
      content: 'Beta:0.9',
      showCancel: false
    })
  },

  /**
   * 帮助与反馈
   */
  helpFeedBackClick: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  sureBtnClick: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  // 退出
  signOut:function(){
    wx.setStorageSync('Token', '');
    wx.setStorageSync('userId','');
    wx.setStorageSync('author', ''); 
    wx.reLaunch({
      url:"/pages/home/index",
    })
  }
})
