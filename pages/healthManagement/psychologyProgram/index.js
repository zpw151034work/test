//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js");
let utils = require("../../../utils/util.js")
var psychologyDegree = ["正常", "轻度", "中度", "重度"];
Component({
  data: {
    imgUrl: utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '营养管理方案', //导航栏 中间的标题
    },
    psychologyActive: 0,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    recipeID: '',
    description: '', //个性描述
    firstData: [],
    maybeCause: '',
    ragulationPrincple: '',
    starCount: "",
    starName: "",
    hideSug: 1,
    positiveSuAll: [],
    positiveSu: [],
    negativeSuAll: [],
    negativeSu: [],
    btnShowStatus: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], //共有11个，因为tyeid是从1开始的到10
    birth_province: ""
  },
  //第一次进入页面的时候
  attached: function () {
    let that = this
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
    this.pageData1();
    this.forthdInterface();
    setTimeout(() => {
      that.pageData2()
    }, 1000)
  },
  methods: {
    btnChange: function (event) {
      let that = this
      let typeIdTemp = event.currentTarget.dataset.typeid
      let btnShowStatusTemp = that.data.btnShowStatus
      let showTemp = btnShowStatusTemp[typeIdTemp]
      if (showTemp == 2 || showTemp == 3) {
        return
      }
      let firstDataTemp = that.data.firstData
      for (let i = 0; i < firstDataTemp.length; i++) {
        let typeId = firstDataTemp[i].psychoRiskType
        let showTemp = btnShowStatusTemp[typeId]
        if (showTemp != 2 && showTemp != 3) {
          btnShowStatusTemp[typeId] = 0
        }
        if (typeId == typeIdTemp) {
          let starCou = firstDataTemp[i].psychoRiskLevel
          btnShowStatusTemp[typeId] = 1
          that.setData({
            maybeCause: firstDataTemp[i].cause,
            ragulationPrincple: firstDataTemp[i].treatmentPrinciple,
            starCount: starCou,
            starName: psychologyDegree[starCou - 1]
          })
        }
      }
      let allSug = that.data.positiveSuAll
      let showPositiveSu = new Array()
      for (let i = 0; i < allSug.length; i++) {
        let resTypeId = allSug[i].riskType
        if (typeIdTemp == resTypeId) {
          showPositiveSu.push(allSug[i])
        }
      }

      let allNegSug = that.data.negativeSuAll
      let showNegtiveSu = new Array()
      for (let i = 0; i < allNegSug.length; i++) {
        let resTypeId = allNegSug[i].riskType
        if (typeIdTemp == resTypeId) {
          showNegtiveSu.push(allNegSug[i])
        }
      }
      that.setData({
        btnShowStatus: btnShowStatusTemp,
        positiveSu: showPositiveSu,
        negativeSu: showNegtiveSu
      })
    },
    //接口——获取recipe id
    pageData1: function () {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('userId'),
          "conLink": " and "
        }, {
          "conParam": "evalution_report_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('reportID')
        }],
        "returnParam": ""
      }
      api.userPsychoRecipe(params).then(res =>{
        that.setData({
          recipeID: res.data.id,
          description: res.data.description
        })
      }).catch(function (error) {})
    },
    //接口——可能诱因、调节原则
    pageData2: function () {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('userId'),
          "conLink": " and "
        }, {
          "conParam": "user_psycho_recipe_id",
          "conEqua": "=",
          "conVal": that.data.recipeID
        }],
        "returnParam": ""
      }
      api.userPsychoRisk(params).then(res => {
        let defaultType = '' //告诉策略，默认展示的对应类型
        let maybeCause = ''
        let ragulationPrincple = ''
        let starCou = ''
        let starNam = ''
        let recordNum = 0
        let btnShowStatusTemp = that.data.btnShowStatus
        let sugtip = 0
        for (let i = 0; i < res.data.length; i++) {
          let typeId = res.data[i].psychoRiskType
          btnShowStatusTemp[typeId] = 0 //未点击状态
          let psychoRiskLevelTemp = res.data[i].psychoRiskLevel
          if (i == recordNum && psychoRiskLevelTemp > 1) {
            recordNum -= 10
            defaultType = typeId
            btnShowStatusTemp[typeId] = 1 //点击状态,默认展示的第一条数据
            maybeCause = res.data[i].cause
            ragulationPrincple = res.data[i].treatmentPrinciple
            starCou = psychoRiskLevelTemp
            starNam = psychologyDegree[starCou - 1]
            sugtip = 1
          } else {
            recordNum += 1
          }
          if (psychoRiskLevelTemp <= 1) {
            btnShowStatusTemp[typeId] = 2 //不可点击状态
          }
        }
        that.setData({
          hideSug: sugtip
        })
        that.setData({
          firstData: res.data,
          btnShowStatus: btnShowStatusTemp,
          maybeCause: maybeCause,
          ragulationPrincple: ragulationPrincple,
          starCount: starCou,
          starName: starNam
        })
        that.pageData3(defaultType)
        that.pageData4(defaultType)
      }).catch(function (error) {})
    },
    //接口——应对策
    pageData3: function (defaultType) {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('userId'),
          "conLink": " and "
        }, {
          "conParam": "user_psycho_recipe_id",
          "conEqua": "=",
          "conVal": that.data.recipeID,
          "conLink": " and "
        }, {
          "conParam": "is_ok",
          "conEqua": "=",
          "conVal": 1
        }],
        "returnParam": ""
      }
      api.userPsychoStrategy(params).then(res => {
        let sugArrAll = new Array()
        let sugArr = new Array()
        for (let i = 0; i < res.data.length; i++) {
          let resTypeId = res.data[i].riskType
          if (defaultType == resTypeId) {
            sugArr.push(res.data[i])
          }
          sugArrAll.push(res.data[i])
        }
        that.setData({
          positiveSuAll: sugArrAll,
          positiveSu: sugArr
        })
      }).catch(function (error) {})
    },
    //接口——不建议应对策
    pageData4: function (defaultType) {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('userId'),
          "conLink": " and "
        }, {
          "conParam": "user_psycho_recipe_id",
          "conEqua": "=",
          "conVal": that.data.recipeID,
          "conLink": " and "
        }, {
          "conParam": "is_ok",
          "conEqua": "=",
          "conVal": 0
        }],
        "returnParam": ""
      }
      api.userPsychoStrategy(params).then(res => {
        let sugArr = new Array()
        let sugArrAll = new Array()
        for (let i = 0; i < res.data.length; i++) {
          let resTypeId = res.data[i].riskType
          if (defaultType == resTypeId) {
            sugArr.push(res.data[i])
          }
          sugArrAll.push(res.data[i])
        }
        that.setData({
          negativeSuAll: sugArrAll,
          negativeSu: sugArr
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
        that.getPhoneByProvince(birth_province);   
        that.setData({
          birth_province: birth_province
        })
      })
    },
   //获取地区热线及电话号码
   getPhoneByProvince:function(province){
    let that = this
      let param = {
        province:province
      }
      api.psychoServicePhone(param).then(res => {
        let telephone = res.data.telephone;
        let serviceTime =  res.data.serviceTime;   
        that.setData({
          telephone: telephone,
          serviceTime:serviceTime
        })
      })
   }
  }
})