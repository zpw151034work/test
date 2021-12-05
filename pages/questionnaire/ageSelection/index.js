// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
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
    currentDate: new Date((new Date().getFullYear() - 40), 9, 1).getTime(),
    minDate: new Date("1921-01-01").getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}`;
      }
      if (type === 'month') {
        return `${value}`;
      }
      return value;
    },
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
    },
    percentData: 0,
    totalData: 100,
    questionContent: '',
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
    questionId = option.questionID
    count = parseInt(option.count)
    total = parseInt(option.total)
    let sectionTitle = option.sectionTitle
    let percentData = ((count + 1) / total).toFixed(2) * 100
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

  onInput(event) {
    let dateTemp = new Date(event.detail)
    let year = dateTemp.getFullYear()
    let month = dateTemp.getMonth() + 1
    let day = dateTemp.getDate()
    let monthStrTemp = month.toString()
    let dayStrTemp = day.toString()
    if(monthStrTemp.length == 1){
      monthStrTemp = '0'+monthStrTemp
    }
    if(dayStrTemp.length == 1){
      dayStrTemp = '0'+dayStrTemp
    }
    let dateResultTemp = year.toString() + monthStrTemp + dayStrTemp
    answer = dateResultTemp
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
  sureFun: function () {
    let that = this
    let answerTemp = answer
    if (answerTemp.length <= 0) {
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
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answerTemp, '')
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
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answerTemp, '')
      let pathUrl = "../firstScreen/index?count=" + count + "&nextCount=" + nextCount + "&answer=" + answerListStrTemp
      wx.redirectTo({
        url: pathUrl,
      })
    } else if (result == 2) {
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answerTemp, '')
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
    api.findPageQuestion(params).then(res => {
      wx.hideLoading()
      if (res.retCode == 200) {
        that.setData({
          questionContent: res.data[0]
        })
      }
    })
  },

})