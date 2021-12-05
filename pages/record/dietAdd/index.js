//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
var pageNumber = 1
let searchContent = ""
Page({
  data: {
    host: utils.Host,
    imgUrl: utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
      dialog: false,
    },
    date: '', //时间参数
    checked: true,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    statusBarHeightX: "",
    isIphoneX: "", //苹果X手机适配
    active: 0, //tab激活值
    show: false, //手动记录弹出层
    infoShow: false,
    foodData: [], //食品
    foodAddData: [],
    dialogData: [],
    type: '',
    recordTime: '', //记录时间
    loadingData: {
      loading: false,
    },
    showOrHide: false,
    unit: "",
    unitData: "",
    activeData: "",
    changeHeat: 0,
    scrollTop:0,
    isImg:false,
    img:''
  },
   
  onLoad: function (options) {
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    let statusBarHeightX;
    if (app.globalData.isIphoneX == true) {
      statusBarHeightX = app.globalData.statusBarHeight + 76
    } else if (app.globalData.isIphoneX == false) {
      statusBarHeightX = app.globalData.statusBarHeight + 44
    }
    let isIphoneX = app.globalData.isIphoneX;
    _this.setData({
      isIphoneX: isIphoneX
    })
    _this.setData({
      statusBarHeight: statusBarHeight,
      statusBarHeightX: statusBarHeightX,
      'navbarData.title': options.title
    });
    if (options.title == "添加早餐") {
      _this.setData({
        type: '1'
      });
    } else if (options.title == "添加午餐") {
      _this.setData({
        type: '2'
      });
    } else if (options.title == "添加晚餐") {
      _this.setData({
        type: '3'
      });
    } else if (options.title == "早加餐") {
      _this.setData({
        type: '4'
      });
    } else if (options.title == "午加餐") {
      _this.setData({
        type: '5'
      });
    } else if (options.title == "晚加餐") {
      _this.setData({
        type: '6'
      });
    }
    _this.setData({
      recordTime: options.time
    })
    pageNumber = 1
    _this.orignalSearch()
  },
  onReachBottom: function (e) {
    this.orignalSearch()
  },
  //弹出手动记录
  getShow() {
    this.setData({
      show: true,
      "navbarData.dialog": true
    });
  },
  onClose() {
    this.setData({
      show: false,
      "navbarData.dialog": false
    });
  },
  //底部弹出成方法
  infoShow: function () {
    let infoShow = !this.data.infoShow;
    this.setData({
      infoShow: infoShow,
      'navbarData.dialog': infoShow
    })
  },
  //实时查询
  onChangeSearch: function (e) {
    pageNumber = 1
    searchContent = e.detail
    this.search(searchContent)
  },
  //初入页面早餐查询
  orignalSearch: function () {
    let that = this
    that.setData({
      "loading": true
    })
    let params = {
      page: pageNumber,
      pageSize: 10
    }
    api.foodUnionWeigth(params).then(res => {
      let showOrHideTemp = false
      if (res.data.length > 9) {
        showOrHideTemp = true
      }
      let resArrTemp = res.data
      if (pageNumber > 1 && resArrTemp != 'null') {
        let currArrTemp = that.data.foodData
        currArrTemp = currArrTemp.concat(resArrTemp)
        that.setData({
          foodData: currArrTemp,
          showOrHide: showOrHideTemp
        })
      } else {
        pageNumber = 1
        that.setData({
          foodData: resArrTemp,
          showOrHide: showOrHideTemp
        })
      }
    }).catch(function (error) {})
  },

  //早餐查询
  search: function (msg) {
    let that = this
    that.setData({
      "loading": true
    })
    let params = {
      foodName: msg,
      page: pageNumber,
      pageSize: 10
    }
    api.foodQueryByParam(params).then(res => {
      let showOrHideTemp = false
      if (res.data.length > 9) {
        showOrHideTemp = true
      }
      let resArrTemp = res.data
      if (pageNumber > 1 && resArrTemp != 'null') {
        let currArrTemp = that.data.foodData
        currArrTemp = currArrTemp.concat(resArrTemp)
        that.setData({
          foodData: currArrTemp,
          showOrHide: showOrHideTemp
        })
      } else {
        pageNumber = 1
        that.setData({
          foodData: resArrTemp,
          showOrHide: showOrHideTemp
        })
      }
    }).catch(function (error) {})
  },
  //点击添餐
  foodAddClick: function (item) {
    var that = this;
    let calory = item.currentTarget.dataset.item.heat / 100;
    let params = {
      foodName: item.currentTarget.dataset.item.foodName
    }
    api.findByFoodName(params).then(res => {
      if (res.data != "") {
        let unitData = res.data.map(item => {
          if (item.amount == "克") {
            return {
              amount: item.amount,
              calory: calory,
              eatWeight: item.eatWeight,
              foodName: item.foodName,
              id: item.id,
              img: item.img,
              weight: item.weight,
            }
          } else {
            return {
              amount: item.amount,
              calory: item.calory,
              eatWeight: item.eatWeight,
              foodName: item.foodName,
              id: item.id,
              img: item.img,
              weight: item.weight,
            }
          }
        });

        let unit = res.data[0].amount;
        that.setData({
          unitData: unitData,
          unit: unit
        })
        item.currentTarget.dataset.item.unitData = that.data.unitData
        that.setData({
          dialogData: item.currentTarget.dataset.item,
        })
      let activeData = [that.data.activeData == "" ? that.data.unitData[0] : that.data.activeData[0]];
      that.setData({
        activeData: activeData
      })
      } else {
        that.setData({
          unit: "克"
        })
      }
    }).catch(function (error) {})
    that.setData({
      show: true,
      'navbarData.dialog': true,
      motionMinutes: '',
      changeHeat: 0
    })
  },
  //输入触发事件
  onMinutesChange(event) {
    let that = this;
    let activeData = [that.data.activeData == "" ? that.data.unitData[0] : that.data.activeData[0]];
    let changeHeat = event.detail * activeData[0].calory;
    this.setData({
      motionMinutes: event.detail,
      changeHeat: changeHeat.toFixed(2),
      activeData: activeData
    })
  },
  // 弹出框事件点击单位
  onChange: function (event) {
    
    let unitData = this.data.unitData;
    let activeData = unitData.filter(item => {
      if (event.detail.title == item.amount) {
        return item;
      }
    });
    this.setData({
      unit: event.detail.title,
      activeData: activeData,
      motionMinutes:"",
      changeHeat:0
    });
  },
  //加餐记录弹出框确定
  dialogSave: function (item) {
    var that = this;
    item.currentTarget.dataset.item.motionMinutes = that.data.motionMinutes;
    item.currentTarget.dataset.item.calory = that.data.activeData[0].calory;
    item.currentTarget.dataset.item.unitType = that.data.activeData[0].amount;
    let foodAddData = that.data.foodAddData;
    if (JSON.stringify(foodAddData).includes(JSON.stringify(item.currentTarget.dataset.item))) {
      wx.showToast({
        title: `已经选择该餐`,
        icon: 'none',
      });
    } else {
      foodAddData.push(item.currentTarget.dataset.item)
    }
    this.setData({
      foodAddData: foodAddData,
    })
  },
  //点击删除运动
  foodDeleteClick: function (item) {
    var that = this;
    let foodAddData = that.data.foodAddData;
    foodAddData.splice(item.currentTarget.dataset.index, 1);
    this.setData({
      foodAddData: foodAddData,
    })
  },

  clickImgShow: function () {
    let that = this;
    console.log(that.data.activeData[0])
     that.setData({
      img:that.data.activeData[0].img
     })
     
  },
  //新增餐保存
  save: function () {
    let that = this;
    if (that.data.foodAddData == "") {
      wx.showToast({
        title: `请选择加餐`,
        icon: 'none',
      });
      that.setData({
        infoShow: false,
        'navbarData.dialog': false
      })
    } else {
      let newArr = [];
      let recordTime = that.data.recordTime + " 00:00:00";
      that.data.foodAddData.forEach((item) => {
        let Arr = {
          "recordTime": recordTime,
          "userId": wx.getStorageSync('userId'),
          "foodId": item.foodId,
          "food": item.foodName,
          "val": item.motionMinutes,
          "unitType": item.unitType,
          "type": that.data.type == "" ? 1 : that.data.type,
          "calory": item.calory
        }
        newArr.push(Arr);
      })
      let params = newArr;
      api.insertFoodRecord(params).then(res => {
        if (res.retCode == 200) {
          that.setData({
            infoShow: false,
            'navbarData.dialog': false
          });
          wx.showToast({
            title: `数据保存成功`,
            icon: 'none',
          });
          wx.navigateBack({
            delta: 1,
          })
        }
      }).catch(function (error) {})
    }
  },
  /**
   * 加载更多
   */
  loadMore: function () {
    let that = this
    let showOrHideTemp = this.data.showOrHide
    if (showOrHideTemp) {
      pageNumber += 1
      that.search(searchContent)
    }
  },
  upper:function(event){
    console.log(event);
  },
  lower:function(event){
    let that = this
    let showOrHideTemp = this.data.showOrHide
    if (showOrHideTemp) {
      pageNumber += 1
      that.search(searchContent)
    }
  },

})