// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
const api = require("../../../utils/api.js");
let utils = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康评测', //导航栏 中间的标题
    },
    section: 0,//当前是哪个小节
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    this.setData({
      statusBarHeight: statusBarHeight,
    })
    let count = options.count
    let nextCount = options.nextCount
    let answer = options.answer
    if (nextCount && nextCount >= 0) {
      that.pageShowFun(nextCount)
      let urlPath = utils.questionnairePage(count, nextCount, answer)
      setTimeout(() => {
        wx.redirectTo({
          url: urlPath,
        })
      }, 2000)
    } else {
      wx.setStorageSync('pageId', utils.pageIdFirstScreen)
      that.pageShowFun(0)
      //调取接口获得 page_question中 初筛的所有去重的 questionID和对应的cssid
      that.obtainCssID_QuestionID()
    }
  },

  /**
   * 小节标题按钮背景显示
   */
  pageShowFun: function (count) {
    let that = this
    let sectionTemp = 0
    if (count == 11) {//基本信息
      sectionTemp = 1
    } else if (count == 20) {//疾病信息
      sectionTemp = 2
    } else if (count == 25) {//生活信息
      sectionTemp = 3
    } else if (count == 35) {//营养筛查
      sectionTemp = 4
    } else if (count == 51) {//心理筛查
      sectionTemp = 5
    } else if (count == 55) {//运动筛查
      sectionTemp = 6
    } else if (count == 57) {//睡眠筛查

    }
    that.setData({
      section: sectionTemp
    })
  },

  /**
   * 获取css_id 和 question_id
   */
  obtainCssID_QuestionID: function () {

    let that = this
    let pageId = wx.getStorageSync('pageId')
    let params = { "pageId": pageId }
    api.findQuestionIdAndCssId(params).then(res => {
      if (!res.data || res.data.length < 0) {
        return
      }
      let questionCssID_list = res.data
      if (pageId == utils.pageIdFirstScreen) {
        let index = questionCssID_list.length - 1
        questionCssID_list.splice(index, 1)
      }
      let dataRes = JSON.stringify(questionCssID_list)
      wx.setStorageSync('dataRes', dataRes)
      //获取questionID之后调用完成第一个页面的跳转
      let urlPath = utils.questionnairePage(0, 0, "")
      setTimeout(() => {
        wx.redirectTo({
          url: urlPath,
        })
      }, 2000)
    })
  },

})