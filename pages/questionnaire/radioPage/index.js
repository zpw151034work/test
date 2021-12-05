// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
let nativePlaceArr = [{ "choice": "北京市" }, { "choice": "天津市" }, { "choice": "河北省" }, { "choice": "山西省" }, { "choice": "内蒙古自治区" }, { "choice": "辽宁省" }, { "choice": "吉林省" }, { "choice": "黑龙江省" }, { "choice": "上海市" }, { "choice": "江苏省" }, { "choice": "浙江省" }, { "choice": "安徽省" }, { "choice": "福建省" }, { "choice": "江西省" }, { "choice": "山东省" }, { "choice": "河南省" }, { "choice": "湖北省" }, { "choice": "湖南省" }, { "choice": "广东省" }, { "choice": "广西壮族自治区" }, { "choice": "海南省" }, { "choice": "重庆市" }, { "choice": "四川省" }, { "choice": "贵州省" }, { "choice": "云南省" }, { "choice": "西藏自治区" }, { "choice": "陕西省" }, { "choice": "甘肃省" }, { "choice": "青海省" }, { "choice": "宁夏回族自治区" }, { "choice": "新疆维吾尔自治区" }, { "choice": "台湾省" }, { "choice": "香港特别行政区" }, { "choice": "澳门特别行政区" }]
let questionId = ''
let count = 0
let total = 0
let answerListStr = ''
let answer = ''
let gotoUploadPic = false//跳转图片上传页面  false 没有跳转  true 跳转了
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
    title: '',
    endResult: '',//没有触发二筛的答案，触发上传图片弹窗，当进行了图片上传在onshow中进行答案接口访问
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

  onShow: function () {
    let that = this
    if (gotoUploadPic) {//跳转了图片上传，回来直接进行接口调用完成问卷
      gotoUploadPic = false
      that.dataUpLoad()
      return
    }
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
    let score = ''
    if (questionId == utils.questionID_nativePlace) {
      answer = options.currentTarget.dataset.item
      answer = answer.replace(/^\s*|\s*$/g,"");
    } else {
      answer = options.currentTarget.dataset.index
      let choiceContent = that.data.questionContent
      score = choiceContent[answer].score
    }
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
      let answerListStrTemp = utils.arrangeAnsweer(answerListStr, questionId, answer, score)
      let overJu = utils.overJudgement(pageIdTemp, answerListStrTemp)
      if (overJu == 0) {//没有触发二筛
        let endResultStr = utils.arrangeAswerStr(answerListStrTemp)
        that.setData({
          endResult: endResultStr
        })
        that.goToUploadDialog()
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
    api.findPageQuestion(params).then(res => {
      wx.hideLoading()
      if (res.retCode == 200) {
        let content = ''
        if (questionId == utils.questionID_nativePlace) {
          content = nativePlaceArr
        } else {
          content = res.data
        }
        that.setData({
          title: res.data[0].question,
          questionContent: content
        })
      }
    })
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
   * 串联答案字符串
   * 调用接口上传答案
   */
  dataUpLoad: function () {
    wx.showLoading({
      title: '请稍等。。。',
    })
    let overResultTemp = this.data.endResult
    let overResult = JSON.parse(overResultTemp)
    let resultOverStr = ''
    for (let i = 0; i < overResult.length; i++) {
      resultOverStr = resultOverStr + overResult[i].answer + ","
    }
    resultOverStr = resultOverStr + ""//医院科室
    this.requestHelthReport(resultOverStr)
  },
  /**
   * 将答案串上传，获取健康评估报告
   */
  requestHelthReport: function (result) {

    let that = this
    //从扫码中获取医院
    let userIDTemp = wx.getStorageSync("userId")
    let params = { "userId": userIDTemp, "userPageAnswerArr": result }
    api.userPageAnswerCreate(params).then(res => {
      wx.hideLoading()
      if (res.msg == "success") {
        wx.setStorageSync('author', "scan")//已经扫码结束
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