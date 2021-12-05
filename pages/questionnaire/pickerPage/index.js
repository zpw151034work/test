// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
let getUpData = ["00:00", "01:00", "02:00", "03:00",
  "04:00", "05:00", "06:00", "07:00", "08:00",
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"]
let gotoBedData = ["18:00", "19:00", "20:00", "21:00",
  "22:00", "23:00", "00:00", "01:00", "02:00",
  "03:00", "04:00", "05:00", "06:00"]
let realBedData = ["1", "2", "3", "4",
  "5", "6", "7", "8", "9",
  "10", "11", "12", "13",
  "14", "15", "16", "17",
  "18", "19", "20", "21",
  "22", "23", "24"]
let questionId = ''
let count = 0
let total = 0
let answerListStr = ''
let answer = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    editorContent: '',
    inputHint: '没有',
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '基本信息', //导航栏 中间的标题
    },
    index: 0,
    host: utils.Host,
    percentData: 0,
    totalData: 100,
    questionContent: '',
    title: '',
    chooseResult:'',//滑轮滚动显示选中项
    showBack:true,//是否显示返回按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍等',
    })
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    this.setData({
      statusBarHeight: statusBarHeight,
    })
    this.receiveData(options)
  },

  receiveData: function (option) {
    let that = this
    questionId = option.questionID
    count = parseInt(option.count)
    total = parseInt(option.total)
    if(count == 0){
      that.setData({
        showBack:false
      })
    }
    let sectionTitle = option.sectionTitle
    let percentData = parseInt(((count + 1) / total).toFixed(2) * 100)
    this.setData({
      percentData: percentData,
      totalData: total,
      navbarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: sectionTitle, //导航栏 中间的标题
      },
    })
    answerListStr = option.answerListStr
    this.queryQuestionAnweer()
  },

  /**
   * 返回按钮
   */
  backFun: function () {
    let nextCount = count - 1
    let pathUrl = utils.questionnairePage(count, nextCount, answerListStr)
    wx.redirectTo({
      url: pathUrl,
    })
  },

  /**
   * 确认按钮
   */
  sureFun: function (options) {
    let that = this
    let score = ''
    if (answer.length <= 0) {
      wx.showModal({
        title: '提示',
        content: "请填写内容",
        showCancel: false
      })
      return
    }

    let nextCount = count + 1
    let result = utils.resolveNextPageStyle(wx.getStorageSync('pageId'), nextCount)
    if (result == 0) {
      let pageIdTemp = wx.getStorageSync('pageId')
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answer, '')
      let overJu = utils.overJudgement(pageIdTemp, answerListStrTemp)
      if (overJu == 0) {//没有触发二筛
        let endResult = utils.arrangeAswerStr(answerListStrTemp)

      } else if (overJu > 0 && overJu < 4) {//触发了二筛
        let endResult = utils.arrangeAswerStr(answerListStrTemp)
        wx.redirectTo({
          url: '../secondPage/index?overJu=' + overJu + "&firstData=" + endResult,
        })

      } else if (overJu == 4) {
        let pages = getCurrentPages(); // 当前页的数据，
        let prevPage = pages[pages.length - 2]; // 上一页的数据
        prevPage.setData({
          psychologyResult: answerListStrTemp, // 修改上一页的属性值；
        })
        wx.navigateBack({
          delta: 1,
        })
      } else if (overJu == 5) {
        let pages = getCurrentPages(); // 当前页的数据，
        let prevPage = pages[pages.length - 2]; // 上一页的数据
        prevPage.setData({
          sleepResult: answerListStrTemp, // 修改上一页的属性值；
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    } else if (result == 1) {
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answer, score)
      let pathUrl = "../firstScreen/index?count=" + count + "&nextCount=" + nextCount + "&answer=" + answerListStrTemp
      wx.redirectTo({
        url: pathUrl,
      })
    } else if (result == 2) {
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answer, score)
      let pathUrl = utils.questionnairePage(count, nextCount, answerListStrTemp)
      wx.redirectTo({
        url: pathUrl,
      })
    }
  },

  /**
   * 获取问题相关信息
   */
  queryQuestionAnweer: function () {
    let that = this
    let params = { "pageId": wx.getStorageSync('pageId'), "questionId": questionId }
    api.findPageQuestion(params).then(function (res) {
      wx.hideLoading()
      if (res.retCode == 200) {
        let content = ''
        if (questionId == utils.questID_wakeUpTime) {//起床时间
          content = getUpData
        } else if (questionId == utils.questID_gotoBedTime) {//晚上上床入睡时间
          content = gotoBedData
        } else if (questionId == utils.questID_sleepTime) {//实际入睡时常
          content = realBedData
        }
        that.setData({
          title: res.data[0].question,
          questionContent: content
        })
      }
    })
  },
  /**
  * 监听普通picker选择器
  */
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    let position = e.detail.value
    let chooseResultTemp = ''
    if (questionId == utils.questID_wakeUpTime) {//起床时间
      let content = getUpData[position]
      chooseResultTemp = content
      content = content.substring(0, 2)
      answer = parseInt(content)
    } else if (questionId == utils.questID_gotoBedTime) {//晚上上床入睡时间
      let content = gotoBedData[position]
      chooseResultTemp = content
      content = content.substring(0, 2)
      answer = parseInt(content)
    } else if (questionId == utils.questID_sleepTime) {//实际入睡时常
      answer = realBedData[position]
      chooseResultTemp = answer
    }
    this.setData({
      index: position,
      chooseResult:chooseResultTemp
    });

  },

})