// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
let amount = ["0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5",
  "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.8", "9.0", "9.5"]
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
      title: '生活信息', //导航栏 中间的标题
    },
    host: utils.Host,
    imageUrl: '',
    unit: "份",//选择对应的单位
    percentData: 0,
    totalData: 100,
    questionContent: '',
    title: '',
    isShowExample: '',
    chooseShowContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍等',
    })
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    //https://jk.aspoontech.com
    this.setData({
      statusBarHeight: statusBarHeight,
      imageUrl: utils.IMG_URL + "/questionnaire/food.png"
    })
    this.receiveData(options)
  },

  /**
   * 页面显示效果处理 
   * 图片   示例
   * @param {*} questionId 
   */
  choosePic: function (questionId) {
    let that = this
    if (questionId == utils.questID_nutritionMeal) {
      //显示示例按钮
      that.setData({
        isShowExample: true
      })
    } else {
      //隐藏示例按钮
      that.setData({
        isShowExample: false
      })
    }
    let imageUrl = ''
    if (questionId == utils.questID_nutritionMeal) {
      imageUrl = utils.IMG_URL + "/questionnaire/food.png"
    } else if (questionId == utils.questID_nutritionMeat) {
      imageUrl = utils.IMG_URL + "/questionnaire/meal.png"
    } else if (questionId == utils.questID_nutritionEgg) {
      imageUrl = utils.IMG_URL + "/questionnaire/egg.png"
    } else if (questionId == utils.questID_nutritionTofu) {
      imageUrl = utils.IMG_URL + "/questionnaire/tofu.png"
    } else if (questionId == utils.questID_nutritionMilk) {
      imageUrl = utils.IMG_URL + "/questionnaire/milk.png"
    } else if (questionId == utils.questID_nutritionAquactic) {
      imageUrl = utils.IMG_URL + "/questionnaire/fish.png"
    } else if (questionId == utils.questID_nutritionVegetable) {
      imageUrl = utils.IMG_URL + "/questionnaire/vegetable.png"
    } else if (questionId == utils.questID_nutritionFruit) {
      imageUrl = utils.IMG_URL + "/questionnaire/fruilt.png"
    } else if (questionId == utils.questID_nutritionNuts) {
      imageUrl = utils.IMG_URL + "/questionnaire/nut.png"
    }
    this.setData({
      imageUrl: imageUrl
    })
  },

  receiveData: function (option) {
    let that = this
    questionId = option.questionID
    this.choosePic(questionId)
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
    let answer = this.data.chooseShowContent
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
    api.findPageQuestion(params).then(res => {
      wx.hideLoading()
      if (res.retCode == 200) {
        let content = ''
        // if (questionId in utils.nutritionIDGroup) {
        content = amount
        // }
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
    let index = e.detail.value
    let answer = amount[index]
    this.setData({
      chooseShowContent: answer
    });
  },

  /**
   * 跳转示例
   */
  clickExample: function () {
    wx.navigateTo({
      url: '../picPickerExample/index',
    })
  }

})