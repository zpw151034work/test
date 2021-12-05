//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
let pageNumber = 1
let searchContent = ""
var route = '' //运动记录有两个入口，会有不同的处理方式，膳食记录进入的，添加成功后返回膳食记录，从记录按钮进来的，添加成功后结束自己，跳转膳食记录
Page({
  data: {
    imgUrl: utils.IMG_URL,
    host: utils.Host,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '运动记录', //导航栏 中间的标题
      dialog: false,
    },
    date: '',
    checked: true,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    statusBarHeightX: "", //苹果适配
    isIphoneX: "",
    infoShow: "", //底部弹出层
    active: 0, //tab激活值
    show: false, //手动记录弹出层
    dialogData: '', //弹出层数据
    val: "", //请输入分钟数
    motionData: [], //运动数据
    motionAddData: [], //增运动的数据
    showOrHide: false //false 隐藏加载更多按钮，true显示
  },
  onLoad: function (options) {
    route = options.route
    let _this = this;
    console.log(options)
    _this.setData({
      date: options.time ? options.time : utils.today,
    });
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    let statusBarHeightX;
    if (app.globalData.isIphoneX == true) {
      statusBarHeightX = app.globalData.statusBarHeight + 76
    } else if (app.globalData.isIphoneX == false) {
      statusBarHeightX = app.globalData.statusBarHeight + 44
    }
    _this.setData({
      statusBarHeight: statusBarHeight,
      statusBarHeightX: statusBarHeightX,
    })
    let isIphoneX = app.globalData.isIphoneX;
    _this.setData({
      isIphoneX: isIphoneX
    })
    this.orignalSearch()
  },
  //弹出层关闭
  onClose() {
    this.setData({
      show: false,
      'navbarData.dialog': false
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
    searchContent = e.detail
    this.search(searchContent)
  },
  //运动查询
  search: function (msg) {
    let that = this;
    let params = {
      "sportName": msg,
      "page": pageNumber
    }
    api.findExerciseList(params).then(res => {
      if (res.msg == "success") {
        let showOrHideTemp = false
        if (res.data.data.length >= 10) {
          showOrHideTemp = true
        }
        let resArrTemp = res.data.data
        if (pageNumber > 1 && resArrTemp != 'null') {
          let currArrTemp = that.data.motionData
          currArrTemp = currArrTemp.concat(resArrTemp)
          that.setData({
            motionData: currArrTemp,
            showOrHide: showOrHideTemp
          })
        } else {
          pageNumber = 1
          that.setData({
            motionData: resArrTemp,
            showOrHide: showOrHideTemp
          })
        }
      }

    }).catch(function (error) {})
  },
  //点击添加运动
  motionAddClick: function (item) {
    var that = this;
    let dialogData = that.data.dialogData
    this.setData({
      dialogData: item.currentTarget.dataset.item,
      show: true,
      'navbarData.dialog': true,
      val: ''
    })
  },
  onMinutesChange(event) {
    this.setData({
      val: event.detail
    })
  },
  //运动记录弹出框确定
  dialogSave: function (item) {
    var that = this;
    item.currentTarget.dataset.item.val = that.data.val
    let motionAddData = that.data.motionAddData;
    if (JSON.stringify(motionAddData).includes(JSON.stringify(item.currentTarget.dataset.item))) {
      wx.showToast({
        title: `已经选择该运动`,
        icon: 'none',
      });
    } else {
      motionAddData.push(item.currentTarget.dataset.item)
    }
    that.setData({
      motionAddData: motionAddData,
    })
  },
  //点击删除运动
  motionDeleteClick: function (item) {
    var that = this;
    let motionAddData = that.data.motionAddData;
    motionAddData.splice(item.currentTarget.dataset.index, 1);
    that.setData({
      motionAddData: motionAddData,
    })
  },
  //初入页面自动查询
  orignalSearch: function (e) {
    let that = this;
    let params = {}
    api.findCommonExercise(params).then(res => {
      if(res.data.data && res.data.data != 'null'){
        that.setData({
          motionData: res.data.data
        })
      }
    }).catch(function (error) {})
  },
  //新增运动保存
  save: function () {
    let that = this;
    if (that.data.motionAddData == "") {
      wx.showToast({
        title: `请选择运动`,
        icon: 'none',
      });
      that.setData({
        infoShow: false,
        'navbarData.dialog': false
      })
    } else {
      let newArr = [];
      that.data.motionAddData.forEach((item) => {
        let Arr = {
          "userId": wx.getStorageSync('userId'),
          "sportId": parseInt(item.id),
          "sport": item.name,
          "val": parseInt(item.val),
          "heat": item.heat,
          "unitType": 1,
          "recordTime": that.data.date
        }
        newArr.push(Arr);
      })
      let params = [...newArr]
      api.insertSportRecord(params).then(res => {
        if (res.msg == "success") {
          that.setData({
            infoShow: false,
            'navbarData.dialog': false,
            motionAddData: []
          })
          wx.showToast({
            title: `数据保存成功`,
            icon: 'none',
          });
          if (route == 'diet') {
            wx.navigateBack({
              delta: 1,
            })
          } else {
            wx.redirectTo({
              url: '../../record/dietRecord/index',
            });
          }
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

})