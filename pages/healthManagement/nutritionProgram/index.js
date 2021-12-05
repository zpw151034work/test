//引入echarts
import * as echarts from '../../../commpents/ec-canvas/echarts';
import api from '../../../utils/api';
//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
//营养需求
var chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  return chart;
}
Component({
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    nutritionNeeds: {
      onInit: initChart
    },
    imgUrl: utils.IMG_URL,
    breakfastData: [],
    lunchData: [],
    dinnerData: [],
    addMeal: [],
    carbon: '',
    fat: "",
    protein: "",
    water: "",
    daily_energy: "",
    principle: "",
    breakfastEnergy: '',
    lunchEnergy: "",
    dinnerEnergy: '',
    disease: "",
    disease2: "",
    diseaseCode: "",
    recommendedData: '',
    noRecommendedData: '',
    birth_province: '',
    chartComponent: '',
    positionHeight:''
  },
  //第一次进入页面的时候
  attached: function () {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    });
    this.pageData1();
    this.pageData2();
    this.pageData3();
    this.pageData4();
    this.forthdInterface();
    this.getHeight();
  },
  methods: {
    //获取页面的高度
    getHeight:function(){
      //创建节点选择器
      let that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('#nutritionTabTitle').boundingClientRect(function(res){
        console.log("sdsdsdsd")
        console.log(res.height)//这个组件内 #the-id 节点的上边界坐标
        console.log("sdsdsdsd")
        that.setData({
          positionHeight:2*(138-res.height)
        })
      
      }).exec()
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
    initChart() {
      let that = this;
      that.data.chartComponent = that.selectComponent('#mychart-dom-bar');
      that.data.chartComponent.init((canvas, width, height, dpr) => {
        chart = echarts.init(canvas, null, {
          width,
          height,
          devicePixelRatio: dpr, // new
        });
        canvas.setChart(chart);
        var option = {
          title: [{
              text: that.data.daily_energy,
              left: "20%",
              top: '38%',
              textAlign: 'center',
              textStyle: {
                color: '#333333',
                fontWeight: 'bold',
                fontSize: 18
              }
            },
            {
              text: 'kcal/天',
              left: "20%",
              top: '52%',
              textAlign: 'center',
              textStyle: {
                color: '#333333',
                fontSize: 10
              }
            },
          ],
          legend: {
            orient: 'vertical',
            top: '22%',
            left: 'right',
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['22%', '50%'],
            data: [{
                value: that.data.protein,
                name: '蛋白质' + " " + that.data.protein.toFixed(2) + '%'
              }, {
                value: that.data.carbon,
                name: '碳水化合物 ' + " " + that.data.carbon.toFixed(2) + '%'

              },
              {
                value: that.data.fat,
                name: '脂肪 ' + " " + that.data.fat.toFixed(2) + '%'
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
          chart.clear()
          chart.setOption(option);
        }, 1000)
      });
    },
    //营养需求
    getEcharts: function () {
      var that = this
      var option = {
        title: [{
            text: that.data.daily_energy,
            left: "23%",
            top: '38%',
            textAlign: 'center',
            textStyle: {
              color: '#333333',
              fontWeight: 'bold',
              fontSize: 18
            }
          },
          {
            text: 'kcal/天',
            left: "23%",
            top: '52%',
            textAlign: 'center',
            textStyle: {
              color: '#333333',
              fontSize: 10
            }
          },
        ],
        legend: {
          orient: 'vertical',
          top: '20%',
          left: 'right',
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['25%', '50%'],
          data: [{
              value: that.data.protein,
              name: '蛋白质' + "    " + that.data.protein.toFixed(2) + '%'
            }, {
              value: that.data.carbon,
              name: '碳水化物 ' + "    " + that.data.carbon.toFixed(2) + '%'
            },
            {
              value: that.data.fat,
              name: '脂肪 ' + "     " + that.data.fat.toFixed(2) + '%'
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
        chart.clear()
        chart.setOption(option);
      }, 1000)

    },
    //推荐
    recommend: function () {
      wx.navigateTo({
        url: '/pages/healthManagement/recommendedDiet/index',
      })
    },
    //不推荐
    noRecommend: function () {
      wx.navigateTo({
        url: '/pages/healthManagement/noRecommendedDiet/index',
      })
    },
    //接口——获取当前饮食原则和碳水、蛋白、脂肪
    pageData1: function () {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('userId'),
          "conLink": " and "
        }, {
          "conParam": "report_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('reportID')
        }],
        "returnParam": ""
      }
      api.userDietRecipeFindMapByCondition(params).then(res => {
        let fatTotalScale = res.data.fat
        let proteinTotalScale = res.data.protein
        let carboTotalScale = 100 - fatTotalScale - proteinTotalScale
        let breakTempStar = (res.data.daily_energy * 0.3 - 50).toFixed(0)
        let breakTempEnd = (res.data.daily_energy * 0.3 + 50).toFixed(0)
        let breakTemp = breakTempStar + "~" + breakTempEnd
        let lunchTempStar = (res.data.daily_energy * 0.4 - 100).toFixed(0)
        let lunchTempEnd = (res.data.daily_energy * 0.4 + 100).toFixed(0)
        let lunchTemp = lunchTempStar + "~" + lunchTempEnd
        let dinnerTempStar = (res.data.daily_energy * 0.3 - 100).toFixed(0)
        let dinnerTempEnd = (res.data.daily_energy * 0.3 + 100).toFixed(0)
        let dinnerTemp = dinnerTempStar + "~" + dinnerTempEnd

        that.setData({
          carbon: carboTotalScale,
          fat: fatTotalScale,
          protein: proteinTotalScale,
          water: res.data.water,
          daily_energy: res.data.daily_energy,
          principle: res.data.principle,
          breakfastEnergy: breakTemp,
          lunchEnergy: lunchTemp,
          dinnerEnergy: dinnerTemp
        })
        that.initChart();

      }).catch(function (error) {})
    },
    //接口——获取早餐 午餐 晚餐 加餐
    pageData2: function () {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "user_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('userId'),
          "conLink": " and "
        }, {
          "conParam": "report_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('reportID')
        }],
        "returnParam": ""
      }
      api.userFoodRecipeFindByCondition(params).then(res => {
        let breakfastArr = new Array()
        let lunchArr = new Array()
        let dinnerArr = new Array()
        let addArr = new Array()
        for (let i = 0; i < res.data.length; i++) {
          //1早餐、2早加、3午餐、4午加、5晚餐、6晚加
          let mealType = res.data[i].mealType
          let url = utils.Host + res.data[i].foodImg
          let unitTemp = res.data[i].val + '克'
          res.data[i].foodImg = url
          res.data[i].val = unitTemp
          if (mealType == 1) {
            breakfastArr.push(res.data[i])
          } else if (mealType == 3) {
            lunchArr.push(res.data[i])
          } else if (mealType == 5) {
            dinnerArr.push(res.data[i])
          } else if (mealType == 2 || mealType == 4 || mealType == 6) {
            addArr.push(res.data[i])
          }
        }
        that.setData({
          breakfastData: breakfastArr,
          lunchData: lunchArr,
          dinnerData: dinnerArr,
          addMeal: addArr
        })
      }).catch(function (error) {})
    },
    //疾病
    pageData3: function () {
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
        that.setData({
          disease: res.data.disease,
          diseaseCode: res.data.disease_code
        })
        that.pageData5();
        that.pageData6();
      }).catch(function (error) {})
    },
    //
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
      api.userDiseaseHistoryeFind(params).then(res => {
        that.setData({
          disease2: res.data.disease
        })
      }).catch(function (error) {})
    },
    //第一个是推荐营养标签接口
    pageData5: function () {
      let that = this;
      let params = {
        diseaseCode: that.data.diseaseCode
      }
      api.foodTagGetOkNutrientTag(params).then(res=>{
        that.setData({
          recommendedData: res.data,
        })
      })
  
    },
    //第二个是避免营养标签接口
    pageData6: function () {
      let that = this;
      let params = {
        diseaseCode: that.data.diseaseCode
      }
      api.foodTagGetBadNutrientTag(params).then(res=>{
        that.setData({
          noRecommendedData: res.data,
        })
      })
     
    },
  }
})