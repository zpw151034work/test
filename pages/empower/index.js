const api = require("../../utils/api.js");
let utils = require("../../utils/util.js")
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrl: utils.IMG_URL,
    code: '',
    invite_code: '',
    checked: false,
    phoneShow: false,
    weChat: true,
    telephone: "", //手机号
    user_name: "", //微信名
    icon_img: "", //微信头像
    open_id: "", //
    session_keystr: "",
    isAgreement: false,
  },
  //下面是弹出方法
  onShareAppMessage: function () {
    return {
      title: '登录弹框示例',
      path: '/pages/example/index',
      success: function (res) {}
    }
  },

  onConfirm(e) { // 点击允许
    let dialogComponent = this.selectComponent('.wxc-dialog');
    dialogComponent && dialogComponent.hide();
    let userInfo = JSON.parse(e.detail.detail.rawData)
    if (!userInfo) {
      return;
    }
    this.setData({
      userInfo: userInfo
    })
    wx.setStorageSync('userInfo', userInfo)
  },
  onCancel() { // 点击拒绝
    let dialogComponent = this.selectComponent('.wxc-dialog');
    dialogComponent && dialogComponent.hide();
  },
  //上面是弹出框
  onShow() {
    //************ */
    this.setData({
      checked: false,
    });
  },
  phoneShow() {

  },
  onLoad: function () {
    let authorTemp = wx.getStorageSync('author');
    // if (authorTemp) {
    // } else {
      //当需要授权的时候，调用微信登录然后调用获取openID的接口拿取获取手机号的参数
      var that = this;
      wx.login({
        success(res) {
          let params ={
            code:res.code,
            appid:'wx5dfb14af8d8a825b',
            secret:'9c05a8ff20956681b0e7ee20b4002081',
            grant_type:'authorization_code'
          }
          api.getSessionKey(params).then(res => {
           that.setData({
                session_keystr: res.data
            })
            that.logoIn();

          }).catch(function (error) {})

        }
      })
    // }
  },

  //一键授权
  getUserProfile() {
    var that = this;
    if (that.data.isAgreement == true) {
      //获取用户信息
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          wx.setStorageSync('userInfo', res.userInfo)
          that.registerFun();
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            phoneShow: true,
            weChat: false
          })
        }
      });

    } else {
      wx.showToast({
        title: '请先同意《健康管理服务协议》',
        icon: "none",
        duration: 1000
      })
    }
  },
  //微信获取手机号
  phoneNumberTest() {
    let phoneTemp = "17612237911"
    wx.setStorageSync('phone', phoneTemp)
    this.registerFun();
  },
  getPhoneNumber(e) {
    var that = this;
    var  msg = e.detail.errMsg ;
    var sessionID=that.data.session_keystr,
    encryptedDataStr=e.detail.encryptedData,
    iv= e.detail.iv;
    if (msg == 'getPhoneNumber:ok') {
      wx.checkSession({
        success:function(){
          that.deciyption(sessionID,encryptedDataStr,iv);

        },
        fail:function(){
          wx.login({
            success(res) {
              let params ={
                code:res.code,
                appid:'wx5dfb14af8d8a825b',
                secret:'9c05a8ff20956681b0e7ee20b4002081',
                grant_type:'authorization_code'
              }
              api.getSessionKey(params).then(res => {
                that.setData({
                  session_keystr: res.data.session_key
                });
                var userinfo=res.data.data;
              wx.setStorageSync('userinfo',userinfo);
              that.setData({
                userinfo:userinfo
              });
              that.deciyption(userinfo.Session_key,encryptedDataStr,iv);
              }).catch(function (error) {})
            }
          })
        }
      })
    }
  },
 deciyption(sessionID,encryptedDataStr,iv){
   let  that = this;
   let params = {
    sessionKey: sessionID,
    encryptedData:encryptedDataStr,
    iv: iv
  }
  api.updateUserPhoneNum(params).then(res => {
    //这个res即可返回用户的手机号码
     if(res.retCode==200){
       that.pageData1()
     }
  }).catch(function (error) {})
  },
  
  //取消
  cancelBtn: function () {
    wx.showModal({
      title: '授权',
      content: '需要您的昵称、头像和手机号信息用以定制专属方案,\n请给与授权',
      confirmText: '确定',
      showCancel: false
    })
    // this.toTabar('authoCancel')//正常流程下取消授权（微信账号信息和手机号二者只要有一个不同意授权），进入未授权状态下的健康管理页面
  },
  //跳转到首页
  toTabar: function () {
    let authorTemp = wx.getStorageSync('author')
    /**
     * 开发问卷为了便于调试临时注掉
     */
    if (authorTemp == 'scan') {
      wx.switchTab({
        url: "../healthManagement/main/index"
      })
    } else {
      wx.redirectTo({
        url: '../guide/index',
      })
    }
  },
  //获取地理位置
  // authorize() {
  //   wx.authorize({
  //     scope: 'scope.userLocation',
  //     success() {
  //       wx.getLocation({
  //         type: 'wgs84',
  //         success(res) {
  //           const latitude = res.latitude
  //           const longitude = res.longitude
  //           const speed = res.speed
  //           const accuracy = res.accuracy
  //         }
  //       })
  //     },
  //     fail(res) {
  //     },
  //     complete(res) {
  //     }
  //   })
  // },
  //复选框
  changeCheckbox(event) {
    var that = this;
    this.setData({
      checked: event.detail,
      isAgreement: true,
    });
    // if (that.data.checked == true) {
    //   wx.navigateTo({
    //     url: '../../pages/serviceDetails/index',
    //   })
    // }
  },
  //调用登录接口获取登录信息
  logoIn() {
    let that = this
    let params = {
      userName: wx.getStorageSync('userInfo').nickName,
      telephone: wx.getStorageSync('phone')
    }
    api.login(params).then(res => {
      wx.setStorageSync('Token', res.data.token);
      wx.setStorageSync('userId', res.data.userId);
      that.pageData1()
    }).catch(function (error) {})
  },

  /**
   * 注册接口，授权获取手机号成功后进行注册
   * 头像  iconImg  昵称 userName  电话 telephone  openId openId  密码 password  是否评估: 0,是；1，否 isEvaluate
   * 会员等级: 1，普通会员  vipLevel   vip有效期  vipValidate   微信号  wechat
   */
  registerFun: function () {
    let that = this
    let userNameTemp = wx.getStorageSync('userInfo').nickName
    let params = {
      userName: userNameTemp,
      userType:1
    }
    api.registry(params).then(res => {
      if (res.retCode == "USER003") {
        wx.setStorageSync('Token', res.data.token);
        wx.setStorageSync('userId', res.data.userId);
        wx.setStorageSync('author', 'author') //已经完成了授权
      }
    }).catch(function (error) {})
  },
  //获取reportID
  pageData1: function () {
    let that = this
    let params = {
      "conditionerList": [{
        "conParam": "user_id",
        "conEqua": "=",
        "conVal": wx.getStorageSync('userId')
      }],
      "returnParam": ""
    }
    api.userHealtFfindMaxKey(params).then(res => {
      wx.setStorageSync('reportID', res.data.report_id)
      if (res.data.report_id != null && res.data.report_id != '') {
        wx.setStorageSync('author', 'scan')
      }
      that.toTabar();
    }).catch(function (error) {

    })
  }
})