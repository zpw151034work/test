//引入echarts
import * as echarts from '../../../commpents/ec-canvas/echarts';
import api from '../../../utils/api';
//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
let chart = null;
var isShowExecute = false; //onshow 方法是否可以执行，true可以，false不可以

function healthScore(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart)
  return chart;
}
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '膳食记录', //导航栏 中间的标题
      dialog: false,
    },
    host: utils.Host,
    imgUrl: utils.IMG_URL,
    show: false,
    date: utils.today,
    minDate: new Date(2021, 0, 1).getTime(),
    maxDate: new Date(2021, 12, 31).getTime(),
    checked: true,
   // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    //最下层数据
    showTan: false,
    healthScore: {
      onInit: healthScore
    },
   actions: [{ name: '早加餐' },{name: '午加餐', },{ name: '晚加餐',},{name: '取消',}],
    contentShow: true,
    breakfastData: [],
    breakfastHeat: "",
    lunchData: [],
    lunchHeat: "",
    dinnerData: [],
    dinnerHeat: '',
    extraMealData: '',
    extraMealHeat: '',
    motionRecordData: [],
    breakfastDataAdd: '',
    breakfastHeatAdd: '',
    lunchDataAdd: '',
    lunchHeatAdd: '',
    dinnerDataAdd: '',
    dinnerHeatAdd: '',
    motionRecordHeat: '',
    recommended: "", //建议摄入量
    residualEnergy: '', //剩余能量
    motionRecord: false, //运动数据   
    FoodRecord: '', //
    pageShow: true,
    foodDailyEnergy: '',
    motionDailyEnergy: '',
    toView: '',
    // 弹出框数据
    foodData:[],
    today:utils.today,
    unit:'',
    unitData:"",
    activeData:"",
    changeHeat:0,
    show:"",
    showTanChu:false,
    motionMinutes:'',
    dialogData:''
  },
  onLoad: function (option) {
   this.setData({
      date:option.time?option.time:utils.today,
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    });
   
  },
  onReady() {
    this.search();
  },
  onShow: function () {
    if (isShowExecute) {
      isShowExecute = false
      this.search();
    }
  },
  //获取数据展示
  getEcharts() {
    let canNum =this.data.recommended - this.data.residualEnergy;
    var option = {
      tooltip: {
        trigger: 'item',
        show:false,
      },
      title: {
        text: '还可以吃' + "\n" + this.data.residualEnergy + "\n" + '千卡/天',
        left: 'center',
        top: '35%',
        textStyle: {
          color: '#031f2d',
          fontSize: 10,
          align: 'center',
          fontWeight: '600'
        }
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['50%', '60%'],
        clickable:false,
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [{
            value:canNum,
          },
          {
            value:this.data.residualEnergy,
           },
         ]
        }],
         color: ['#eeeeee', '#64B55B']
    };
    setTimeout(() => {
      chart.clear()
      chart.setOption(option);
    }, 1500)
  },
  //低弹框
   dietRecordAdd4() {
    this.setData({
      showTan: true,
      'navbarData.dialog': true
     })
   },
  //关闭弹出
  onCloseTan() {
    this.setData({
      showTan: false,
      'navbarData.dialog': false
    });
  },
  onSelect(event) {
    if (event.detail.name != "取消") {
      isShowExecute = true
      wx.navigateTo({
        url: '/pages/record/dietAdd/index?title=' + event.detail.name + '&time=' + this.data.date
      })
    } else {
      this.setData({
        showTan: false,
        'navbarData.dialog': false
      });
    }
  },
  //时间插件
  onDisplay() {
    this.setData({
      show: true,
      'navbarData.dialog': true
    });
  },
  onCloseCalendar() {
    this.setData({
      show: false,
      'navbarData.dialog': false
    });
  },
  onConfirm(event) {
    this.setData({
      show: false,
      'navbarData.dialog': false,
      date: utils.formatDate(event.detail),
    });
    this.search();
  },
  //滑动删除按钮
  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
        });
        break;
    }
  },
  //时间段插件
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  //swicth
  onChangeSwicth({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
  },
  //加早中午餐页面跳转
  dietRecordAdd1() {
    isShowExecute = true
    wx.navigateTo({
      url: '/pages/record/dietAdd/index?title=' + "添加早餐&time=" + this.data.date
    })
  },
  dietRecordAdd2() {
    isShowExecute = true
    wx.navigateTo({
      url: '/pages/record/dietAdd/index?title=' + "添加午餐&time=" + this.data.date,
    })
  },
  dietRecordAdd3() {
    isShowExecute = true
    wx.navigateTo({
      url: '/pages/record/dietAdd/index?title=' + "添加晚餐&time=" + this.data.date,
    })
  },
  //运动页面跳转
  motionRecordName: function () {
    isShowExecute = true
    wx.navigateTo({
      url: '/pages/record/motionRecord/index?route=diet&time=' + this.data.date,
    })
  },
  //饮食记录
  search: function (msg) {
    let that = this;
    let startTime = that.data.date + " 00:00:00";
    let endTime = that.data.date + " 23:59:59";
    let params = {
      startTime: startTime,
      endTime: endTime
    }
    api.findFoodRecordList(params).then(res => {
      let FoodRecord;
      if (res.retCode == 200) {
        let recommendedNum = res.data.dailyEnergy == null ? 0 : res.data.dailyEnergy;
        that.setData({
          recommended: recommendedNum
        })
        if (res.data.userFoodRecords == "") {
          FoodRecord = false
        } else {
          FoodRecord = true;
        }
        let breakfastData = res.data.userFoodRecords.filter(function (item) {
          return item.type == 1;
        });
        let breakfastHeat = breakfastData.reduce(function (prev, cur) {
          return prev + cur.heat;
        }, 0);
        let lunchData = res.data.userFoodRecords.filter(function (item) {
          return item.type == 2;
        });
        let lunchHeat = lunchData.reduce(function (prev, cur) {
          return prev + cur.heat;
        }, 0);
        let dinnerData = res.data.userFoodRecords.filter(function (item) {
          return item.type == 3;
        });
        let dinnerHeat = dinnerData.reduce(function (prev, cur) {
          return prev + cur.heat;
        }, 0);
        let breakfastDataAdd = res.data.userFoodRecords.filter(function (item) {
          return item.type == 4;
        });
        let breakfastHeatAdd = breakfastDataAdd.reduce(function (prev, cur) {
          return prev + cur.heat;
        }, 0);
        let lunchDataAdd = res.data.userFoodRecords.filter(function (item) {
          return item.type == 5;
        });
        let lunchHeatAdd = lunchDataAdd.reduce(function (prev, cur) {
          return prev + cur.heat;
        }, 0);
        let dinnerDataAdd = res.data.userFoodRecords.filter(function (item) {
          return item.type == 6;
        });
        let dinnerHeatAdd = dinnerDataAdd.reduce(function (prev, cur) {
          return prev + cur.heat;
        }, 0);
        let recommended = that.data.recommended;
        let residualEnergy = parseInt(recommended) - parseInt(breakfastHeatAdd) - parseInt(lunchHeatAdd) - parseInt(dinnerHeatAdd) - parseInt(dinnerHeat) - parseInt(breakfastHeat) - parseInt(lunchHeat);
         that.setData({
          breakfastData: breakfastData,
          breakfastHeat: breakfastHeat.toFixed(2),
          lunchData: lunchData,
          lunchHeat: lunchHeat.toFixed(2),
          dinnerData: dinnerData,
          dinnerHeat: dinnerHeat.toFixed(2),
          breakfastDataAdd: breakfastDataAdd,
          breakfastHeatAdd: breakfastHeatAdd.toFixed(2),
          lunchDataAdd: lunchDataAdd,
          lunchHeatAdd: lunchHeatAdd.toFixed(2),
          dinnerDataAdd: dinnerDataAdd,
          dinnerHeatAdd: dinnerHeatAdd.toFixed(2),
          residualEnergy: residualEnergy > 0 ? residualEnergy.toFixed(2) : 0
        });
        that.getEcharts();
      }
      that.motionRecord(FoodRecord)
    }).catch(function (error) {})
  },
  //计算热量的值
  heatFunction:function(){
      let that = this;
      let breakfastHeat = that.data.breakfastData.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      let lunchHeat = that.data.lunchData.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      let dinnerHeat = that.data.dinnerData.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      let breakfastHeatAdd = that.data.breakfastDataAdd.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      let lunchHeatAdd = that.data.lunchDataAdd.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);
      let dinnerHeatAdd = that.data.dinnerDataAdd.reduce(function (prev, cur) {
        return prev + cur.heat;
      }, 0);

      let recommended = that.data.recommended;
      let residualEnergy = parseInt(recommended) - parseInt(breakfastHeatAdd) - parseInt(lunchHeatAdd) - parseInt(dinnerHeatAdd) - parseInt(dinnerHeat) - parseInt(breakfastHeat) - parseInt(lunchHeat);
      that.setData({
        breakfastHeat: breakfastHeat.toFixed(2),
        lunchHeat: lunchHeat.toFixed(2),
        dinnerHeat: dinnerHeat.toFixed(2),
        breakfastHeatAdd: breakfastHeatAdd.toFixed(2),
        lunchHeatAdd: lunchHeatAdd.toFixed(2),
        dinnerHeatAdd: dinnerHeatAdd.toFixed(2),
        residualEnergy: residualEnergy > 0 ? residualEnergy.toFixed(2) : 0
      });
    },
  //运动记录
  motionRecord: function (FoodRecord) {
    let that = this;
    let startTime = that.data.date + " 00:00:00";
    let endTime = that.data.date + " 23:59:59";
    let params = {
      startTime: startTime,
      endTime: endTime
    }
    api.findSportRecordList(params).then(res => {
      if (res.retCode == 200) {
        that.setData({
          motionRecordHeat: res.data.dailyEnergy
        })
        if (res.data.userSportRecords == "" && FoodRecord == false) {
          that.setData({
            pageShow: false
          })
        } else {
          that.setData({
            pageShow: true
          })
        }
        let userSportRecords = res.data.userSportRecords
        let heatTotal = 0
        for (let i = 0; i < userSportRecords.length; i++) {
          let tempCur = userSportRecords[i].heat
          heatTotal += tempCur
        }
        heatTotal = heatTotal.toFixed(2)
        that.setData({
          motionRecordData: userSportRecords,
          motionRecordHeat: heatTotal
        })
      }
    }).catch(function (error) {})
  },
  //饮食记录删除
  foodRecordDelete: function (msg) {
    let that = this;
    let params = {
      id: msg.currentTarget.dataset.item.id,
    }
    api.deleteFoodRecord(params).then(function (res) {
      if (res.retCode == 200) {
        that.search();
      }
    }).catch(function (error) {})
  },
  //运动记录删除
  motionRecordDelete: function (msg) {
    let that = this;
    let params = {
      id: msg.currentTarget.dataset.item.id,
    }
    api.deleteSportRecord(params).then(res => {
      if (res.retCode == 200) {
        that.search();
      }
    }).catch(function (error) {})
  },
  // 跳到运动的锚点
  jumpTo: function (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
 //页面点击弹出层
 clickTap:function (item) {
  let that = this;
  that.setData({
    unitData:'',
    unit:'',
    activeData:''
  })
  let calory = item.currentTarget.dataset.item.heat/100;
  let params = {
    foodName: item.currentTarget.dataset.item.food
  }
  api.findByFoodName(params).then(res => {
    if (res.data != "") {
      let unitData = res.data.map(item => {
        if(item.amount=="克"){
          return {
            amount: item.amount,
            calory: calory,
            eatWeight: item.eatWeight,
            foodName: item.foodName,
            id: item.id,
            img: item.img,
            weight: item.weight,
          }
        }else{
          return {
            amount: item.amount,
            calory: item.calory,
            eatWeight: item.eatWeight,
            foodName: item.foodName,
            id: item.id,
            img: item.img,
            weight: item.weight,
          }
         }
       });

      let unit = res.data[0].amount;
      that.setData({
        unitData: unitData,
        unit: unit
      })
      item.currentTarget.dataset.item.unitData = that.data.unitData
      item.currentTarget.dataset.item.index = item.currentTarget.dataset.index
      that.setData({
        dialogData: item.currentTarget.dataset.item,
      })
    } else {
     
    }
  }).catch(function (error) {})
  that.setData({
    showTanChu:true,
    'navbarData.dialog': true,
    motionMinutes: '',
    changeHeat: 0
  })
},
//输入触发事件
onMinutesChange(event) {

  let that = this;
  let activeData = [that.data.activeData == "" ? that.data.unitData[0] : that.data.activeData[0]];
  let changeHeat = event.detail * activeData[0].calory;
  this.setData({
    motionMinutes: event.detail,
    changeHeat: changeHeat.toFixed(2),
    activeData: activeData
  })
},
// 弹出框事件点击单位
onChange: function (event) {
  let unitData = this.data.unitData;
  let activeData = unitData.filter(item => {
    if (event.detail.title == item.amount) {
      return item;
    }
  });
  this.setData({
    unit: event.detail.title,
    activeData: activeData,
    motionMinutes:"",
    changeHeat:0
  });
},
//加餐记录弹出框确定
dialogSave: function (item) {
  var that = this;
  item.currentTarget.dataset.item.val = that.data.motionMinutes;
  item.currentTarget.dataset.item.heat = that.data.changeHeat;
  item.currentTarget.dataset.item.calory = that.data.activeData[0].calory;
  item.currentTarget.dataset.item.unitType = that.data.activeData[0].amount;
  let inx = item.currentTarget.dataset.item.index;
  if(item.currentTarget.dataset.item.type==1){
    let  breakfastData = that.data.breakfastData;
    var cw = "breakfastData["+inx+"]";
    that.setData({
      [cw]: item.currentTarget.dataset.item,
    })
   that.setData({
    breakfastData: breakfastData,
   })
  }
  if(item.currentTarget.dataset.item.type==2){
    let  lunchData = that.data.lunchData;
    var cw = "lunchData["+inx+"]";
    that.setData({
      [cw]: item.currentTarget.dataset.item,
    })
   that.setData({
    lunchData: lunchData,
   })
  }
  if(item.currentTarget.dataset.item.type==3){
    let  dinnerData = that.data.dinnerData;
    var cw = "dinnerData["+inx+"]";
    that.setData({
      [cw]: item.currentTarget.dataset.item,
    })
   that.setData({
    dinnerData: dinnerData,
   })
  }
  if(item.currentTarget.dataset.item.type==4){
    let  breakfastDataAdd = that.data.breakfastDataAdd;
    var cw = "breakfastDataAdd["+inx+"]";
    that.setData({
      [cw]: item.currentTarget.dataset.item,
    })
   that.setData({
    breakfastDataAdd: breakfastDataAdd,
   })
  }
  if(item.currentTarget.dataset.item.type==5){
    let  lunchDataAdd = that.data.lunchDataAdd;
    var cw = "lunchDataAdd["+inx+"]";
    that.setData({
      [cw]: item.currentTarget.dataset.item,
    })
   that.setData({
    lunchDataAdd: lunchDataAdd,
   })
  }
  if(item.currentTarget.dataset.item.type==6){
    let  dinnerDataAdd = that.data.dinnerDataAdd;
    var cw = "dinnerDataAdd["+inx+"]";
    that.setData({
      [cw]: item.currentTarget.dataset.item,
    })
   that.setData({
    dinnerDataAdd: dinnerDataAdd,
   })
  }

  let params = {
    ...item.currentTarget.dataset.item
  }
  api.updateFoodRecord(params).then(res => {
    if(res.retCode == 200){
      that.search();
      // that.heatFunction();
    }
   }).catch(function (error) {})
 },
 onCloseDialog:function(){
  let  that = this
  that.setData({
    showTanChu:false
  })
 }
})