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
};
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '运动报告', //导航栏 中间的标题
    },
    healthScore: {
      onInit: healthScore
    },
    imgUrl: utils.IMG_URL,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    loading: false,
    color: '#000',
    background: '#f8f8f8',
    show: true,
    animated: false,
    echartsData: '',
    timeData: '',
    motionTypeData: [],
    totalEnergy: "", //总耗能
    pageInstance: {},
    canNext: true,
    blankPage: false,
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
  getEcharts: function (echartsData, timeData) {
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
    api.findSportRecordList(params).then(res => {
      let totalEnergy = res.data.userSportRecords.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      that.setData({
        motionTypeData: res.data.userSportRecords,
        totalEnergy: totalEnergy
      });
    }).catch(function (error) {})
  },
  //点击天数
  getPageClick: function (time) {
    let that = this;
    let params = {
      "endTime": time + " 23:59:59",
      "startTime": time + " 00:00:00",
    }
    api.findSportRecordList(params).then(res => {
      // let totalEnergy = res.data.userSportRecords.reduce(function (prev, cur) {
      //   return prev + cur.heat;
      // }, 0);
      // that.setData({
      //   motionTypeData: res.data.userSportRecords,
      //   totalEnergy: totalEnergy
      // });
      let totalEnergy = res.data.userSportRecords.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      that.setData({
        motionTypeData: res.data.userSportRecords,
        totalEnergy: totalEnergy
      });

    }).catch(function (error) {})
  },
  //运动报告echarrts数据展示
  getData: function () {
    var that = this;
    let params = {
      "endTime": utils.today + " 23:59:59",
      "startTime": utils.daysAgo(),
      "count": 30,
    }
    api.findHistoryUserSportReport(params).then(res => {
      let echartsData = [];
      let timeData = [];
      res.data.forEach(function (item, index, array) {
        echartsData.push(item[1]);
        timeData.push(item[0]);
      })
        wx.hideLoading({})
        that.getEcharts(echartsData, timeData);
        that.setData({
          echartsData: echartsData,
          timeData: timeData
        })
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