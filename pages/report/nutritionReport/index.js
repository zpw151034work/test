//引入echarts
import * as echarts from '../../../commpents/ec-canvas/echarts';
import api from '../../../utils/api';
//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
let chart1 = null;

function healthScore(canvas, width, height, dpr) {
  chart1 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart1);
  return chart1;
}
//营养分析
let chart2 = null;

function nutritionReport(canvas, width, height, dpr) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart2);
  return chart2;
}
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '营养报告', //导航栏 中间的标题
    },
    healthScore: {
      onInit: healthScore
    }, //条形统计图
    nutritionReport: {
      onInit: nutritionReport
    }, //饼型统计图
    imgUrl: utils.IMG_URL,
    list: [{
        name: '并发症风险',
        gradeColor: [{
            background: "yellow",
            isShow: false
          },
          {
            background: "red",
            isShow: false
          }, {
            background: "blue",
            isShow: true
          }
        ],
        Grade: '中',
        isShow: true
      },
      {
        name: '并发症风险',
        gradeColor: [

          {
            background: "yellow",
            isShow: false
          },
          {
            background: "red",
            isShow: false
          }, {
            background: "blue",
            isShow: true
          }
        ],
        Grade: '中',
      },
      {
        name: '并发症风险',
        gradeColor: [

          {
            background: "yellow",
            isShow: true
          },
          {
            background: "red",
            isShow: false
          }, {
            background: "blue",
            isShow: false
          }
        ],
        Grade: '中',
      }
    ],
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    heatTotal: "",
    carboTotal: "", //碳水
    carboDown: "",
    carboUp: "",
    carboFlag: "",
    fatTotal: "", //脂肪
    fatDown: "",
    fatUp: "",
    fatFlag: "",
    proteinTotalRe: "", //蛋白质推荐
    carboTotalRe: "", //碳水推荐
    fatTotalRe: "", //脂肪推荐
    proteinTotal: "", //蛋白质
    proteinDown: "",
    proteinUp: "",
    priteinFlag: "",
    foodRecordsData: "", //今日记录
    standardDtos: "", //其它营养
    canNext: true,
    getTime: '',
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中'
    })
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
    this.getEchartsReport();
    this.getEchartsAnalysis();
    // this.getData();
    this.getPageData();
  },
  onReady() {
    this.getData();
  },
  //营养数据echarts数据展示
  getEchartsReport: function (echartsData, timeData) {
    let that = this;
    var colorList = ["#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B"]
    let option = {
      backgroundColor: '#F5F5F5',
      tooltip: {
        trigger: 'axis',
        color: '#9B9B9B',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
          that.setData({
            getTime: params[0].axisValue
          })
          that.getPageDataClick(params[0].axisValue);
        }
      },
      grid: {
        left: 0,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          show: false
        },
        data: timeData,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          interval: 0,
          color: '#666',
          formatter: function (value) {
            var t_date = new Date(value);
            let getMonth = (t_date.getMonth() + 1) > 10 ? (t_date.getMonth() + 1) : "0" + (t_date.getMonth() + 1);
            let getDate = t_date.getDate() > 9 ? t_date.getDate() : "0" + t_date.getDate();
            return getMonth + "/" + getDate
          }
        }
      }],
      yAxis: [{
        type: 'value',
        show: false,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color: '#fff'
        }
      }],
      dataZoom: [{
        type: 'inside',
        start: 80,
        end: 100,
        show: false,
      }],
      series: [{
        name: '热量',
        type: 'bar',
        barWidth: 20,
        data: echartsData,
        itemStyle: {
          color: function (data) {
            return colorList[data.dataIndex];
          },
          barBorderRadius: [10, 10, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: "#64B55B"
          }
        },
        label: {
          show: true,
          rotate: 30,
          position: 'top',
          distance: 15,
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
        }
      }, ]
    };
    setTimeout(() => {
      chart1.clear();
      chart1.setOption(option);
    }, 1000);
  },
  //营养分析
  getEchartsAnalysis: function (carboTotal, fatTotal, proteinTotal) {
    var carbo = carboTotal == undefined ? 0 : carboTotal;
    var fat = fatTotal == undefined ? 0 : fatTotal;
    var protein = proteinTotal == undefined ? 0 : proteinTotal;
    var carboTotalScale = "";
    var fatTotalScale = "";
    var proteinTotalScale = "";
    if ((carbo + fat + protein) == 0) {
      carboTotalScale = "0%";
      fatTotalScale = "0%";
      proteinTotalScale = "0%";
    } else {
      carboTotalScale = (carbo / (carbo + fat + protein) * 100).toFixed(2) + "%";
      fatTotalScale = (fat / (carbo + fat + protein) * 100).toFixed(2) + "%";
      proteinTotalScale = (protein / (carbo + fat + protein) * 100).toFixed(2) + "%";
    }
    var option = {
      legend: {
        orient: 'vertical',
        top: '20%',
        left: 'left',
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['60%', '45%'],
        data: [{
            value: proteinTotal,
            name: '蛋白质' + proteinTotalScale,
            itemStyle: {
              color: '#FFC604'
            }
          },
          {
            value: carboTotal,
            name: '碳水化合物' + carboTotalScale,
            itemStyle: {
              color: '#967FDF'
            }
          },
          {
            value: fatTotal,
            name: '脂肪' + fatTotalScale,
            itemStyle: {
              color: '#F17575'
            }
          },
        ],
        label: {
          normal: {
            position: 'inner',
            show: false
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    setTimeout(() => {
      chart2.clear()
      chart2.setOption(option);
    }, 1000)
  },
  initChart(carboTotal, fatTotal, proteinTotal) {
    let that = this;
    that.data.chartComponent = that.selectComponent('#mychart-dom-bar');
    that.data.chartComponent.init((canvas, width, height, dpr) => {
      chart = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: dpr, // new
      });
      canvas.setChart(chart);
      var carbo = carboTotal == undefined ? 0 : carboTotal;
      var fat = fatTotal == undefined ? 0 : fatTotal;
      var protein = proteinTotal == undefined ? 0 : proteinTotal;
      var carboTotalScale = "";
      var fatTotalScale = "";
      var proteinTotalScale = "";
      if ((carbo + fat + protein) == 0) {
        carboTotalScale = "0%";
        fatTotalScale = "0%";
        proteinTotalScale = "0%";
      } else {
        carboTotalScale = (carbo / (carbo + fat + protein) * 100).toFixed(2) + "%";
        fatTotalScale = (fat / (carbo + fat + protein) * 100).toFixed(2) + "%";
        proteinTotalScale = (protein / (carbo + fat + protein) * 100).toFixed(2) + "%";
      }
      var option = {
        legend: {
          orient: 'vertical',
          top: '20%',
          left: 'left',
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['60%', '45%'],
          data: [{
              value: proteinTotal,
              name: '蛋白质' + proteinTotalScale,
              itemStyle: {
                color: '#FFC604'
              }
            },
            {
              value: carboTotal,
              name: '碳水化物' + carboTotalScale,
              itemStyle: {
                color: '#967FDF'
              }
            },
            {
              value: fatTotal,
              name: '脂肪' + fatTotalScale,
              itemStyle: {
                color: '#F17575'
              }
            },
          ],
          label: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      setTimeout(() => {
        chart2.clear()
        chart2.setOption(option);
      }, 1000)
    });
  },
  //运动报告echarrts数据展示{}}{用运动报告}
  getData: function () {
    let that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.daysAgo(),
      "count": 30,
    }
    api.findHistoryUserFoodDailyReport(params).then(res => {
      let echartsData = [];
      let timeData = [];
      res.data.forEach(function (item, index, array) {
        let value = item[1] == null ? 0 : item[1];
        echartsData.push(value);
        timeData.push(item[0]);
      })
      wx.hideLoading({})
      that.getEchartsReport(echartsData, timeData);
      that.setData({
        echartsData: echartsData,
        timeData: timeData
      })
      //this.getEcharts(echartsData,timeData);
    }).catch(function (error) {})
  },
  //页面报告数据
  getPageData: function () {
    let that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.today + " 00:00:00",
    }
    api.findUserFoodDailyReport(params).then(res => {
      if (res.retCode == "200") {
        let heatTotal = res.data.data.heatTotal == undefined ? 0 : res.data.data.heatTotal;
        let carboTotal = res.data.data.carboTotal;
        let carboDown = res.data.data.carboDown;
        let carboUp = res.data.data.carboUp;
        let carboFlag = res.data.data.carboFlag;
        let fatTotal = res.data.data.fatTotal;
        let fatDown = res.data.data.fatDown;
        let fatUp = res.data.data.fatUp;
        let fatFlag = res.data.data.fatFlag;
        let proteinTotal = res.data.data.proteinTotal;
        let proteinDown = res.data.data.proteinDown;
        let proteinUp = res.data.data.proteinUp;
        let proteinFlag = res.data.data.proteinFlag;
        let foodRecordsData = res.data.data.foodRecords;
        let standardDtos = res.data.data.standardDtos;

        that.setData({
          heatTotal: heatTotal,
          carboTotal: carboTotal,
          carboDown: carboDown,
          carboUp: carboUp,
          carboFlag: carboFlag,
          fatTotal: fatTotal,
          fatDown: fatDown,
          fatUp: fatUp,
          fatFlag: fatFlag,
          proteinTotal: proteinTotal,
          proteinDown: proteinDown,
          proteinUp: proteinUp,
          proteinFlag: proteinFlag,
          foodRecordsData: foodRecordsData,
          standardDtos: standardDtos
        })
        that.getEchartsAnalysis(carboTotal, fatTotal, proteinTotal)
      } else {

      }

    }).catch(function (error) {})
  },
  //点击柱状图获取日期
  getPageDataClick: function (time) {

    let that = this;
    let params = {
      "endTime": time + " 23:59:59",
      "startTime": time + " 00:00:00",
    }
    api.findUserFoodDailyReport(params).then(res => {
      if (res.data.data == "") {
        that.setData({
          carboTotal: 0,
          fatTotal: 0,
          proteinTotal: 0,
          heatTotal: 0,
          foodRecordsData: "",
          standardDtos: ""
        })

      } else {
        let heatTotal = res.data.data.heatTotal == undefined ? 0 : res.data.data.heatTotal;
        let carboTotal = res.data.data.carboTotal;
        let carboDown = res.data.data.carboDown;
        let carboUp = res.data.data.carboUp;
        let carboFlag = res.data.data.carboFlag;
        let carboImgFlag = "";
        if (carboFlag == 1) {
          carboImgFlag = "https://jk.aspoontech.com/nutritionReport/down.png"
        }
        if (carboFlag == 3) {
          carboImgFlag = "https://jk.aspoontech.com/nutritionReport/up.png"
        }
        let fatTotal = res.data.data.fatTotal;
        let fatDown = res.data.data.fatDown;
        let fatUp = res.data.data.fatUp;
        let fatFlag = res.data.data.fatFlag;
        let fatImgFlag = "";
        if (fatFlag == 1) {
          fatImgFlag = "https://jk.aspoontech.com/nutritionReport/down.png"
        }
        if (fatFlag == 3) {
          fatImgFlag = "https://jk.aspoontech.com/nutritionReport/up.png"
        }
        let proteinTotal = res.data.data.proteinTotal;
        let proteinDown = res.data.data.proteinDown;
        let proteinUp = res.data.data.proteinUp;
        let proteinFlag = res.data.data.proteinFlag;
        let proteinImgFlag = "";
        if (proteinFlag == 1) {
          proteinImgFlag = "https://jk.aspoontech.com/nutritionReport/down.png"
        }
        if (proteinFlag == 3) {
          proteinImgFlag = "https://jk.aspoontech.com/nutritionReport/up.png"
        }
        let foodRecordsData = res.data.data.foodRecords;
        let standardDtos = res.data.data.standardDtos;

        that.setData({
          heatTotal: heatTotal,
          carboTotal: carboTotal,
          carboDown: carboDown,
          carboUp: carboUp,
          carboFlag: carboFlag,
          carboImgFlag: carboImgFlag,
          fatTotal: fatTotal,
          fatDown: fatDown,
          fatUp: fatUp,
          fatImgFlag: fatImgFlag,
          fatFlag: fatFlag,
          proteinTotal: proteinTotal,
          proteinDown: proteinDown,
          proteinUp: proteinUp,
          proteinFlag: proteinFlag,
          proteinImgFlag: proteinImgFlag,
          foodRecordsData: foodRecordsData,
          standardDtos: standardDtos
        })
        that.getEchartsAnalysis(carboTotal, fatTotal, proteinTotal)
      }

    }).catch(function (error) {})
  },

  //页面跳转
  jumpPage: function () {
    wx.redirectTo({
      url: '/pages/record/dietRecord/index?time=' + this.data.getTime,
    })
  },
  onHide() {
    wx.hideLoading({})
  }
})