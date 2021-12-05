//引入echarts
import * as echarts from '../../../commpents/ec-canvas/echarts';
import api from '../../../utils/api';
//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
//折线
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
      title: '睡眠报告', //导航栏 中间的标题
    },
    healthScore: {
      onInit: healthScore
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    imgUrl: utils.IMG_URL,
    show: true,
    animated: false,
    sleepEndTime: '', //结束时间
    sleepStartTime: '', //开始时间
    sleepAverage: '', //平均时间
    sleepStandard: '', //推荐时间
    sleepStatuses: '', //睡觉状态
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
    this.getPage();
  },
  onReady() {
    this.getData();
  },
  //获取数据展示
  getEcharts: function (echartsData, timeData) {
    let that = this;
    var option = {
      backgroundColor: '#F5F5F5',
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
        name: '',
        type: 'bar',
        barWidth: 20,
        data: echartsData,
        itemStyle: {
          color: function (data) {
            let colorList = ["#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B", "#9B9B9B"];
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
        },
      }]
    };
    setTimeout(() => {
      chart.clear();
      chart.setOption(option);
    }, 1000);
  },
  //页面数据展示今天数据 
  getPage: function () {
    let that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.today + " 00:00:00",
    }
    api.findNowUserSleepReport(params).then(res => {
      let sleepEndTime = res.data.sleepEndTime;
      let sleepStartTime = res.data.sleepStartTime;
      sleepEndTime = sleepEndTime.substring(11, 16);
      sleepStartTime = sleepStartTime.substring(11, 16);
      let sleepTimeDuration = res.data.sleepTimeDuration;
      that.setData({
        sleepEndTime: sleepEndTime,
        sleepStartTime: sleepStartTime,
        sleepAverage: res.data.sleepAverage.toFixed(2),
        sleepStandard: res.data.sleepStandard,
        sleepStatuses: res.data.sleepStatuses,
        sleepTimeDuration: sleepTimeDuration
      })
    }).catch(function (error) {})
  },
  //点击获取数据
  getPageClick: function (time) {
    let that = this;
    let params = {
      "endTime": time + " 23:59:59",
      "startTime": time + " 00:00:00",
    }
    api.findNowUserSleepReport(params).then(res => {

      if (res.data.sleepStartTime == "") {
        that.setData({
          sleepEndTime: "",
          sleepStartTime: "",
          sleepAverage: "",
          sleepStandard: "",
          sleepStatuses: ""
        })
      } else {
        let sleepEndTime = res.data.sleepEndTime;
        let sleepStartTime = res.data.sleepStartTime;
        sleepEndTime = sleepEndTime.substring(11, 16);
        sleepStartTime = sleepStartTime.substring(11, 16);
        let sleepTimeDuration = res.data.sleepTimeDuration;
        that.setData({
          sleepEndTime: sleepEndTime,
          sleepStartTime: sleepStartTime,
          sleepAverage: res.data.sleepAverage.toFixed(2),
          sleepStandard: res.data.sleepStandard,
          sleepStatuses: res.data.sleepStatuses,
          sleepTimeDuration: sleepTimeDuration
        })
      }
    }).catch(function (error) {})
  },
  //睡眠报告echarrts数据展示
  getData: function () {
    var that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.daysAgo(),
      "count": 30,
    }
    api.findHistoryUserSleepReport(params).then(res => {

      let echartsData = [];
      let timeData = [];
      res.data.forEach(function (item, index, array) {

        echartsData.push(item[1]);
        timeData.push(item[0]);
      })
      wx.hideLoading({})
      that.getEcharts(echartsData, timeData);
    }).catch(function (error) {})
  },
  //页面跳转
  jumpPage: function () {
    wx.redirectTo({
      url: '/pages/record/sleepRecord/index?time=' + this.data.getTime,
    })
  },
  onHide() {
    wx.hideLoading({})
  }
})