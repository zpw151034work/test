//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
var emojis = app.globalData.emojis
Page({
  data: {
    imgUrl: utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '记录运动', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "", //适配机型
    statusBarHeightX: "",
    isIphoneX: "",
    qAnswers: false,
    record: false,
    send: true,
    host: utils.Host,
    messages: [],
    isSpeech: false,
    scrollHeight: 0,
    toView: '',
    windowHeight: 0,
    windowWidth: 0,
    pxToRpx: 2,
    msg: '',
    emotionBox: false,
    emotions: [],
    speechText: '按住 说话',
    changeImageUrl: utils.IMG_URL + '/aIAssistant/voice.png',
    speechIcon: utils.IMG_URL + '/aIAssistant/speech0.png',
    defaultSpeechIcon: utils.IMG_URL + '/aIAssistant/speech0.png',
    emotionIcon: utils.IMG_URL + '/aIAssistant/emotion.png',
    robotAvatar: utils.IMG_URL + '/aIAssistant/机器人.png',
    meAvatar: utils.IMG_URL + '/aIAssistant/miImg.png',
    playingSpeech: '',
    isSportShow: false,
    sportData: [],
    today: utils.today

  },
  chooseEmotion(e) {
    this.setData({
      msg: this.data.msg + '[' + e.target.dataset.name + ']',
    })
  },
  sendMessage(e) {
    this.setData({
      msg: e.detail.value,
    })
  },
  //TabBar
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: 1
      })
    }
  },
  onLoad(options) {
    let that = this;
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    let statusBarHeightX;
    if (app.globalData.isIphoneX == true) {
      statusBarHeightX = app.globalData.statusBarHeight + 120
    } else if (app.globalData.isIphoneX == false) {
      statusBarHeightX = app.globalData.statusBarHeight + 88
    }
    that.setData({
      statusBarHeight: statusBarHeight,
      statusBarHeightX: statusBarHeightX,
    })
    let isIphoneX = app.globalData.isIphoneX;
    that.setData({
      isIphoneX: isIphoneX,
    })
    // 微信同步传译
    that.initRecord();
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          pxToRpx: 750 / res.screenWidth,
          scrollHeight: (res.windowHeight - 50) * 750 / res.screenWidth
        })
      }
    })
    that.firstShow();
  },
  //随问随答首次展示数据
  firstShow() {
    let that = this;
    let answer = '您可以说：跑步30分钟...';
    let questions = [];
    let contents = utils.getContents(answer)
    let id = 'id_' + Date.parse(new Date()) / 1000;
    let data = {
      id: id,
      contents: contents,
      me: false,
      avatar: that.data.robotAvatar,
      speech: false,
      questions: questions
    }
    let messages = that.data.messages
    messages.push(data)
    that.setData({
      messages: messages
    })
  },
  emotionBtn() {
    if (this.data.emotionBox) {
      this.setData({
        emotionBox: false,
        scrollHeight: (this.data.windowHeight - 50) * this.data.pxToRpx
      })
    } else {
      this.setData({
        emotionBox: true,
        scrollHeight: (this.data.windowHeight - 285) * this.data.pxToRpx
      })
      if (this.data.isSpeech) {
        this.setData({
          isSpeech: false,
          changeImageUrl: utils.IMG_URL + '/aIAssistant/voice.png'
        });
      }
    }
  },
  changeType: function () {
    if (this.data.isSpeech) {
      this.setData({
        isSpeech: false,
        changeImageUrl: utils.IMG_URL + '/aIAssistant/voice.png'
      });
      this.getRecordAuth();
    } else {
      this.setData({
        isSpeech: true,
        changeImageUrl: utils.IMG_URL + '/aIAssistant/keyinput.png',
        emotionBox: false,
        scrollHeight: (this.data.windowHeight - 50) * this.data.pxToRpx
      });
    }
  },
  //发送数据
  send: function () {
    var that = this;
    let msg = that.data.msg;
    // 记录运动
    that.sport(msg)
    let contents = utils.getContents(msg)
    let id = 'id_' + Date.parse(new Date()) / 1000;
    let avatar = wx.getStorageSync('userInfo').avatarUrl ? wx.getStorageSync('userInfo').avatarUrl : that.data.meAvatar
    let data = {
      id: id,
      contents: contents,
      me: true,
      avatar: avatar,
      speech: false
    }
    let messages = this.data.messages
    messages.push(data)
    this.setData({
      messages: messages,
      msg: ''
    })
    this.setData({
      toView: id
    })
  },
  // 语音开始
  startRecord: function () {
    var that = this;
    this.setData({
      speechText: '松开 发送'
    })
    //语音转换
    manager.start({
      duration: 30000,
      lang: "zh_CN"
    })
    var seconds = 0;
    var interval = setInterval(function () {
      seconds++
    }, 1000);
    wx.startRecord({
      success: function (res) {
        clearInterval(interval);
        // var tempFilePath = res.tempFilePath
        seconds = seconds == 0 ? 1 : seconds;
        //let id = 'id_' + Date.parse(new Date()) / 1000;
        // let data = {
        //   id: id,
        //   me: true,
        //   avatar: wx.getStorageSync('userInfo').avatarUrl,
        //   speech: false,
        //   seconds: seconds,
        //   filePath: tempFilePath
        // }
        // let messages = that.data.messages
        // messages.push(data)
        // that.setData({
        //   messages: messages
        // });
        that.setData({
          toView: id
        })
        let nickName = wx.getStorageSync('userInfo').nickName;
        if (!nickName) nickName = 'null';

      },
      fail: function (err) {}
    })
  },
  //语音结束
  stopRecord: function () {
    this.setData({
      speechText: '按住 说话'
    })
    manager.stop(); // 语音识别结束
    wx.stopRecord();
  },
  playSpeech: function (event) {
    var that = this;
    var filePath = event.currentTarget.dataset.filepath;
    that.setData({
      playingSpeech: filePath
    });
    var num = 1;
    var interval = setInterval(function () {
      that.setData({
        speechIcon: '/images/aIAssistant/speech' + num % 3 + '.png'
      });
      num++;
    }, 500);
    wx.playVoice({
      filePath: filePath,
      complete: function () {
        clearInterval(interval);
        that.setData({
          speechIcon: utils.IMG_URL + '/aIAssistant/speech0.png',
          playingSpeech: ''
        });
      }
    })
  },
  playRobotSpeech: function (event) {
    var that = this;
    var filePath = event.currentTarget.dataset.filepath;
    that.setData({
      playingSpeech: filePath
    });
    var num = 1;
    var interval = setInterval(function () {
      that.setData({
        speechIcon: utils.IMG_URL + '/aIAssistant/speech' + num % 3 + '.png'
      });
      num++;
    }, 500);
    wx.playBackgroundAudio({
      dataUrl: filePath
    });
    wx.onBackgroundAudioStop(function () {
      clearInterval(interval);
      that.setData({
        speechIcon: utils.IMG_URL + '/aIAssistant/speech0.png',
        playingSpeech: ''
      });
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {}
    //正常开始录音识别时会调用此事件
    manager.onStart = function (res) {}
    //识别错误事件
    manager.onError = function (res) {}
    //识别结束事件
    manager.onStop = function (res) {
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {}
        })
        return;
      } else {
        that.sport(res.result);
        that.textDisplay(res.result);
      }
      // //下面有些代码有一些业务代码，要根据自己实际进行替换
      // if(res.result == this.myword){
      //   that.setData({
      //     content: that.myword + '读音正确' //去掉自动添加的句号
      //   }) 
      //     next();
      // }else{
      //   that.setData({
      //     recordState: false, //录音状态为真
      //     content: that.myword +'读音不准',
      //   })
      //   plugin.textToSpeech({
      //     lang: "en_US",
      //     tts: true,
      //     content: that.myword,
      //     success: function(res) {
      //         console.log("succ tts", res.filename)                
      //     },
      //     fail: function(res) {
      //         console.log("fail tts", res)
      //     }
      //   })
      // }
    }
  },
  //语音转换文字展示
  textDisplay: function (result) {
    var that = this;
    let messages = that.data.messages;
    let contents = utils.getContents(result)
    let id = 'id_' + Date.parse(new Date()) / 1000;
    let avatar = wx.getStorageSync('userInfo').avatarUrl ? wx.getStorageSync('userInfo').avatarUrl : that.data.meAvatar
    let data = {
      id: id,
      contents: contents,
      me: true,
      avatar: avatar,
      speech: false
    }
    messages.push(data)
    that.setData({
      messages: messages,
      msg: ''
    })
  },
  // 话筒权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            },
            fail() {}
          })
        } else {}
      },
      fail(res) {}
    })
  },
  //记录运动
  sport: function (msg) {
    let that = this
    let params = {
      sportRecord: msg
    }
    api.analyseSportRecordContent(params).then(res => {
      if (res.retCode == "200") {
        that.setData({
          isSportShow: true,
        })
        let sportData = that.data.sportData;
        res.data.map((item) => {
          sportData.push(item);
        })
        that.setData({
          sportData: sportData
        })
      }
    }).catch(function (error) {})
  },
  //饮食取消弹出框
  cancel: function () {
    let that = this;
    that.setData({
      isSportShow: false,
      sportData: []
    })
  },
  //饮食确认弹出框
  complete: function (item) {
    let that = this;
    let newArr = [];
    let recordTime = that.data.today + " 00:00:00";
    that.data.sportData.forEach((item) => {
      let Arr = {
        "userId": wx.getStorageSync('userId'),
        "sportId": item.sportId,
        "sport": item.sport,
        "val": item.val,
        "unitType": item.unitType,
        "img": item.img,
        "heat": item.heat
      }
      newArr.push(Arr);
    })
    let params = newArr;
    api.insertSureSportRecord(params).then(res => {
      if (res.retCode == "200") {
        that.setData({
          isSportShow: false,
          sportData: []
        })
        let id = 'id_' + Date.parse(new Date()) / 1000;
        let msg = "小睿已为您记录完成";
        let contents = utils.getContents(msg)
        let data = {
          id: id,
          contents: contents,
          me: false,
          avatar: that.data.robotAvatar,
          speech: false
        }
        let messages = that.data.messages;
        messages.push(data)
        that.setData({
          messages: messages,
        })
      }
    }).catch(function (error) {})
  },
  //点击删除运动
  foodRecordDelete: function (item) {
    var that = this;
    let sportData = that.data.sportData;
    sportData.splice(item.currentTarget.dataset.index, 1);
    that.setData({
      sportData: sportData,
    })
    if (sportData == '') {
      that.setData({
        isSportShow: false,
      })
    }

  },
})