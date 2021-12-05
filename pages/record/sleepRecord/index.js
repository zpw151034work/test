//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js");
let utils = require("../../../utils/util.js")
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '睡眠记录', //导航栏 中间的标题
      dialog: false,
    },
    imgUrl: utils.IMG_URL,
    date: utils.today,
    today: utils.today,
    show: false,
    minDate: new Date(2021, 0, 1).getTime(),
    maxDate: new Date(2021, 12, 31).getTime(),
    checked: true,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    statusBarHeightX: "",
    isIphoneX: "", //苹果X手机适配  
    sleepStateData: [{
        image: utils.IMG_URL + '/sleepRecords/icon-表情-打鼾.png',
        name: '打鼾',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-打鼾-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-惊吓.png',
        name: '惊吓',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-惊吓-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-疲惫.png',
        name: '疲惫',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-疲惫-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-浅眠.png',
        name: '浅眠',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-浅眠-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-深睡.png',
        name: '深睡',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-深睡-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-失眠.png',
        name: '失眠',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-失眠-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-睡不醒.png',
        name: '不醒',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-睡不醒-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-做梦.png',
        name: '做梦',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-做梦-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-微笑.png',
        name: '正常',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-微笑-空.png',
        isActive: false
      },
    ], //睡眠状态
    sleepStateData1: [{
        image: utils.IMG_URL + '/sleepRecords/icon-表情-打鼾.png',
        name: '打鼾',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-打鼾-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-惊吓.png',
        name: '惊吓',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-惊吓-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-疲惫.png',
        name: '疲惫',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-疲惫-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-浅眠.png',
        name: '浅眠',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-浅眠-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-深睡.png',
        name: '深睡',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-深睡-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-失眠.png',
        name: '失眠',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-失眠-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-睡不醒.png',
        name: '不醒',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-睡不醒-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-做梦.png',
        name: '做梦',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-做梦-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/sleepRecords/icon-表情-微笑.png',
        name: '正常',
        imageActiive: utils.IMG_URL + '/sleepRecords/icon-表情-微笑-空.png',
        isActive: false
      },
    ], //睡眠状态
    healthProductsData: [{
        name: "枣仁安神胶囊",
        isActive: false
      },
      {
        name: "复合维生素",
        isActive: false
      },
      {
        name: "百乐眠胶囊",
        isActive: false
      },
    ],
    sleepTime: '',
    sleepStatuses: '',
    sleepProducts: '',
    currentDate1: '12:00',
    minHour1: 0,
    maxHour1: 23,
    currentDate2: '12:00',
    minHour2: 0,
    maxHour2: 23,
    preDate: '', //
    isGetUp: '',
    isSleepDate: ''
  },
  onLoad: function (option) {
    let _this = this;
    let date = option.time ? option.time : utils.today;
    _this.setData({
      date: option.time ? option.time : utils.today,
      preDate: utils.formatTime(utils.newPreDate(date))
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
    });
    let isIphoneX = app.globalData.isIphoneX;
    _this.setData({
      isIphoneX: isIphoneX
    })
    this.query();
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
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onConfirm(event) {
    this.setData({
      show: false,
      'navbarData.dialog': false,
      date: utils.formatDate(event.detail),
      preDate: utils.formatDate(utils.preDate(event.detail))
    });
    this.query()
  },
  // 入睡时间
  onInput1(event) {
    let value = event.detail.getColumnValue(0) + ':' + event.detail.getColumnValue(1);
    this.setData({
      currentDate1: value,
      isSleepDate: true
    });
    console.log("sdwewwww");
    console.log(this.data.currentDate1);

  },
  // 入起床时间
  onInput2(event) {
    let value = event.detail.getColumnValue(0) + ':' + event.detail.getColumnValue(1);
    this.setData({
      currentDate2: value,
      isGetUp: true
    });
  },
  //swicth
  onChangeSwicth({
    detail
  }) {
    this.setData({
      checked: detail
    });
  },
  //睡眠状态
  sleepStateClick: function (item) {
    var that = this
    let isActive = item.currentTarget.dataset.item.isActive;
    isActive = !isActive;
    let inx = item.currentTarget.dataset.index;
    var sleepStateData = "sleepStateData[" + inx + "].isActive"
    this.setData({
      [sleepStateData]: isActive
    })
    let sleepData = that.data.sleepStateData;
    for (let i = 0; i < sleepData.length; i++) {
      if (i != inx) {
        var todayDataI = "sleepStateData[" + i + "].isActive";
        that.setData({
          [todayDataI]: false
        })
      }
    }
    var datas = that.data.sleepStateData.filter(function (item) {
      return item.isActive == true;
    })
    this.setData({
      sleepStatuses: datas
    })
  },
  // 是否使用健康品
  healthProductsClick: function (item) {
    var that = this
    let isActive = item.currentTarget.dataset.item.isActive;
    isActive = !isActive;
    var healthProductsData = "healthProductsData[" + item.currentTarget.dataset.index + "].isActive"
    this.setData({
      [healthProductsData]: isActive
    })
    var datas = that.data.healthProductsData.filter(function (item) {
      return item.isActive == true;
    })
    this.setData({
      sleepProducts: datas
    })
  },
  //查询回显
  query: function () {
    let that = this;
    let startTime = that.data.date + " 00:00:00"
    let endTime = that.data.date + " 23:59:59"
    let params = {
      startTime: startTime,
      endTime: endTime
    }
    api.findNowUserSleepReport(params).then(function (res) {
      let sleepEndTime = res.data.sleepEndTime;
      let sleepStartTime = res.data.sleepStartTime;
      sleepEndTime = sleepEndTime.substring(11, 16);
      sleepStartTime = sleepStartTime.substring(11, 16);
      if (res.data.sleepStatuses == '') {
        let sleepStatuses = res.data.sleepStatuses.split(",");
        let sleepStateData = that.data.sleepStateData;
        sleepStatuses.forEach(function (element) {
          for (let i = 0; i < sleepStateData.length; i++) {
            sleepStateData[i].isActive = false;
          }
        });
        that.setData({
          sleepStateData: sleepStateData,
        })
      } else {
        let sleepStatuses = res.data.sleepStatuses.split(",");
        let sleepStateData = that.data.sleepStateData;
        sleepStatuses.forEach(function (element) {
          for (let i = 0; i < sleepStateData.length; i++) {
            if (sleepStateData[i].name == element) {
              sleepStateData[i].isActive = true;
            }
          }
        });
        //是否保健品
        let sleepProducts = res.data.sleepProducts.split(",");
        let healthProductsData = that.data.healthProductsData;
        sleepProducts.forEach(function (element) {
          for (let i = 0; i < healthProductsData.length; i++) {
            if (healthProductsData[i].name == element) {
              healthProductsData[i].isActive = true;
            }
          }
        });
        that.setData({
          sleepStateData: sleepStateData,
          healthProductsData: healthProductsData,
          // currentDate2:sleepEndTime,
          // currentDate1:sleepStartTime
        })
      }
    }).catch(function (error) {})
  },
  //数据保存
  save: function () {
    let that = this;
    let sleepStatusesObj = that.data.sleepStatuses;
    let startTime = that.data.preDate + "" + that.data.currentDate1 + ":00";
    let endTime = that.data.date + " " + that.data.currentDate2 + ":00";
    let recordTime = that.data.date + " 00:00:00"
    if (!sleepStatusesObj) {
      wx.showToast({
        icon: 'none',
        title: "请选择睡眠状态",
        duration: 2000
      })
    } else if (that.data.isSleepDate == '' || that.data.isGetUp == '') {
      wx.showToast({
        icon: 'none',
        title: "请选择睡眠时间",
        duration: 2000
      })
    } else {
      let sleepStatuses = that.data.sleepStatuses.reduce(function (prev, cur) {
        return prev + cur.name + ',';
      }, '');
      let params = {
        sleepStartTime: startTime,
        sleepEndTime: endTime,
        userId: wx.getStorageSync('userId'),
        sleepStatuses: sleepStatuses.substr(0, sleepStatuses.length - 1),
        // sleepProducts:sleepProducts.substr(0,sleepProducts.length-1),
        recordTime: recordTime
      }
      api.insertSleepRecord(params).then(res => {
        if (res.retCode == 200) {
          wx.showToast({
            title: `数据保存成功`,
            icon: 'none',
          });
          that.setData({
            isSleepDate: '',
            isGetUp: ''
          })
          endTime = '';
          startTime = '';
          wx.navigateTo({
            url: '/pages/report/sleepReport/index',
          })
        }
      }).catch(function (error) {})
    }
  }
})