
Component({
  data: {
    imgUrl:"https://ihealthmind.com",
     // 选中的 tab 
    active: null,
    //弹出框
    show:false,
    // 菜单列表
    "color":"#eee",
    "selectedColor":"#64B55B",
    scanCode:0,
    list: [
      {
        pagePath: '/pages/healthManagement/main/index',  
       },
      {
        pagePath: '/pages/aIAssistant/main/index',
      },
      {
        pagePath: '/pages/report/reportMain/index',
       },
      {
        pagePath: '/pages/my/home/index',
      }
    ]
  },
  methods: {
    // 标签切换
    onChange: function (event) {
      let author = 1;
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      })
      //  if( author == 2){ //没有扫院机
       
      //  }else{
      //    wx.navigateTo({
      //      url: '/pages/guide/index',
      //    })
      //  }
       
    },
    clickClose:function(){
      this.setData({show: false });
      },
    clickTab:function(){
      this.setData({show: true });
    },
    recordPage1:function(){
      wx.navigateTo({
        url: '/pages/record/dietRecord/index',
      })
      this.setData({show: false });
    },
    recordPage2:function(){
      wx.navigateTo({
        url: '/pages/record/motionRecord/index',
      })
      this.setData({show: false });
    },
    recordPage3:function(){
      wx.navigateTo({
        url: '/pages/record/psychologicalRecord/index',
      })
      this.setData({show: false });
    },
    recordPage4:function(){
      wx.navigateTo({
        url: '/pages/record/sleepRecord/index',
      })
      this.setData({show: false });
    },
    recordPage5:function(){
      wx.navigateTo({
        url: '/pages/record/drugRecord/index',
      })
      this.setData({show: false });
    },
    recordPage6:function(){
      wx.navigateTo({
        url: '/pages/record/signRecord/index',
      })
      this.setData({show: false });
    }
  }
})
