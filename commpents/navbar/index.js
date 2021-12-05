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
   navbarData: {
      showCapsule: 1,
    }
  },
  attached: function () {
   this.setData({
      share: app.globalData.share,
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] ,
    })
  },
  methods: {
  // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
  //返回到首页
    _backhome() {
      wx.navigateTo({
        url: '/pages/empower/index',
      })
    }
  }
}) 