//引入echarts
import * as echarts from '../../../commpents/ec-canvas/echarts';
import api from '../../../utils/api';
//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
let chart = null;

function healthScore(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  return chart;
}
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  //ec
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '心理报告', //导航栏 中间的标题
    },
    healthScore: {
      onInit: healthScore
    },
    imgUrl: utils.IMG_URL,
    statusBarHeight: "", // 此页面 页面内容距最顶部的距离
    emotion: '',
    emotionAdjust: '',
    emotionEffect: '',
    canNext: true,
    getTime: ''
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中'
    })
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
    // this.getData();
    // this.getEcharts();
    this.getPage();
  },
  onReady() {
    this.getData();
  },
  //运动报告echarrts数据展示
  getData: function () {
    var that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.daysAgo(),
      "count": 30,
    }
    api.findHistoryUserPsychoDailyReport(params).then(res => {
      let echartsData1 = [];
      let echartsData2 = [];
      let timeData = [];
      wx.hideLoading({})
      res.data.forEach(function (item, index, array) {
        timeData.push(item[0]);

        let item1 = item[1] == null ? 0 : item[1];
        let item2 = item[2] == null ? 0 : item[2];

        if (item1 != 0 && item2 != 0) {
          echartsData1.push(item1 - 0.5);
          echartsData2.push(1);
        } else {
          echartsData1.push(item1);
          echartsData2.push(item2 - item1);
        }
      });

      that.getEcharts(timeData, echartsData1, echartsData2);
      that.setData({
        echartsData: echartsData,
        timeData: timeData
      })

    }).catch(function (error) {})
  },
  //获取数据展示
  getEcharts: function (timeData, echartsData1, echartsData2) {
    let that = this;
    var option = {
      backgroundColor: '#F5F5F5',
      title: {
        text: '',
        subtext: '',
      },
      color: ['#9B9B9B'],
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
          that.getPageClick(params[0].axisValue)
        }
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: {
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
      },
      yAxis: {
        type: 'value',
        max: 8,
        min: 0,
        axisLabel: {
          interval: 0,
          //此处关键， 设置文本标签全部显示 
          color: "#64B55B",
          lineHeight: '2',
          height: 10,
          formatter: function (params) {
            //有零不显示
            if (params == 0) {
              return "";
            } else if (params == 1) {
              return "孤独";
            } else if (params == 2) {
              return "低落";
            } else if (params == 3) {
              return "平静";
            } else if (params == 4) {
              return "开心";
            } else if (params == 5) {
              return "忐忑";
            } else if (params == 6) {
              return "紧张";
            } else if (params == 7) {
              return "生气";
            } else if (params == 8) {
              return "";
            }

          },
          fontSize: 12,

        },
      },
      dataZoom: [{
        type: 'inside',
        start: 80,
        end: 100,
        show: false,
      }, ],
      series: [{
          name: '最差心情',
          type: 'bar',
          stack: '总量',
          barWidth: 15,
          itemStyle: {
            // barBorderRadius: [20],
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          },
          emphasis: {
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: echartsData1 //起始值
        },
        {
          name: '心情落差',
          type: 'bar',
          stack: '总量',
          label: {
            show: false,
            position: 'inside',
            formatter: function (params) { //有零不显示
              if (params.value > 0) {
                return params.value;
              } else {
                return '';
              }
            },
          },
          itemStyle: {
            color: function (data) {
              let colorList = ["#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B"];
              return colorList[data.dataIndex];
            },
            barBorderRadius: [10]
          },
          emphasis: {
            itemStyle: {
              color: "#64B55B"
            }
          },
          data: echartsData2 //做差值
        }
      ]
    };
    setTimeout(() => {
      chart.clear();
      chart.setOption(option);
    }, 1000);
  },
  //页面数据展示今天
  getPage: function () {
    let that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.today + " 00:00:00",
    }
    api.findUserPsychoDailyReport(params).then(res => {
      let emotion = res.data.emotion
      let emotionAdjust = res.data.emotionAdjust
      let emotionEffect = res.data.emotionEffect
      that.setData({
        emotion: emotion,
        emotionAdjust: emotionAdjust,
        emotionEffect: emotionEffect
      })
    }).catch(function (error) {})
  },
  //点击天数
  getPageClick: function (time) {
    let that = this;
    let params = {
      "endTime": time + " 23:59:59",
      "startTime": time + " 00:00:00",
    }
    api.findUserPsychoDailyReport(params).then(res => {
      if (res.data.emotion == "") {
        that.setData({
          emotion: "",
          emotionAdjust: "",
          emotionEffect: ""
        })

      } else {
        let emotion = res.data.emotion
        let emotionAdjust = res.data.emotionAdjust
        let emotionEffect = res.data.emotionEffect
        that.setData({
          emotion: emotion,
          emotionAdjust: emotionAdjust,
          emotionEffect: emotionEffect
        })
      }
    }).catch(function (error) {})
  },
  //页面跳转
  jumpPage: function () {
    wx.redirectTo({
      url: '/pages/record/psychologicalRecord/index?time=' + this.data.getTime,
    })
  },
  onHide() {
    wx.hideLoading({})
  }
})