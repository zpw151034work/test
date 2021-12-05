//引入echarts
import * as echarts from '../../commpents/ec-canvas/echarts';
import api from '../../utils/api';
//获取应用实例
const app = getApp()
let utils = require("../../utils/util.js")
var reportID = 0;
var riskDegree = ["低", "中", "高"];
var psychologyDegree = ["正常", "轻度", "中度", "重度"];
var sleepDegree = ["良好", "一般", "不足", "很差"];
var sportDegree = ["良好", "一般", "不足"];
var nutritionDegree = ["不足", "适宜", "超量", "高危"];
let chart2 = null;
let chart1 = null;
//条形
function healthScore(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart2);
  return chart2;
}
//雷达图
function healthEvaluation(canvas, width, height, dpr) {
  chart1 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart1);
  return chart1;
}
Page({
  data: {
    pluginDataRisk: [],
    pluginDataPsychology: [],
    pluginDataSleep: [],
    pluginDataSport: [],
    pluginDataNutrition: [],
    risk: {},
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康评估报告', //导航栏 中间的标题
    },
    //健康得分
    healthScore: {
      onInit: healthScore,
    },
     //健康评价
     healthEvaluation: {
      onInit: healthEvaluation,
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    patientName: '',
    patientSex: '',
    patientAge: '',
    patientDisease: '',
    patientDiseaseStage: '',
    patientHealthScore: '',
    healthAssmentTagart: '',
    nurseAssessment: "",
    manageAssessment: "",
    echartData: [],
    diseaseRadar:'',
    nutrientRadar:'',
    psychoRadar:'',
    sportRadar:'',
    sleepRadar:'',
  },
  //echarts的方法
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  onLoad: function (option) {
    reportID = wx.getStorageSync('reportID')
    this.orignalData()
    // this.sixthInterface()
    this.getHealthEvaluation(option)
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
  },
  onReady() {
    this.sixthInterface()
  },
  /**
   * 初始数据加载的接口
   * 点击
   */
  orignalData: function () {
    this.firstInterface()
    this.secondInterface()
    this.forthdInterface()
    this.fifthInterface()
  },
  //健康评估echarts数据展示
  getEchartsScore: function (echartsData, timeData) {

    let that = this;
    var option = {
      backgroundColor: '#F5F5F5',
      color: ['#9B9B9B'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true,
        formatter: (params) => {
          // reportID = that.data.echartData[params.dataIndex].reportID
          // that.orignalData()
        }
      },
      grid: {
        left: 5,
        right: 20,
        bottom: 15,
        top: 80,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          show: false
        },
        data:timeData,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color: '#666',
          interval:0,
          // formatter: function (value) {
          //   var t_date = new Date(value);
          //   let getMonth = (t_date.getMonth() + 1)>10?(t_date.getMonth() + 1):"0"+(t_date.getMonth() + 1);
          //   let getDate = t_date.getDate()>9?t_date.getDate():"0"+t_date.getDate();
          //   return getMonth+"/"+getDate
          // }
        }
      }],
      yAxis: [{
        type: 'value',
        show: false,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }],
      dataZoom: [{
        type: 'inside',
        start: 80,
        end: 100,
        show: false,
      }],
      // }, {
      //   start: 0,
      //   end: 20,
      //   show: false,
      // }],
      series: [{
        name: '健康得分',
        type: 'bar',
        barWidth:20,
        data: echartsData,
        label: {
          show: true, 
          rotate: 30, 
          position: 'top',
          distance: 20, 
          verticalAlign: 'middle',
          formatter: function (params) { //有零不显示
                if (params.value > 0) {
                  return params.value;
                } else {
                  return '';
                }
              },
          textStyle: {
            color: '#82ce79',
            fontSize: 12
          }
        },
        
        itemStyle: {
          barBorderRadius: [10,10,0,0],
          emphasis: {
            color: '#64B55B'
           }
         }
       },
      ]
    };
    setTimeout(() => {
      chart2.clear();
      chart2.setOption(option);     
      chart2.on('click', function (params) {
        reportID = that.data.echartData[params.dataIndex].reportID
        that.orignalData()
      })
    }, 1000);
  },
  //健康评价
  getHealthEvaluation: function (option) {
    let that = this;
    let diseaseRadar= (option.diseaseRadar==null?0:option.diseaseRadar);
    let nutrientRadar= (option.nutrientRadar==null?0:option.nutrientRadar);
    let psychoRadar = (option.psychoRadar==null?0:option.psychoRadar);
    let sportRadar =(option.sportRadar==null?0:option.sportRadar);
    let sleepRadar = (option.sleepRadar==null?0:option.sleepRadar);
    var option = {
         radar: {
          // shape: 'circle',
          indicator: [
              { name: '运动', max:1 },
              { name: '疾病', max:1 },
              { name: '营养', max:1},
              { name: '睡眠', max:1},
              { name: '心理', max:1},
          ]
      },
      series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          data: [
              {
                  value: [sportRadar, diseaseRadar, nutrientRadar, sleepRadar, psychoRadar],
                  name: ''
              },
             
          ]
      }]
  };
    setTimeout(() => {
      chart1.clear();
      chart1.setOption(option);     
    }, 1000);
  },

  //页面数据展示今天
  // getPage: function () {
  //   let that = this;
  //   let params = {
  //     "endTime": utils.today + " 23:59:59",
  //     "startTime": utils.today + " 00:00:00",
  //   }
  btnClick: function () {
    wx.navigateTo({
      url: '../healthManagement/program/index?name=营养'
    })
  },
  /**
   * 第一部分接口
   * 风险，运动，心理，睡眠，营养
   */
  firstInterface: function () {
    let that = this
    let param = {
      "conditionerList": [{
        "conParam": "user_id",
        "conEqua": "=",
        "conVal": wx.getStorageSync("userId"),
        "conLink": " and "
      }, {
        "conParam": "report_id",
        "conEqua": "=",
        "conVal": reportID
      }],
      "returnParam": ""
    }
    api.userHealthEvaluation(param).then(res => {
      if (res.data.report_id == reportID) {
        // 风险评估
        let riskArr = new Array()
        //并发症
        let complication = res.data.complication_effect
        if (complication != null) {
          let complicationRes = that.firstDataSet(complication, '并发症风险', 3, riskDegree)
          riskArr.push(complicationRes)
        }
        //营养不良风险
        let nutrient_bad = res.data.nutrient_bad_effect
        if (nutrient_bad != null) {
          let nutrient_badRes = that.firstDataSet(nutrient_bad, '营养不良风险', 3, riskDegree)
          riskArr.push(nutrient_badRes)
        }
        //心理健康风险
        let psycho_effect = res.data.psycho_effect
        if (psycho_effect != null) {
          let psycho_effectRes = that.firstDataSet(psycho_effect, '心理健康风险', 3, riskDegree)
          riskArr.push(psycho_effectRes)
        }
        //运动障碍风险
        let sport_effect = res.data.sport_effect
        if (sport_effect != null) {
          let sport_effectRes = that.firstDataSet(sport_effect, '运动障碍风险', 3, riskDegree)
          riskArr.push(sport_effectRes)
        }
        that.setData({
          pluginDataRisk: riskArr
        })
        //心理评估
        let psychologyArr = new Array()
        //躯体化障碍
        let somatic = res.data.somatic_disorder_effect
        if (somatic != null) {
          let somaticRes = that.firstDataSet(somatic, '躯体化障碍', 4, psychologyDegree)
          psychologyArr.push(somaticRes)
        }
        //强迫症状
        let forced_effect = res.data.forced_effect
        if (forced_effect != null) {
          let forced_effectRes = that.firstDataSet(forced_effect, '强迫症状', 4, psychologyDegree)
          psychologyArr.push(forced_effectRes)
        }
        //人际关系敏感
        let relationship_effect = res.data.relationship_effect
        if (relationship_effect != null) {
          let relationship_effectRes = that.firstDataSet(relationship_effect, '人际关系敏感', 4, psychologyDegree)
          psychologyArr.push(relationship_effectRes)
        }
        //抑郁情绪
        let depression_effect = res.data.depression_effect
        if (depression_effect != null) {
          let depression_effectRes = that.firstDataSet(depression_effect, '抑郁情绪', 4, psychologyDegree)
          psychologyArr.push(depression_effectRes)
        }
        //焦虑情绪
        let anxiety_effect = res.data.anxiety_effect
        if (anxiety_effect != null) {
          let anxiety_effectRes = that.firstDataSet(anxiety_effect, '焦虑情绪', 4, psychologyDegree)
          psychologyArr.push(anxiety_effectRes)
        }
        //敌对情绪
        let enemy_effect = res.data.enemy_effect
        if (enemy_effect != null) {
          let enemy_effectRes = that.firstDataSet(enemy_effect, '敌对情绪', 4, psychologyDegree)
          psychologyArr.push(enemy_effectRes)
        }
        //恐怖情绪
        let terror_effect = res.data.terror_effect
        if (terror_effect != null) {
          let terror_effectRes = that.firstDataSet(terror_effect, '恐怖情绪', 4, psychologyDegree)
          psychologyArr.push(terror_effectRes)
        }
        //偏执
        let paranoid_effect = res.data.paranoid_effect
        if (paranoid_effect != null) {
          let paranoid_effectRes = that.firstDataSet(paranoid_effect, '偏执', 4, psychologyDegree)
          psychologyArr.push(paranoid_effectRes)
        }
        //精神病倾向
        let psychosis_effect = res.data.psychosis_effect
        if (psychosis_effect != null) {
          let psychosis_effectRes = that.firstDataSet(psychosis_effect, '精神病倾向', 4, psychologyDegree)
          psychologyArr.push(psychosis_effectRes)
        }
        that.setData({
          pluginDataPsychology: psychologyArr
        })
        //睡眠评估
        let sleepArr = new Array()
        //睡眠质量
        let sleep_quality = res.data.sleep_quality
        if (sleep_quality != null) {
          let sleep_qualityRes = that.firstDataSet(sleep_quality, '睡眠质量', 4, sleepDegree)
          sleepArr.push(sleep_qualityRes)
        }
        //睡眠时长
        let sleep_duration = res.data.sleep_duration
        if (sleep_duration != null) {
          let sleep_durationRes = that.firstDataSet(sleep_duration, '睡眠时长', 4, sleepDegree)
          sleepArr.push(sleep_durationRes)
        }
        that.setData({
          pluginDataSleep: sleepArr
        })
        //运动评估
        let sportArr = new Array()
        //运动能力
        let sport_ablility = res.data.sport_ablility
        if (sport_ablility != null) {
          let sport_ablilityRes = that.firstDataSet(sport_ablility, '运动能力', 3, sportDegree)
          sportArr.push(sport_ablilityRes)
        }
        //运动耗能
        let sport_energy = res.data.sport_energy
        if (sport_energy != null) {
          let sport_energyRes = that.firstDataSet(sport_energy, '运动耗能', 3, sportDegree)
          sportArr.push(sport_energyRes)
        }
        that.setData({
          pluginDataSport: sportArr
        })
        //营养评估
        let nutritionArr = new Array()
        //营养不良风险
        // let nutrient_bad_effect = res.nutrient_bad_effect
        // if (nutrient_bad_effect != null) {
        //   let nutrient_bad_effectRes = that.firstDataSet(nutrient_bad_effect, '营养不良风险', 4, nutritionDegree)
        //   nutritionArr.push(nutrient_bad_effectRes)
        // }
        //能量摄入
        let nutrient_effect = res.data.nutrient_effect
        if (nutrient_effect != null) {
          let nutrient_effectRes = that.firstDataSet(nutrient_effect, '能量摄入', 3, nutritionDegree)
          nutritionArr.push(nutrient_effectRes)
        }
        //碳水化合物
        let carbon_effect = res.data.carbon_effect
        if (carbon_effect != null) {
          let carbon_effectRes = that.firstDataSet(carbon_effect, '碳水化合物', 3, nutritionDegree)
          nutritionArr.push(carbon_effectRes)
        }
        //蛋白质
        let protein_effect = res.data.protein_effect
        if (protein_effect != null) {
          let protein_effectRes = that.firstDataSet(protein_effect, '蛋白质', 3, nutritionDegree)
          nutritionArr.push(protein_effectRes)
        }
        //脂肪
        let fat_effect = res.data.fat_effect
        if (fat_effect != null) {
          let fat_effectRes = that.firstDataSet(fat_effect, '脂肪', 3, nutritionDegree)
          nutritionArr.push(fat_effectRes)
        }
        that.setData({
          pluginDataNutrition: nutritionArr
        })
      }
    })
  },
  /**
   * 第一部分数据，各种评估的数据准备
   */
  firstDataSet: function (resource, nameStr, count, degree) {
    let tempRes = parseInt(resource)
    tempRes -= 1
    let tempObject = {
      name: nameStr,
      gradeColor: [],
      Grade: ''
    }
    let gradeTemp = ''
    for (var i = 0; i < count; i++) {
      let gradeColorObject = {
        background: "",
        isShow: false
      }
      if (i == 0) {
        gradeColorObject.background = '#64B55B'
      }
      if (i == 1) {
        gradeColorObject.background = '#F9C644'
      }
      if (i == 2) {
        gradeColorObject.background = '#FAA32C'
      }
      if (i == 3) {
        gradeColorObject.background = '#FC7D00'
      }
      if (tempRes == i) {
        gradeTemp = degree[i]
        gradeColorObject.isShow = true
      } else {
        gradeColorObject.isShow = false
      }
      tempObject.gradeColor.push(gradeColorObject)
    }
    tempObject.Grade = gradeTemp
    return tempObject
  },
  /**
   * 第二部分接口
   * 病人姓名 性别 年龄  疾病  阶段 得分
   */
  secondInterface: function () {
    let that = this
    let param = {
      "conditionerList": [{
        "conParam": "user_id",
        "conEqua": "=",
        "conVal": wx.getStorageSync("userId"),
        "conLink": "and"
      }, {
        "conParam": "id",
        "conEqua": "=",
        "conVal": reportID
      }],
      "returnParam": ""
    }
    api.userEvaluationReport(param).then(res => {

      if (res.data.id == reportID) {
         
        that.setData({
          patientDisease: res.data.disease == null ? '' : res.data.disease,
          patientDiseaseStage: res.data.health_stage == null ? '' : res.data.health_stage,
          patientHealthScore: res.data.score == null ? '' : res.data.score
        })
      }
    })
  },

  /**
   * 第四部分接口
   */
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
      let sexTemp = res.data.sex
      let sexStr = ''
      if (sexTemp == '1') {
        sexStr = '男'
      } else if (sexTemp == '2') {
        sexStr = '女'
      }
      wx.setStorageSync({'city':res.data.city})
      that.setData({
        patientName: res.data.user_name == null ? '' : res.data.user_name,
        patientSex: sexStr,
        patientAge: res.data.age == null ? '' : res.data.age
      })
    })
  },

  /**
   * 第五部分接口
   * 并发症、健康管理目标、护理评估
   */
  fifthInterface: function () {
    let that = this
    let param = {
      "conditionerList": [{
        "conParam": "id",
        "conEqua": "=",
        "conVal": reportID,
        "conLink": ""
      }],
      "returnParam": ""
    }
    api.userEvaluationReport(param).then(res => {
      let nurseTemp = ''
      if (res.data.nurse_level == '医学护理') {
        nurseTemp = 0
      }
      if (res.data.nurse_level == '家庭护理') {
        nurseTemp = 1
      }
      if (res.data.nurse_level == '自我护理') {
        nurseTemp = 2
      }
      let manageAssessmentTemp = ''
      if (res.data.plan_time == '强化管理') {
        manageAssessmentTemp = 0
      }
      if (res.data.plan_time == '规划化管理') {
        manageAssessmentTemp = 1
      }
      if (res.data.plan_time == '生活方式管理') {
        manageAssessmentTemp = 2
      }
      that.setData({
        healthAssmentTagart: res.data.health_target,
        nurseAssessment: nurseTemp,
        manageAssessment: manageAssessmentTemp
      })
    })
  },
  /**
   * 第六部分接口
   * 柱状图
   */
  sixthInterface: function () {
    let that = this
    let param = {
        "endTime":utils.today+" 23:59:59",
        "startTime":utils.daysAgo(),
        "count":30,
        "userId": wx.getStorageSync("userId")
    }
    api.userEvaluationReportGetList(param).then(function (res) {
      let size = res.data.length
      let dataObArr = []
      for (let i = 0; i < size; i++) {
        let dataOb = {
          date: '',
          reportID: '',
          score: ''
        }
        let dateTemp = res.data[i][0]
        let dateArr = dateTemp.split("-")
        let dateStr = dateArr[1] + "/" + dateArr[2]
        dataOb.date = dateStr
        dataOb.reportID = res.data[i][1]
        dataOb.score = res.data[i][2]
        dataObArr.push(dataOb)
      }
      that.setData({
        echartData: dataObArr
      })
      let echartsData = [];
      let timeData = [];
      that.data.echartData.forEach(function (item, index, array) {
        echartsData.push(item.score);
        timeData.push(item.date);
      });
      that.getEchartsScore(echartsData, timeData);
    })

  }

})