//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js");
let utils = require("../../../utils/util.js")
Page({
  data: {
    imgUrl:utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '添加药品', //导航栏 中间的标题
      dialog:false
    },
    checked: true,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "", //适配机型
    statusBarHeightX:"",
    isIphoneX:"",
    infoShow:"",//底部弹出层
    active: "", //tab激活值
    show: false, //弹出层
    drugAddData:[],//要增加的
    drugData:[],
    recordTime:''
     },
  onLoad: function (options) { 
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight+44;
    let statusBarHeightX;
    if(app.globalData.isIphoneX ==true){
      statusBarHeightX = app.globalData.statusBarHeight+76
    }
    else if(app.globalData.isIphoneX ==false){
      statusBarHeightX = app.globalData.statusBarHeight+44
    }
    _this.setData({
      statusBarHeight:statusBarHeight,
      statusBarHeightX:statusBarHeightX,
    })
    let isIphoneX = app.globalData.isIphoneX;
      _this.setData({
        isIphoneX: isIphoneX
     })
     _this.setData({
      recordTime:options.recordTime
     })
   },
  //弹出层手动记录
  getUserInfo(event) {
  },
  //弹出框拍照记录
  getShow() {
    this.setData({
      show: true,
      "navbarData.dialog":true
    }); 
  },
  onClose() {
    this.setData({
      show: false,
      "navbarData.dialog":false
     });
   },
  getShowPhoto() {
    this.setData({
      show: true,
      "navbarData.dialog":true
    }); 
  },
  onClosePhoto() {
    this.setData({
      photoShow: false,
      "navbarData.dialog":false
    });
  },
  //底部弹出成方法
  infoShow:function(){
    let infoShow = !this.data.infoShow;
    this.setData({
       infoShow:infoShow,
       "navbarData.dialog":infoShow
    })
  },
  //实时查询
  onChangeSearch:function(e){
   this.search(e.detail)
  },
 //用药查询
 search:function(msg){
 let that = this;
 let userId =  wx.getStorageSync('userId');
 let params ={ "conditionerList":[{"conParam":"name","conEqua":"like","conVal":"%"+msg+"%","conLink":" or "},
 {"conParam":"en_name","conEqua":"like","conVal":"%"+msg+"%","conLink":" or "},{"conParam":"synonym","conEqua":"like","conVal":"%"+msg+"%"}], "returnParam":"id,name","limitNum":"100" }
 api.drugFindByCondition(params).then(res => {
  if (res.retCode=='200') {
    that.setData({
      drugData:res.data
     })
     }
    }).catch(function(error) {
  })
},
//点击添加用药
  drugAddClick:function(item){
    var that = this;
    let  drugAddData = that.data.drugAddData;
    if(JSON.stringify(drugAddData).includes(JSON.stringify(item.currentTarget.dataset.item))){
      wx.showToast({
        title: `已经选择该药`,
        icon: 'none',
      });
     }else{
      drugAddData.push(item.currentTarget.dataset.item)
     } 
    this.setData({
      drugAddData: drugAddData,
      })
    },
//点击删除用药
drugDeleteClick:function(item){
     var that = this;
     let  drugAddData = that.data.drugAddData;
     drugAddData.splice(item.currentTarget.dataset.index,1);
     this.setData({
      drugAddData: drugAddData,
      })
    },
 //新增用药保存
 save:function(){
   let that = this;
   if(that.data.drugAddData ==""){
    wx.showToast({
      title: `请选择加药`,
      icon: 'none',
     });
     that.setData({
      infoShow:false,
      'navbarData.dialog': false
    })
    }else{
    let newArr =[];
    let recordTime = that.data.recordTime+" 10:00:00";
     that.data.drugAddData.forEach((item)=>{
    let Arr = {"userId":wx.getStorageSync('userId'),"medicineId":parseInt(item.id),"medicine":item.name,"recordTime":recordTime,"isUse":2} 
      newArr.push(Arr);
     })
   let params = newArr
   api.insertUserMedicineRecord(params).then(res => {
    if(!res){}else{
      wx.navigateBack({
        delta: 1,
      })
       wx.showToast({
        title: `数据保存成功`,
        icon: 'none',
       });
    }
    }).catch(function(error) {
    })
   }
  }
})