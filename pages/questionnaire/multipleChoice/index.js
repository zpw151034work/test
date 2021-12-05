// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
let questionId = ''
let count = 0
let total = 0
let answerListStr = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '基本信息', //导航栏 中间的标题
    },
    percentData: 0,
    totalData: 100,
    questionContent: '',
    title: ''
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
    let resutlStr = ''
    let content = this.data.questionContent
    for (let i = 0; i < content.length; i++) {
      let checked = content[i].isCheck
      if (checked) {
        resutlStr = resutlStr + i.toString() + "-"
      }
    }
    let answer = resutlStr.substring(0,resutlStr.length - 1)
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
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answer, '')
      let pathUrl = "../firstScreen/index?count=" + count + "&nextCount=" + nextCount + "&answer=" + answerListStrTemp
      wx.redirectTo({
        url: pathUrl,
      })
    } else if (result == 2) {
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answer, '')
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
        let content = res.data
        for (let i = 0; i < content.length; i++) {
          content[i].isCheck = false
        }
        that.setData({
          title: res.data[0].question,
          questionContent: content
        })
      }
    })
  },

  buttonClick: function (item) {
    var that = this
    let isCheck = item.currentTarget.dataset.item.isCheck;
    isCheck = !isCheck;
    let inx = item.currentTarget.dataset.index;
    if (questionId == utils.questID_fourYouAre ||
      questionId == utils.questID_allergy) {//最后一条选项和其它选项互斥
      let questionContent = that.data.questionContent
      let lengthTemp = questionContent.length - 1
      if (inx == lengthTemp) {
        for (let i = 0; i < questionContent.length; i++) {
          questionContent[i].isCheck = false
        }
      } else {
        let isCheckTemp = questionContent[lengthTemp].isCheck
        if (isCheckTemp) {
          questionContent[lengthTemp].isCheck = false
        }
      }
      that.setData({
        questionContent: questionContent
      })
    }
    var data = "questionContent[" + inx + "].isCheck"
    that.setData({
      [data]: isCheck
    })

  },

})