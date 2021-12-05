//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
Component({
  data: {
    imgUrl: utils.IMG_URL,
    statusBarHeight: "", // 此页面 页面内容距最顶部的距离
    sleep_risk_name: "",
    sleep_risk_id: "",
    sleep_recipe_id: "",
    sleep_time: "",
    temprature: "",
    sleepHardCause: [],
    sleepSugistion: [],
    sleepBeforeEvent: [],
    sleepTool: [],

  },
  //第一次进入页面的时候
  attached: function () {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })

    this.pageData1()
    setTimeout(() => {
      this.pageData2()
      this.pageData3()
      this.pageData4()
      this.pageData5()
      this.pageData6()
    }, 1000)
  },

  methods: {
    //接口——获取recipe id 和 task id
    pageData1: function () {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_evalution_report_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('reportID')
        }],
        "returnParam": ""
      }
      api.userSleepRecipeLink(params).then(res => {
        that.setData({
          sleep_risk_name: res.data.sleep_risk_name,
          sleep_risk_id: res.data.sleep_risk_id,
          sleep_recipe_id: res.data.sleep_recipe_id
        })
      }).catch(function (error) {

      })
    },
    //接口——建议入睡时间、建议卧室温度
    pageData2: function () {
      let that = this
      let recipeID = this.data.sleep_recipe_id
      let params = {
        "conditionerList": [{
          "conParam": "id",
          "conEqua": "=",
          "conVal": recipeID
        }],
        "returnParam": "sleep_time,temprature"
      }
      api.sleepRecipeFindMapByCondition(params).then(res => {
        let hourStr = res.data.sleep_time + ":" + "00"
        that.setData({
          sleep_time: hourStr,
          temprature: res.data.temprature
        })
      }).catch(function (error) {

      })
    },
    //接口——不入睡困难常见诱因
    pageData3: function () {
      let that = this
      let params = {}
      api.sleepCauseFindAll(params).then(res => {
        that.setData({
          sleepHardCause: res.data
        })
      }).catch(function (error) {

      })
    },
    //接口——睡前活动
    pageData4: function () {
      let that = this
      let params = {
        "sleepRecipeId": that.data.sleep_recipe_id
      }
      api.getSleepEventList(params).then(function (res) {
        that.setData({
          sleepBeforeEvent: res.data
        })

      }).catch(function (error) {

      })
    },
    //接口——睡眠建议
    pageData5: function () {
      let that = this
      let params = {
        "sleepRecipeId": that.data.sleep_recipe_id
      }
      api.getSleepSuggestionList(params).then(res => {
        if (res.data.length > 0) {
          let resStr = res.data[0]
          let contentStr = resStr.content
          let contentG = contentStr.split(" ")
          that.setData({
            sleepSugistion: contentG
          })
        }

      }).catch(function (error) {

      })
    },
    //接口——睡具体
    pageData6: function () {
      let that = this
      let params = {}
      api.sleepToolFindAll(params).then(res => {
        that.setData({
          sleepTool: res.data
        })
      }).catch(function (error) {})
    },
    forthdInterface: function () {
      let that = this
      let param = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync("userId"),
          "conLink": ""
        }],
        "returnParam": ""
      }
      api.userInfoFindMapByCondition(param).then(res => {
        let birth_province = res.data.birth_province
        that.setData({
          birth_province: birth_province
        })
      })
    },
  }
})