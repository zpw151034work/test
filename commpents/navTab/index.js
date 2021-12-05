const app = getApp()
Component({ 
   properties: {
    navtabData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
//第一次进入页面的时候
  attached: function () {
  },
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
     
      if(event.detail.title=='营养'){
        wx.navigateTo({
          url: '../../../pages/healthManagement/nutritionProgramme/index',
        })
      }
      else if(event.detail.title=='运动'){
        wx.navigateTo({
          url: '../../../pages/healthManagement/exerciseProgram/index',
        })
      }
      else if(event.detail.title=='睡眠'){
        wx.navigateTo({
          url: '../../../pages/healthManagement/tcmProgram1/index',
        })
      }
      else if(event.detail.title=='心理'){
        wx.navigateTo({
          url: '../../../pages/healthManagement1/tcmProgram/index',
        })
      }
      else if(event.detail.title=='中医'){
        wx.navigateTo({
          url: '../../../pages/healthManagement1/tcmProgram/index',
        })
      }
      else if(event.detail.title=='用药'){
        wx.navigateTo({
          url: '../../../pages/healthManagement/medicationProgram/index',
        })
      }
      
    },
    
  }
}) 