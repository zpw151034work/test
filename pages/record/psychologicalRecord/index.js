//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
//时间插件
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)

}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({
  data: {
    imgUrl: utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '心情记录', //导航栏 中间的标题
    },
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

    todayMoodData: [{
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-开心.png',
        name: '开心',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-开心-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-平静.png',
        name: '平静',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-平静-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-低落.png',
        name: '低落',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-低落-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-孤独.png',
        name: '孤独',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-孤独-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-忐忑.png',
        name: '忐忑',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-忐忑-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-紧张.png',
        name: '紧张',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-紧张-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-表情-生气.png',
        name: '生气',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-表情-生气-空.png',
        isActive: false
      }
    ], //今日心情
    emotionalFactorsData: [{
        image: utils.IMG_URL + '/psychologicalRecord/icon-工作.png',
        name: '工作',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-工作-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-家庭.png',
        name: '家庭',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-家庭-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-人际关系.png',
        name: '人际关系',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-人际关系-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-亲密关系.png',
        name: '亲密关系',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-亲密关系-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-亲子.png',
        name: '亲子关系',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-亲子-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-经济.png',
        name: '经济',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-经济-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-成绩.png',
        name: '个人成绩',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-成绩-空.png',
        isActive: false
      },
      {
        image: utils.IMG_URL + '/psychologicalRecord/icon-健康.png',
        name: '健康状况',
        imageActiive: utils.IMG_URL + '/psychologicalRecord/icon-健康-空.png',
        isActive: false
      },
    ], //情绪影响因素
    emotionRegulationData: [{
        name: "忍耐",
        isActive: false
      },
      {
        name: "指责",
        isActive: false
      },
      {
        name: "吸烟",
        isActive: false
      },
      {
        name: "饮酒",
        isActive: false
      },
      {
        name: "逃避",
        isActive: false
      },
      {
        name: "运动",
        isActive: false
      },
      {
        name: "哭泣",
        isActive: false
      },
      {
        name: "购物",
        isActive: false
      },
      {
        name: "进食",
        isActive: false
      },
      {
        name: "娱乐",
        isActive: false
      },
      {
        name: "争吵",
        isActive: false
      },
      {
        name: "倾诉",
        isActive: false
      }
    ], //

    //今日心情
    emotion: '',
    //情绪影响因素
    emotionEffect: "",
    //心情日记id
    emotionRecordId: "",
    //调节情绪方法用逗号间隔
    emotionAdjust: "",

  },

  onLoad: function (option) {
    let _this = this;
    _this.setData({
      date: option.time ? option.time : utils.today,
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
  onConfirm(event) {
    this.setData({
      show: false,
      date: utils.formatDate(event.detail),
    });
    this.query()
  },
  // 今日心情
  todayMoodClick: function (item) {
    var that = this;
    let isActive = item.currentTarget.dataset.item.isActive;
    isActive = !isActive;
    let inx = item.currentTarget.dataset.index;
    var todayMoodData = "todayMoodData[" + inx + "].isActive"
    that.setData({
      [todayMoodData]: isActive
    })

    let todayData = that.data.todayMoodData;
    for (let i = 0; i < todayData.length; i++) {
      if (i != inx) {
        var todayDataI = "todayMoodData[" + i + "].isActive";
        that.setData({
          [todayDataI]: false
        })
      }
    }
    var datas = that.data.todayMoodData.filter(function (item) {
      return item.isActive == true;
    });
    that.setData({
      emotion: datas
    })
  },
  //情绪影响因素
  emotionalFactorsClick: function (item) {
    var that = this
    let isActive = item.currentTarget.dataset.item.isActive;
    isActive = !isActive;
    var emotionalFactorsData = "emotionalFactorsData[" + item.currentTarget.dataset.index + "].isActive"

    that.setData({
      [emotionalFactorsData]: isActive
    })
    var datas = that.data.emotionalFactorsData.filter(function (item) {
      return item.isActive == true;
    })
    that.setData({
      emotionEffect: datas
    })
  },
  //调节情绪方法
  emotionRegulationClick: function (item) {
    var that = this
    let isActive = item.currentTarget.dataset.item.isActive;
    isActive = !isActive;
    var emotionRegulationData = "emotionRegulationData[" + item.currentTarget.dataset.index + "].isActive"
    this.setData({
      [emotionRegulationData]: isActive
    })
    var datas = that.data.emotionRegulationData.filter(function (item) {
      return item.isActive == true;
    })
    that.setData({
      emotionAdjust: datas
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
    api.findUserPsychoRecord(params).then(function (res) {
      if (res.data.emotion == '') {
        //今日心情无
        let emotion = res.data.emotion.split(",");
        let todayMoodData = that.data.todayMoodData;
        emotion.forEach(function (element) {
          for (let i = 0; i < todayMoodData.length; i++) {
            todayMoodData[i].isActive = false;
          }
        });
        that.setData({
          todayMoodData: todayMoodData,
        })
      } else {
        let emotion = res.data.emotion.split(",");
        let todayMoodData = that.data.todayMoodData;
        emotion.forEach(function (element) {
          for (let i = 0; i < todayMoodData.length; i++) {
            if (todayMoodData[i].name == element) {
              todayMoodData[i].isActive = true;
            }
          }
        });
        that.setData({
          todayMoodData: todayMoodData,
        })
      }
      //情绪影响因素
      if (res.data.emotionEffect == '') {
        let emotionEffect = res.data.emotionEffect.split(",");
        let emotionalFactorsData = that.data.emotionalFactorsData;
        emotionEffect.forEach(function (element) {
          for (let i = 0; i < emotionalFactorsData.length; i++) {
            emotionalFactorsData[i].isActive = false;
          }
        });
        that.setData({
          emotionalFactorsData: emotionalFactorsData,
        })
      } else {
        let emotionEffect = res.data.emotionEffect.split(",");
        let emotionalFactorsData = that.data.emotionalFactorsData;
        emotionEffect.forEach(function (element) {
          for (let i = 0; i < emotionalFactorsData.length; i++) {
            if (emotionalFactorsData[i].name == element) {
              emotionalFactorsData[i].isActive = true;
            }
          }
        });
        that.setData({
          emotionalFactorsData: emotionalFactorsData,
        })
      }
      //调节情绪方法
      if (res.data.emotionAdjust == "") {
        let emotionAdjust = res.data.emotionAdjust.split(",");
        let emotionRegulationData = that.data.emotionRegulationData;
        emotionAdjust.forEach(function (element) {
          for (let i = 0; i < emotionRegulationData.length; i++) {
            emotionRegulationData[i].isActive = false;
          }
        });
        that.setData({
          emotionRegulationData: emotionRegulationData,
        })
      } else {
        let emotionAdjust = res.data.emotionAdjust.split(",");
        let emotionRegulationData = that.data.emotionRegulationData;
        emotionAdjust.forEach(function (element) {
          for (let i = 0; i < emotionRegulationData.length; i++) {
            if (emotionRegulationData[i].name == element) {
              emotionRegulationData[i].isActive = true;
            }
          }
        });
        that.setData({
          emotionRegulationData: emotionRegulationData,
        })
      }
    }).catch(function (error) {})
  },
  //数据保存
  save: function () {
    if (this.data.emotion == "") {
      wx.showToast({
        title: `请选择今日心情`,
        icon: 'none',
      });
    } else if (this.data.emotionEffect == "") {
      wx.showToast({
        title: `请选择情绪影响因素`,
        icon: 'none',
      });
    } else if (this.data.emotionAdjust == "") {
      wx.showToast({
        title: `请选择调节情绪方法`,
        icon: 'none',
      });
    } else {
      var emotion = this.data.emotion.reduce(function (prev, cur) {
        return prev + cur.name + ',';
      }, '');
      var emotionEffect = this.data.emotionEffect.reduce(function (prev, cur) {
        return prev + cur.name + ',';
      }, '');
      var emotionAdjust = this.data.emotionAdjust.reduce(function (prev, cur) {
        return prev + cur.name + ',';
      }, '');
      let recordTime = this.data.date + " 00:00:00";
      let params = {
        recordTime: recordTime,
        userId: wx.getStorageSync('userId'),
        emotion: emotion.substr(0, emotion.length - 1),
        emotionEffect: emotionEffect.substr(0, emotionEffect.length - 1),
        emotionAdjust: emotionAdjust.substr(0, emotionAdjust.length - 1)
      }
      api.userPsychoRecordInsert().then(res => {
        wx.showToast({
          title: `数据保存成功`,
          icon: 'none',
        });
        wx.navigateTo({
          url: '/pages/report/psychologyReport/index',
        })
      }).catch(function (error) {})
    }


  }
})