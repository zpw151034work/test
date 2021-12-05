//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
let api = require("../../../utils/api.js")
Page({
  data: {
    navbarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '健康管理', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    statusBarHeightX: "", //适配机型
    isIphoneX: "",
    //页面tab数据
    imgUrl: utils.IMG_URL,
    list: [{
        image: utils.IMG_URL + "/main/营养.png",
        name: "营养",
        url: "pages/healthManagement/nutritionProgramme/index"
      },
      {
        image: utils.IMG_URL + "/main/运动.png",
        name: "运动",
        url: "pages/healthManagement/exerciseProgram/index"
      },
      {
        image: utils.IMG_URL + "/main/睡眠.png",
        name: "睡眠",
        url: "pages/healthManagement/tcmProgram/index"
      },
      {
        image: utils.IMG_URL + "/main/心理.png",
        name: "心理",
        url: "pages/healthManagement/tcmProgram/index"
      },
      {
        image: utils.IMG_URL + "/main/护理.png",
        name: "用药",
        url: "pages/healthManagement/medicationProgram/index"
      },
    ],
    active: "1",
    taskData: [{
      "title": "摄入足量的蛋白质"
    }],
    author: 0, //是否授权和扫码院机
    hospital: '', //扫码后获取医院的名字
    department: '', //扫码后获取科室的名字
    healthAssementScore: '', //健康得分
    nutritionScore: '', //营养指数
    sportScore: '', //运动指数
    psychologyScore: '', //心理指数
    sleepScore: '', //睡眠指数
    time: '', //指数的创建时间
    nickName: '',
    earlyWarning: '', //首页显示预警
    earlyWarningArr: '', //预警所有数据
    nutritionScoreColor: '',
    sportScoreColor: '',
    psychologyScoreColor: '',
    sleepScoreColor: '',
    hospManageHeight: 466,
    diseaseRadar: '',
    nutrientRadar: '',
    psychoRadar: '',
    sportRadar: '',
    sleepRadar: '',
    hospManageData: [{
        time: "1",
        data: [{
          name: "身份信息确认"
        }, {
          name: "疾病信息确认"
        }, {
          name: "期望管理目标确认"
        }, {
          name: "随访时间确认（1)"
        }, {
          name: "随访方式确认"
        }, {
          name: "服务确认与语音授权"
        }]
      },
      {
        time: "2",
        data: [{
          name: "疾病状态评估（1)"
        }, {
          name: "生命体征监测指导"
        }, {
          name: "复诊、拿药时间确认"
        }, {
          name: "三级预防健康宣教"
        }]
      },
      {
        time: "3",
        data: [{
          name: "不良症状访视与分析"
        }, {
          name: "预警症状提醒与宣教"
        }, {
          name: "不良生活习惯改善计划（减烟、减酒）"
        }]
      },
      {
        time: "4",
        data: [{
          name: "饮食原则宣教，食谱推荐"
        }, {
          name: "营养原则宣教，初识营养素"
        }, {
          name: "运动方案指导，运动方式推荐"
        }]
      },
      {
        time: "5",
        data: [{
          name: "心理状态评估与指导"
        }, {
          name: "睡眠状态评估与指导"
        }]
      },
      {
        time: "6",
        data: [{
          name: "诊后1周复诊提醒，便民服务"
        }, {
          name: "膳食结构执行情况评估"
        }, {
          name: "运动情况执行情况评估"
        }]
      },
      {
        time: "7",
        data: [{
          name: "复诊后，用药记录"
        }, {
          name: "异常指标结果分析"
        }, {
          name: "急症处理措施宣教"
        }]
      },
      {
        time: "8",
        data: [{
          name: "预警症状提醒与宣教"
        }, {
          name: "饮食强化宣教，食谱推荐（调整1次后）"
        }, {
          name: "运动强化宣教，方案指导（调整1次后）"
        }]
      },
      {
        time: "9",
        data: [{
          name: "强化不良生活习惯改善措施"
        }, {
          name: "患者服务改善意见收集"
        }, {
          name: "三级预防健康教育"
        }]
      },
      {
        time: "10",
        data: [{
          name: "诊后1月复诊拿药提醒"
        }, {
          name: "膳食结构执行情况评估（第2次）"
        }, {
          name: "运动情况执行情况评估（第2次）"
        }]
      },
      {
        time: "11",
        data: [{
          name: "复诊后，用药记录"
        }, {
          name: "预警症状提醒与宣教"
        }, {
          name: "异常化验指标预警与提醒"
        }, {
          name: "急症处理措施宣教"
        }]
      },
      {
        time: "12",
        data: [{
          name: "食谱优化后推荐（调整2次后）"
        }, {
          name: "运动方案优化后推荐（调整2次后）"
        }, {
          name: "不良症状访视"
        }]
      },
      {
        time: "13",
        data: [{
          name: "不良症状分析"
        }, {
          name: "异常指标结果分析"
        }, {
          name: "异常症状预警与提醒"
        }]
      },
      {
        time: "14",
        data: [{
          name: "坐席满意度评价（1）"
        }, {
          name: "医院满意度评价（2）"
        }, {
          name: "患者服务改善意见收集（2）"
        }]
      },
      {
        time: "15",
        data: [{
          name: "膳食结构执行情况评估（第2次）"
        }, {
          name: "运动情况执行情况评估（第2次）"
        }, {
          name: "随访时间确认（2）"
        }]
      },
      {
        time: "16",
        data: [{
          name: "个人食谱优化后推荐（调整3次后）"
        }, {
          name: "运动方案优化后推荐（调整3次后）"
        }]
      },
      {
        time: "17",
        data: [{
          name: "患者服务改善意见收集"
        }, {
          name: "心理状态中期评估"
        }, {
          name: "睡眠状态中期评估"
        }]
      },
      {
        time: "18",
        data: [{
          name: "心理状态改善方案"
        }, {
          name: "睡眠质量提升方案"
        }]
      },
      {
        time: "19",
        data: [{
          name: "并发症评测与宣教"
        }, {
          name: "三级预防健康教育"
        }]
      },
      {
        time: "20",
        data: [{
          name: "诊后2月复诊拿药提醒，安排挂号"
        }, {
          name: "膳食结构执行情况评估（第3次）"
        }, {
          name: "运动情况执行情况评估（第3次）"
        }]
      },
      {
        time: "21",
        data: [{
          name: "健康画像二次全面采集"
        }, {
          name: "管理效果评价与问题分析"
        }, {
          name: "患者方案需求收集"
        }]
      },
      {
        time: "22",
        data: [{
          name: "推荐适宜食谱组（调整4次后）"
        }, {
          name: "推荐进阶后运动方案（调整4次后）"
        }, {
          name: "营养原则宣教"
        }, {
          name: "安全运动宣教"
        }]
      },
      {
        time: "23",
        data: [{
          name: "异常症状预警与提醒"
        }, {
          name: "急症处理措施宣教"
        }, {
          name: "运动损伤急性处理宣教"
        }]
      },
      {
        time: "24",
        data: [{
          name: "心理疏导"
        }, {
          name: "病因及危险因素宣教"
        }, {
          name: "强化不良生活习惯改善的益处"
        }]
      },
      {
        time: "25",
        data: [{
          name: "并发症评测与宣教"
        }, {
          name: "用药不良反应评测"
        }]
      },
      {
        time: "26",
        data: [{
          name: "不良症状访视"
        }, {
          name: "异常指标结果分析"
        }, {
          name: "心理疏导"
        }]
      },
      {
        time: "27",
        data: [{
          name: "饮食记录"
        }, {
          name: "食谱执行评估价"
        }]
      },
      {
        time: "28",
        data: [{
          name: "运动记录"
        }, {
          name: "运动方案执行评价"
        }]
      },
      {
        time: "29",
        data: [{
          name: "睡眠记录与评价"
        }, {
          name: "心理记录与评价"
        }, {
          name: "疾病状态评估（2）"
        }]
      },
      {
        time: "30",
        data: [{
          name: "诊后3月复诊拿药提醒，便民服务"
        }, {
          name: "坐席满意度评价（第3次）"
        }, {
          name: "医院满意度评价（1)"
        }, {
          name: "患者服务改善意见收集（4）"
        }]
      }
    ]
  },
  scanCode: function () {
    let that = this
    // let result = "图一方法非常,19880211,内蒙古自治区,7,1,2,170,50,2,1,1,C43.400,1,0,1,1,0,0-1-2,R42.x00x004-R51.x00,0-1-2-3,3,0,2,0,1,3.0,0.5,1.0,1.0,1.0,0.5,1.0,1.0,1.0,1,1,1,2,1,2,1,1,2,1,2,1,2,0,0,1,0,1,1,1,2,1,2,p,1,2,1,2,1,2,0,2,1,0,3,1,0,1,3,0,0,4,1,1,1,0,4,0,1,2,3,0,3,0,2,1,4,0,1,2,1,1,0,3,0,3,0,2,1,0,4,2,0,2,1,3,1,1,0,0,4,0,4,0,1,2,1,3,3,4,2,2,1,0,2,0,2,1,1,2,2,1,2,1,1,1,2,1,2,1,2,2,1,s,23,0,6,7,0,1,2,1,2,1,2,1,2,1,0,2,1,1,1,北京测试医院-外科"
    // wx.showLoading({
    //   title: '请稍等。。。',
    // })
    // that.requestHelthReport(result)
    // console.log('scanCode')
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {

        wx.showLoading({
          title: '请等待。。。',
        })
        that.requestHelthReport(res.result)
      }
    })
  },
  //跳转健康评估报告
  healthScore: function () {
    wx.navigateTo({
      url: '../../../pages/healthAssessment/index?diseaseRadar=' + this.data.diseaseRadar + '&nutrientRadar=' + this.data.nutrientRadar + '&psychoRadar=' + this.data.psychoRadar + '&sportRadar=' + this.data.sportRadar + '&sleepRadar=' + this.data.sleepRadar,
    })
  },
  //跳转健康预警页面
  healthVarning: function () {
    let that = this
    if (that.data.earlyWarning == "最大的预警就是还没开始健康行动") {} else {
      let temp = JSON.stringify(that.data.earlyWarningArr)
      wx.navigateTo({
        url: '../../../pages/healthManagement/healthWarning/index?data=' + temp
      })
    }
  },
  /**
   * 跳转对应的方案
   * @param {*} item 
   */
  itemClick: function (item) {
    let that = this;
    wx.navigateTo({
      url: '../../../pages/healthManagement/program/index?name=' + item.currentTarget.dataset.item.name
    })
  },
  //页面加载
  onLoad: function (options) {
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    let statusBarHeightX;
    if (app.globalData.isIphoneX == true) {
      statusBarHeightX = app.globalData.statusBarHeight + 128
    } else if (app.globalData.isIphoneX == false) {
      statusBarHeightX = app.globalData.statusBarHeight + 94
    }
    _this.setData({
      statusBarHeight: statusBarHeight,
      statusBarHeightX: statusBarHeightX,
      nickName: wx.getStorageSync('userInfo').nickName
    })
    let isIphoneX = app.globalData.isIphoneX;
    _this.setData({
      isIphoneX: isIphoneX
    })
    // _this.setHealthData();
    let healthAssessmentTemp = wx.getStorageSync('healthAssement')
    if (healthAssessmentTemp == 1 || healthAssessmentTemp == 2) {
      wx.setStorageSync('healthAssement', 0)
      setTimeout(() => {
        wx.navigateTo({
          url: '../../../pages/healthAssessment/index?diseaseRadar=' + this.data.diseaseRadar + '&nutrientRadar=' + this.data.nutrientRadar + '&psychoRadar=' + this.data.psychoRadar + '&sportRadar=' + this.data.sportRadar + '&sleepRadar=' + this.data.sleepRadar,
        })
      }, 500)
    }

  },
  onShow: function () {
    let that = this
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 0
      })
    }
    that.setHealthData();

    let healthAssessmentTemp = wx.getStorageSync('healthAssement')
    if (healthAssessmentTemp == 2 || healthAssessmentTemp == 3) {
      wx.setStorageSync('healthAssement', 0)
      setTimeout(() => {
        wx.navigateTo({
          url: '../../../pages/healthAssessment/index?diseaseRadar=' + this.data.diseaseRadar + '&nutrientRadar=' + this.data.nutrientRadar + '&psychoRadar=' + this.data.psychoRadar + '&sportRadar=' + this.data.sportRadar + '&sleepRadar=' + this.data.sleepRadar,
        })
      }, 500)
    }
  },
  setHealthData: function () {
    this.setData({
      hospital: wx.getStorageSync('hospitalName'),
      department: wx.getStorageSync('departmentName'),
    })
    this.pageData1()
    this.pageData2()
    this.pageData3()
    this.pageData4()
  },
  /**
   * 判断是否跳转
   */
  showPanel: function () {
    let author = wx.getStorageSync('author')
    if (author == "authoCancel") { //没有通过授权过来
      _this.setData({
        author: 1
      })
    } else if (author == "noScan") { //授权后没有扫描院机二维码
      _this.setData({
        author: 2
      })
    }
  },

  //页面数据——营养、运动、心理、睡眠 
  pageData1: function () {
    let that = this
    let params = {
      "conditionerList": [{
        "conParam": "user_id",
        "conEqua": "=",
        "conVal": wx.getStorageSync('userId')
      }],
      "returnParam": ""
    }
    api.userHealtFfindMaxKey(params).then(res => {
      let d = new Date(res.data.create_time)
      let month = d.getMonth() + 1
      let temp = d.getFullYear() + "." + month + "." + d.getDate()
      wx.setStorageSync('reportID', res.data.report_id)
      let nutritionScoreTemp = res.data.nutrient_score
      nutritionScoreTemp = that.indexScoreArrange(nutritionScoreTemp)
      let nutritionColor = that.indexColor(nutritionScoreTemp)

      let sportScoreTemp = res.data.sport_score
      sportScoreTemp = that.indexScoreArrange(sportScoreTemp)
      let sportColor = that.indexColor(sportScoreTemp)

      let psychologyScoreTemp = res.data.psycho_score
      psychologyScoreTemp = that.indexScoreArrange(psychologyScoreTemp)
      let psychologyColor = that.indexColor(psychologyScoreTemp)

      let sleepScoreTemp = res.data.sleep_score
      sleepScoreTemp = that.indexScoreArrange(sleepScoreTemp)
      let sleepColor = that.indexColor(sleepScoreTemp)
      //生成报告时间
      wx.setStorageSync('create_time', res.data.create_time)
      that.hospManage();
      that.setData({
        nutritionScore: nutritionScoreTemp,
        sportScore: sportScoreTemp,
        psychologyScore: psychologyScoreTemp,
        sleepScore: sleepScoreTemp,
        time: temp,
        nutritionScoreColor: nutritionColor,
        sportScoreColor: sportColor,
        psychologyScoreColor: psychologyColor,
        sleepScoreColor: sleepColor,
        diseaseRadar: res.data.disease_radar_score,
        nutrientRadar: res.data.nutrient_radar_score,
        psychoRadar: res.data.psycho_radar_score,
        sportRadar: res.data.sport_radar_score,
        sleepRadar: res.data.sleep_radar_score,
      })
    }).catch(function (error) {

    })
  },
  /**
   * 指数的数据整理，显示整数，且判断>100 || <0的情况
   */
  indexScoreArrange: function (originalScore) {
    let scoreTemp = originalScore.toFixed(0)
    if (scoreTemp > 100) {
      scoreTemp = 100
    }
    if (scoreTemp < 0) {
      scoreTemp = 0
    }
    return scoreTemp
  },
  /**
   * 营养、运动、心理、睡眠 四个指数的颜色值
   */
  indexColor: function (score) {
    if (score <= 33) {
      return "#FA6A27"
    } else if (66 > score && score > 33) {
      return "#F5A623"
    } else if (66 <= score && score <= 100) {
      return "#64B55B"
    }
  },
  //页面数据——健康得分
  pageData2: function () {
    let that = this
    let params = {
      "conditionerList": [{
        "conParam": "user_id",
        "conEqua": "=",
        "conVal": wx.getStorageSync('userId')
      }],
      "returnParam": "id,score"
    }
    api.userEvaluationFindMaxKey(params).then(res=> {
      wx.hideLoading()
      that.setData({
        healthAssementScore: res.data.score
      })
    }).catch(function (error) {

    })
  },
  //页面数据——预警
  pageData3: function () {
    let that = this
    let d = new Date()
    let month = d.getMonth() + 1
    let timeStrTemp = d.getFullYear() + "-" + month + "-" + d.getDate()
    let timeStrStart = timeStrTemp + " 00:00:00"
    let timeStrEnd = timeStrTemp + " 23:59:59"
    // console.log('55555',timeStrStart,timeStrEnd)
    let params = {
      "conditionerList": [{
          "conParam": "create_time",
          "conEqua": ">=",
          "conVal": timeStrStart,
          "conLink": "and"
        },
        {
          "conParam": "create_time",
          "conEqua": "<=",
          "conVal": timeStrEnd,
          "conLink": "and"
        },
        {
          "conParam": "report_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('reportID')
        }
      ],
      "returnParam": ""
    }
    api.findByCondition(params).then(res => {
      wx.hideLoading()
      let earlyWarningTemp = "最大的预警就是还没开始健康行动"
      console.log(res)
      if (res.data != 'null' && res.data.length > 0) {
        earlyWarningTemp = "您今天有" + res.data.length + "条预警，请查看"
      }
      that.setData({
        earlyWarning: earlyWarningTemp,
        earlyWarningArr: res.data
      })
    }).catch(function (error) {

    })
  },
  //页面数据——获取医院和科室
  pageData4: function () {
    let that = this
    let params = {
      "conditionerList": [{
        "conParam": "report_id",
        "conEqua": "=",
        "conVal": wx.getStorageSync('reportID')
      }],
      "returnParam": ""
    }
    api.findMapByCondition(params).then(res => {

      //接口访问成功后记录扫码获取的医院信息
      let hospitalNameTemp = res.data.hospital
      let departmentNameTemp = res.data.department
      if (hospitalNameTemp == null || hospitalNameTemp.length < 3) {
        hospitalNameTemp = ''
      }
      if (departmentNameTemp == null) {
        departmentNameTemp = ''
      }
      wx.setStorageSync('hospitalName', hospitalNameTemp)
      wx.setStorageSync('departmentName', departmentNameTemp)
      that.setData({
        hospital: hospitalNameTemp
      });
      that.setData({
        department: departmentNameTemp
      });

    }).catch(function (error) {})
  },
  /**
   * 扫码上传广告机字符串，获取健康评估id
   */
  requestHelthReport: function (result) {

    let that = this
    //从扫码中获取医院
    let resTempArr = result.split(",");
    let tempStr = resTempArr[resTempArr.length - 1];
    let restArr = tempStr.split('-');

    let userIDTemp = wx.getStorageSync("userId")
    let params = {
      "userId": userIDTemp,
      "userPageAnswerArr": result
    }
    api.userPageAnswerCreate(params).then(res => {
      wx.hideLoading()
      if (res.msg == "success") {

        wx.setStorageSync('author', "scan") //已经获取了则授权标记恢复初始化
        that.setData({
          author: 0
        })

        //接口访问成功后记录扫码获取的医院信息
        wx.setStorageSync('hospitalName', restArr[0])
        wx.setStorageSync('departmentName', restArr[1])
        that.setData({
          hospital: restArr[0]
        });
        that.setData({
          department: restArr[1]
        });

        that.setHealthData() //扫码后重新获取页面程序
        wx.setStorageSync('reportID', res.data)
        setTimeout(() => {
          wx.navigateTo({
            url: '../../../pages/healthAssessment/index?diseaseRadar=' + that.data.diseaseRadar + '&nutrientRadar=' + that.data.nutrientRadar + '&psychoRadar=' + that.data.psychoRadar + '&sportRadar=' + that.data.sportRadar + '&sleepRadar=' + that.data.sleepRadar,
          })
        }, 500)
      }
    }).catch(function (error) {

    })
  },
  //任务卡跳转
  taskClick: function () {
    wx.navigateTo({
      url: '../taskCard/index',
    })
  },

  /**
   * 没有授权跳转过来后点击健康管理任意按钮跳转授权页面
   */
  panelNoAuthor: function () {
    //增加一个弹窗进行确定提示
    wx.reLaunch({
      url: '../../empower/index',
    })
  },
  //院外管理张开
  buttonOpen: function () {
    let height = this.data.hospManageHeight;
    height = height + 300;
    this.setData({
      hospManageHeight: height
    })
  },
  //院外管理缩回
  buttonRetract: function () {
    let height = this.data.hospManageHeight;
    height = height - 300;
    this.setData({
      hospManageHeight: height
    })
  },

  threeDay: function (day) {
    var date = new Date(day); //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
    // var date = new Date(strtime.replace(/-/g, '/'));
    var lastDate = new Date(date.getTime() + 1000 * 60 * 60 * 24 * 3); //最后30天可以更改，意义：是获取多少天前的时间
    var lastY = lastDate.getFullYear();
    var lastM = lastDate.getMonth() + 1;
    var lastD = lastDate.getDate();
    var LDate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD); //得到30天前的时间
    return LDate;
  },
  //获取3个月时间日期
  hospManage: function () {
    let that = this;
    let hospManageData = that.data.hospManageData;
    that.data.hospManageData.map((item, index) => {
      if (index == 0) {
        return item.time = that.threeDay(wx.getStorageSync('create_time'))
      } else {
        return item.time = that.threeDay(that.data.hospManageData[index - 1].time);
      }
    })
    that.setData({
      hospManageData: hospManageData
    })
  },
  //跳转页面
  toUploader: function () {
    wx.navigateTo({
      url: '/pages/questionnaire/uploaderGuide/index',
    })
  }
})