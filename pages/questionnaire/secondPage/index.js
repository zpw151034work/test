// pages/questionnaire/secondPage/index.js
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
let gotoUploadPic = false //跳转图片上传页面  false 没有跳转  true 跳转了
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
    firstResult: '',
    psychologyResult: '',
    sleepResult: '',
    showPsychology: false, //是否显示心理二筛按钮
    showSleep: false, //是否显示睡眠二筛按钮
    psychologyClicked: true, //按钮只可以点击一次
    sleepClicked: true, //按钮只可以点击一次
    overJu: '', //心理和睡眠按钮显示哪个
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
    let overJu = options.overJu
    let firstData = options.firstData
    this.setData({
      firstResult: firstData,
      overJu: overJu
    })

    if (overJu == 1) { //睡眠
      that.setData({
        showSleep: true
      })
    } else if (overJu == 2) { //心理
      that.setData({
        showPsychology: true
      })
    } else if (overJu == 3) { //都有
      that.setData({
        showPsychology: true,
        showSleep: true
      })
    }
  },

  onShow: function () {
    let that = this
    if (gotoUploadPic) { //跳转了图片上传，回来直接进行接口调用完成问卷
      gotoUploadPic = false
      that.dataUpLoad()
      return
    }
    //在页面重显的时候，检测对应的数据是否存在，如果存在则说明二筛完成了自动进行数据上传，完成筛查的整个过程
    let overJu = this.data.overJu
    if (overJu == 1) { //睡眠
      let sleepDataTemp = that.data.sleepResult
      if (sleepDataTemp.length > 0) {
        that.goToUploadDialog()
      }
    } else if (overJu == 2) { //心理
      let psychologyDataTemp = that.data.psychologyResult
      if (psychologyDataTemp.length > 0) {
        that.goToUploadDialog()
      }
    } else if (overJu == 3) { //都有
      let sleepDataTemp = that.data.sleepResult
      let psychologyDataTemp = that.data.psychologyResult
      if (sleepDataTemp.length > 0 && psychologyDataTemp.length > 0) {
        that.goToUploadDialog()
      }
    }
  },

  /**
   * 弹窗是否跳转图片上传页面
   */
  goToUploadDialog: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否上传检验报告，更好的制定专属报告',
      success(res) {
        if (res.confirm) {
          gotoUploadPic = true
          that.gotoUploadPage()
        } else if (res.cancel) {
          that.dataUpLoad()
        }
      }
    })
  },

  /**
   * 跳转到图片上传页面
   */
  gotoUploadPage: function () {
    wx.navigateTo({
      url: '../uploader/index',
    })
  },

  /**
   * 点击心理二筛
   */
  psychologyClick: function () {
    let that = this
    let temp = this.data.psychologyClicked
    if (temp) {
      wx.showLoading({
        title: '请稍等。。。',
      })
      that.setData({
        psychologyClicked: false
      })
      wx.setStorageSync('pageId', utils.pageIdPsychologyScreen)
      that.obtainCssID_QuestionID()
    }
  },

  /**
   * 点击睡眠二筛
   */
  sleepClick: function () {
    let that = this
    let temp = this.data.sleepClicked
    if (temp) {
      wx.showLoading({
        title: '请稍等。。。',
      })
      that.setData({
        sleepClicked: false
      })
      wx.setStorageSync('pageId', utils.pageIdSleepScreen)
      this.obtainCssID_QuestionID()
    }
  },

  /**
   * 不继续筛查按钮
   */
  overBtnClick: function () {
    this.goToUploadDialog()
  },

  /**
   * 数据上传
   * @param {*} firstDataTemp 
   * @param {*} psychologyDataTemp 
   * @param {*} sleepDataTemp 
   */
  dataUpLoad: function () {

    wx.showLoading({
      title: '请稍等。。。',
    })

    let firstDataTemp = this.data.firstResult
    let psychologyDataTemp = this.data.psychologyResult
    let sleepDataTemp = this.data.sleepResult
    let overResult = new Array()
    if (firstDataTemp.length > 0) {
      let tempArr = JSON.parse(firstDataTemp)
      overResult = overResult.concat(tempArr)
    }
    if (psychologyDataTemp.length > 0) {
      let objTemp = {
        "questionId": '',
        "answer": 'p',
        "score": ''
      }
      overResult.push(objTemp)
      let tempArr = JSON.parse(psychologyDataTemp)
      overResult = overResult.concat(tempArr)
    }
    if (sleepDataTemp.length > 0) {
      let objTemp = {
        "questionId": '',
        "answer": 's',
        "score": ''
      }
      overResult.push(objTemp)
      let tempArr = JSON.parse(sleepDataTemp)
      overResult = overResult.concat(tempArr)
    }

    let resultOverStr = ''
    for (let i = 0; i < overResult.length; i++) {
      resultOverStr = resultOverStr + overResult[i].answer + ","
    }
    resultOverStr = resultOverStr + "" //医院科室
    this.requestHelthReport(resultOverStr)
  },

  /**
   * 获取css_id 和 question_id
   */
  obtainCssID_QuestionID: function () {

    let that = this
    let pageId = wx.getStorageSync('pageId')
    let params = {
      "pageId": pageId
    }
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
        wx.navigateTo({
          url: urlPath,
        })
      }, 100)
    })
  },

  /**
   * 将答案串上传，获取健康评估报告
   */
  requestHelthReport: function (result) {

    let that = this
    //从扫码中获取医院
    let userIDTemp = wx.getStorageSync("userId")
    let params = {
      "userId": userIDTemp,
      "userPageAnswerArr": result
    }
    api.userPageAnswerCreate(params).then(res => {
      wx.hideLoading()
      if (res.msg == "success") {
        wx.setStorageSync('author', "scan") //已经扫码结束
        wx.setStorageSync('reportID', res.data);
        wx.setStorageSync('healthAssement', 2);

        wx.switchTab({
          url: "../../healthManagement/main/index"
        })
      }
    }).catch(function (error) {

    })
  }
})