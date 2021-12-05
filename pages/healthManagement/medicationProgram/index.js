//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
var other = ["药物用途", "合理用药", "注意事项", "不良反应", "相互作用", "特殊人群"]
//初始状态为 1 当进入页面 show方法执行第一次拿取数据刷新页面随后值变更为 2，此后当点击添加常用药时置为 1
var freshPage = 1
Component({
  data: {
    imgUrl: utils.IMG_URL,
    // 此页面 页面内容距最顶部的距离  
    statusBarHeight: "",
    checked: true,
    originalData: [],//原始数据
    pageShowDate: [],//页面展示数据
    //1是显示，2是隐藏
    showOrHide: 2
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      if (freshPage == 1) {
        freshPage = 2
        this.pageData1()
      }
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  
  //第一次进入页面的时候
  attached: function () {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    })
    this.pageData1()
  },
  methods: {
    //接口——获取所有数据
    pageData1: function () {
      let that = this
      let params = { isUse: 1 }
      api.findMedicineList(params).then(res => {
     
        that.setData({
          originalData: res.data
        })
        that.showHideClick()
      }).catch(function (error) {
      })
    },

    /**
     * 整理显示数据
     * @param {*} dataList 原始数据数组
     */
    arrangeMent: function (dataList) {
      let that = this
      let arr = new Array()
      for (let i = 0; i < dataList.length; i++) {
        let tempOb = { id: '', name: '', sketch: [], isUse: '', isUseTitle: '', other: [] }
        tempOb.id = dataList[i].id
        tempOb.name = dataList[i].name
        tempOb.sketch = dataList[i].sketch.split('|')
        tempOb.isUse = dataList[i].isUse
        tempOb.isUseTitle = dataList[i].isUse == 2 ? "正在服用" : "停止服用"
        tempOb.other = that.arrangeSixBtnConent(dataList[i])
        arr.push(tempOb)
      }
      this.setData({
        pageShowDate: arr,
      })
    },
    /**
     * 整理每个药物对应的六个使用按钮
     * @param {} item 
     */
    arrangeSixBtnConent: function (item) {
      // "药物用途","合理用药","注意事项","不良反应","相互作用","特殊人群"
      let otherArr = new Array()
      for (let j = 0; j < 6; j++) {
        let tempObNew = { name: '', medicationID: '', content: '' }
        tempObNew.medicationID = item.id
        tempObNew.name = other[j]
        if (j == 0) {
          tempObNew.content = item.effet
        } else if (j == 1) {
          tempObNew.content = item.normalUse
        } else if (j == 2) {
          tempObNew.content = item.mattersNeedingAttention
        } else if (j == 3) {
          tempObNew.content = item.adverseReactions
        } else if (j == 4) {
          tempObNew.content = item.drugInteractions
        } else if (j == 5) {
          tempObNew.content = item.specialTimeUse
        }
        otherArr.push(tempObNew)
      }
      return otherArr
    },

    /**
     * 六个按钮点击
     */
    sixBtnClick: function (event) {
      let content = event.currentTarget.dataset.item
      let contentStr = JSON.stringify(content)
      wx.navigateTo({
        url: '../medicationDetailProgram/index?content=' + contentStr,
      })
    },

    onChangeSwitch: function (item) {
      let that = this;
      // let checked = item.currentTarget.dataset.item.checked;
      let index = item.currentTarget.dataset.index;
      let id = item.currentTarget.dataset.item.id;
      let isused = item.currentTarget.dataset.item.isUse
      let usedTemp = 2
      if (isused == 2) {
        usedTemp = 1
      }
      wx.showLoading({
        title: '请稍等。。。',
      })
      this.pageData2(usedTemp, id, index)
    },

    //接口——改变服用状态，
    pageData2: function (useTemp, idtemp, index) {
      let that = this
      let params = { isUse: useTemp, medicineId: idtemp }
      api.updateMedicineIsUse(params).then(res => {
     
        wx.hideLoading()
        if (res.msg == "success") {
          that.useStateChange(idtemp, index)
        }
      }).catch(function (error) {
        wx.hideLoading()
      })
    },
    /**
     * 服用状态修改方法
     * 在本地原始数据中，修改isuse 的值 改变页面显示
     */
    useStateChange: function (id, index) {
      let originalDataTemp = this.data.originalData
      let originalItem = originalDataTemp[index]
      let originalItemID = originalItem.id
      if (originalItemID == id) {
        let isUseTemp = originalItem.isUse
        if (isUseTemp == 2) {
          originalItem.isUse = 1
        } else {
          originalItem.isUse = 2
        }
        originalDataTemp[index] = originalItem
      } else {
        for (let i = 0; i < originalDataTemp.length; i++) {
          let originalItemTemp = originalDataTemp[i]
          let originalItemTempID = originalItemTemp.id
          if (originalItemTempID == id) {
            let isUseTemp = originalItemTemp.isUse
            if (isUseTemp == 2) {
              originalItemTemp.isUse = 1
            } else {
              originalItemTemp.isUse = 2
            }
            originalDataTemp[i] = originalItemTemp
          }
        }
      }
      this.setData({
        originalData: originalDataTemp
      })
      this.arrangeMent(originalDataTemp)
    },

    /**
     * 点击显示或隐藏 停止服用
     */
    showHideClick: function () {
      let that = this
      let originalTemp = this.data.originalData
      let showOrHideTemp = this.data.showOrHide
      if (showOrHideTemp == 1) {//showOrHide记录当前的显示状态  1是隐藏，2是显示
        that.setData({
          showOrHide: 2
        })
        that.arrangeMent(originalTemp)
      } else {
        that.setData({
          showOrHide: 1
        })
        let tempDataArr = new Array()
        for (let i = 0; i < originalTemp.length; i++) {
          let isUes = originalTemp[i].isUse
          if (isUes == 2) {
            tempDataArr.push(originalTemp[i])
          }
        }
        that.arrangeMent(tempDataArr)
      }
    },
    /**
     * 跳转添加药品页面
     */
    gotoAddDrug: function () {
      freshPage = 1
      wx.navigateTo({
        url: '/pages/record/drugRecord/index',
      })
    }
  }
})
