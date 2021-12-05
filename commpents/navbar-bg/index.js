const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    statusBarHeight: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    }
  },
  //第一次进入页面的时候
  attached: function () {
    
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] ,
      
    })
  },
  methods: {
  // 返回上一页面
    _navback() {
      wx.switchTab({
        url: '/pages/healthManagement/main/index'
      })
    },
  //返回到首页
    _backhome() {
      wx.navigateTo({
        url: '/pages/empower/index',
      })
    }
  }
}) 