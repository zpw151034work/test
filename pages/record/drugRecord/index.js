//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js");
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '用药记录', //导航栏 中间的标题
      dialog: false,
    },
    showView: '',
    commonDrugsData: [],
    show: false,
    today: utils.today,
    date: utils.today,
    minDate: new Date(2021,0, 1).getTime(),
    maxDate: new Date(2021,12,31).getTime(),
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    statusBarHeightX: "",
    isIphoneX: "", //苹果X手机适配  
    drugAddData: [], //添加用药
    recordTime: utils.today
  },

  onLoad: function () {
    let _this = this;
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
    });
    let isIphoneX = app.globalData.isIphoneX;
    _this.setData({
      isIphoneX: isIphoneX
    })

  },
  onShow: function () {
    //用药记录查询
    this.search()
  },
  //时间插件
  onDisplay() {
    this.setData({
      show: true,
      'navbarData.dialog': true
    });
  },
  onClose() {
    this.setData({
      show: false,
      'navbarData.dialog': false
    });
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: utils.formatDate(event.detail),
    });
    this.search();
  },
  //跳转页面增加药品
  addDrug: function () {
    wx.navigateTo({
      url: '/pages/record/drugAdd/index?recordTime=' + this.data.date,
    })
  },
  //swicth
  onChangeSwicth({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
  },
  //单选框
  onChangeChecked(event) {
    let that = this
    let isUse = event.currentTarget.dataset.item.isUse;
    let isActive = isUse;
    if (isActive == 1) {
      isActive = 2
    } else {
      isActive = 1;
    }
    let inx = event.currentTarget.dataset.index;
    var isUseData = "commonDrugsData[" + inx + "].isUse"
    that.setData({
      [isUseData]: isActive,
    });
  },
  // 用药记录查询
  search: function () {
    let that = this;
    let startTime = that.data.date + " 00:00:00";
    let endTime = that.data.date + " 23:59:59";
    let params = {
      "startTime": startTime,
      "endTime": endTime
    }
    api.findMedicineRecordList(params).then(res => {
      if (res.data.userMedicineRecords.length > 0) {
        let commonDrugsData = []
        res.data.userMedicineRecords.forEach(element => {
          let item = element;
          commonDrugsData.push(item);
        });
        that.setData({
          commonDrugsData: res.data.userMedicineRecords,
          showView: false
        })
      } else {
        that.setData({
          showView: true
        })
      }
    }).catch(function (error) {})
  },
  //用药记录保存
  save: function () {
    let that = this;
    var datas = that.data.commonDrugsData.filter(function (item) {
      return item.isUse == 2;
    });
    that.setData({
      drugAddData: datas
    })
    if (that.data.drugAddData == "") {
      wx.showToast({
        title: `请选择加药`,
        icon: 'none',
      });
    } else {
      let newArr = [];
      let recordTime = that.data.date + " 10:00:00";
      that.data.drugAddData.forEach((item) => {
        let Arr = {
          "userId": wx.getStorageSync('userId'),
          "medicineId": parseInt(item.medicineId),
          "medicine": item.medicine,
          "recordTime": recordTime,
          "isUse": '2'
        }
        newArr.push(Arr);
      })
      let params = newArr
      api.insertUserMedicineRecordNew(params).then(res => {
        if (!res) {} else {
          wx.showToast({
            title: `数据保存成功`,
            icon: 'none',
          });
          wx.reLaunch({
            url: '/pages/healthManagement/program/index?name='+'用药',
          })
          // wx.navigateTo({
          //   url:'/pages/healthManagement/program/index?name='+'用药',
          // })
        }
      }).catch(function (error) {})
    }
  }
})