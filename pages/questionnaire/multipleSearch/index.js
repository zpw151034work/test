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
      title: '', //导航栏 中间的标题
    },
    isShow: false,
    dataActive: [],
    searchData: [],
    percentData: 0,
    totalData: 100,
    questionContent: '',
    title: '',
    sureBtnContent: '确定'//既往史病例可以跳过
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
    if (questionId == utils.questID_otherDiagnose) {//既往史病例 跳过
      that.setData({
        sureBtnContent: '跳过'
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
    let resutlStr = ''
    let dataActive = this.data.dataActive

    if (questionId != utils.questID_otherDiagnose) {
      if (dataActive.length <= 0) {
        wx.showModal({
          title: '提示',
          content: "请填写内容",
          showCancel: false
        })
        return
      }
    }
    for (let i = 0; i < dataActive.length; i++) {
      let codeTemp = dataActive[i].diagnoseCode
      resutlStr = resutlStr + codeTemp + "-"
    }
    let answer = ''
    if (resutlStr.length > 1) {
      answer = resutlStr.substring(0,resutlStr.length - 1)
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
      let pathUrl = "../firstScreen/index?count=" + count + "&nextCount" + nextCount + "&answer=" + answerListStrTemp
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

        that.setData({
          title: res.data[0].question,
        })
      }
    })
  },

  /**
   * 既往病史  搜索
   */
  queryDepartmentSick: function (searchCon) {
    let that = this
    let params = { "diagnoseName": searchCon, "isHistory": 2 }
    api.icd10Diagnose(params).then(res => {
      wx.hideLoading()
      if (res.retCode != 200) {
        return
      }
      if (res.data != null && res.data.length >= 0) {
        let isShow = true
        if (res.data.length == 0) {
          isShow = false
        }
        that.setData({
          searchData: res.data,
          isShow: isShow
        })
      }
    })
  },

  bindKeyInput: function (event) {
    let that = this
    let valueTemp = event.detail.value
    if (valueTemp.length <= 0) {
      that.setData({
        isShow: false
      })
      return
    }
    wx.showLoading({
      title: '查询中。。。',
    })
    this.queryDepartmentSick(valueTemp)
  },

  itemClear: function (item) {
    let that = this;
    let dataActive = that.data.dataActive;
    let index = item.currentTarget.dataset.index;
    dataActive.splice(index, 1);
    that.setData({ dataActive: dataActive })
    if (dataActive.length <= 0) {
      that.setData({ sureBtnContent: '跳过' })
    }
  },

  itemclickAdd: function (item) {
    let that = this;
    let dataActive = that.data.dataActive;
    let resultCode = item.currentTarget.dataset.item.diagnoseCode
    let ifAdd = true
    for (let i = 0; i < dataActive.length; i++) {
      let resCode = dataActive[i].diagnoseCode
      if (resultCode == resCode) {
        ifAdd = false
      }
    }
    if (ifAdd) {
      dataActive.push(item.currentTarget.dataset.item)
    }
    that.setData({
      dataActive: dataActive,
      isShow: false,
      sureBtnContent: '确定'
    })
  },
})