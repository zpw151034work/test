///获取应用实例
const app = getApp();
let utils = require("../../../utils/util.js");
let api = require("../../../utils/api.js");
Component({
  data: {
    imgUrl: utils.IMG_URL,
    imgUrlD: utils.Host,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '运动管理方案', //导航栏 中间的标题
    },
    active2: 0,
    statusBarHeight: "", // 此页面 页面内容距最顶部的距离 
    suggestionsWayData: [{
        imgUrl: utils.IMG_URL + "/exerciseProgram/腹式呼吸.png"
      },
      {
        imgUrl: utils.IMG_URL + "/exerciseProgram/咳嗽排痰训练.png"
      },
      {
        imgUrl: utils.IMG_URL + "/exerciseProgram/术后肢体恢复运动.png"
      },
      {
        imgUrl: utils.IMG_URL + "/exerciseProgram/缩唇呼吸.png"
      }
    ],

    sport_recipe_id: '',
    sport_frequency: "",
    sport_principle: "",
    sport_time: "",
    sport_sugAllPicID: [], //所有图片的ID
    sport_sugAllPic: [], //总的数据图片
    sport_currentPic: [], //当前展示的数据图片
    typeId: "",
    sportsInstructions:'',
    positionHeight:'',
  },
  attached: function () {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] + 44
    });
    this.pageData1()
    setTimeout(() => {
      this.pageData2()
      this.pageData3(1)
     
    }, 1000);
   
  },
  methods: {
    getHeight:function(){
      //创建节点选择器
      let that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('#exerciseTabTitle').boundingClientRect(function(res){
        that.setData({
          positionHeight:2*(res.height+20-200)
        })
      
      }).exec()
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
          "conParam": "report_id",
          "conEqua": "=",
          "conVal": wx.getStorageSync('reportID')
        }],
        "returnParam": "id,sport_recipe_id"
      }
      api.userSportPlanFindMapByCondition(params).then(res =>{

        that.setData({
          sport_recipe_id: res.data.sport_recipe_id
        })
      }).catch(function (error) {})
    },
    //接口——获取时间和频次
    pageData2: function () {
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "id",
          "conEqua": "=",
          "conVal": that.data.sport_recipe_id
        }],
        "returnParam": ""
      }
      api.sportRecipeFindMapByCondition(params).then(res => {
        that.setData({
          sport_frequency: res.data.sport_frequency,
          sport_principle: res.data.sport_principle,
          sport_time: res.data.sport_time
        })
        that.getHeight()
      }).catch(function (error) {})
    },
    /**
     * 接口——获取建议方式
     * 循环获取6个方式的所有数据，放入总的数组中，然后选取第一个放入当前数据数组中
     * @param {*} number 
     */
    pageData3: function (number) {
     
      let that = this
      let params = {
        "conditionerList": [{
          "conParam": "sport_recipe_id",
          "conEqua": "=",
          "conVal": that.data.sport_recipe_id,
          "conLink": " and "
        }, {
          "conParam": "recipe_action_type_id",
          "conEqua": "=",
          "conVal": number
        }],
        "returnParam": ""
      }
      api.sportFindByCondition(params).then(res => {
        let stringTemp = '';
       
        for (let i = 0; i < res.data.length; i++) {
          stringTemp += res.data[i].recipeActionId
          stringTemp += ','
        }
        stringTemp = stringTemp.substring(0, stringTemp.length - 1)
        let picArr = new Array()
        if (that.data.sport_sugAllPicID) {
          picArr = that.data.sport_sugAllPicID
        }
        picArr.push(stringTemp)
        that.setData({
          sport_sugAllPicID: picArr
        })
        if (number < 7) {
          number += 1
          that.pageData3(number)
        } else if (number == 7) {
          that.pageData4(0)
        }
      }).catch(function (error) {})
    },
    /**
     * 接口——获取所有建议运动的小运动的图片
     * 获取6个图片数据，放方式的所有入总的数组中，然后选取第一个放入当前数据数组中
     * @param {*} number 
     */
    pageData4: function (num) {
      let that = this
      let picArrTemp = that.data.sport_sugAllPicID
      let stringTemp = picArrTemp[num]

      if (stringTemp == null || stringTemp.length == 0 || stringTemp == '') {
        num += 1
        if (num < picArrTemp.length) {
          that.pageData4(num)
        }
        return
      }

      let params = {
        "conditionerList": [{
          "conParam": "id",
          "conEqua": "in",
          "conVal": stringTemp
        }],
        "returnParam": ""
      }
      api.recipeActionFindByCondition(params).then(res => {
       if(num==6){
          that.setData({
            sportsInstructions:res.data[0].content
          })
        }
        // console.log(num);
        // console.log(res);
        // console.log(that.data.sportsInstructions);
        let tempArr = new Array()
        if (that.data.sport_sugAllPic) {
          tempArr = that.data.sport_sugAllPic
        }
        for (let i = 0; i < res.data.length; i++) {
          let imgUrlStr = res.data[i].img
          res.data[i].img = that.data.imgUrlD + '/' + imgUrlStr
        }
        tempArr.push(res.data)
        if (num == 0) {
          that.setData({
            typeId: 1,
          })
          that.setData({
            sport_currentPic: res.data
          })
        }
        that.setData({
          sport_sugAllPic: tempArr,
        })
        num += 1
        if (num < picArrTemp.length) {
          that.pageData4(num)
        }
      }).catch(function (error) {})
    },

    //方式建议tabs
    onSugBtnClick(event) {
      let that = this
      console.log('grgrgrgr');
      console.log(that.data.sport_sugAllPic);
      let typeIdTemp = event.currentTarget.dataset.gid
      if (typeIdTemp == 2) {
        let tempResList = that.data.sport_sugAllPic
        
        if (tempResList.length < 2) {
          return
        }
        let temeResultList = new Array()
        for (let i = 1; i < tempResList.length - 2; i++) {
          temeResultList = temeResultList.concat(tempResList[i])
        }
        let tempArr = temeResultList
        that.setData({
          typeId: typeIdTemp,
          sport_currentPic: tempArr
        })
      } else if (typeIdTemp == 6) {
        let tempResList = that.data.sport_sugAllPic
        if (tempResList.length < 2) {
          return
        }
        console.log("that.data.sport_sugAllPic");
        console.log(that.data.sport_sugAllPic);
        let tempArr = that.data.sport_sugAllPic[tempResList.length - 2];
        that.setData({
          typeId: typeIdTemp,
          sport_currentPic: tempArr
        })
      } else {
        let tempArr = that.data.sport_sugAllPic[typeIdTemp - 1];
        that.setData({
          typeId: typeIdTemp,
          sport_currentPic: tempArr
        })
      }
    },
    onSugItemClick: function (event) {
      let itemTemp = event.currentTarget.dataset.gid
      let link = '/sportHtml/html/' + itemTemp.id + '.html'
      wx.navigateTo({
        url: '../exercisedetails/index?link=' + link,
      })
      // this.pageData5(idTemp)
    }
  }
})