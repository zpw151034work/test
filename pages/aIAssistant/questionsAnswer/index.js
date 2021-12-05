//获取应用实例
const app = getApp()
const api = require("../../../utils/api.js")
let utils = require("../../../utils/util.js")
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const host = app.globalData.host
var emojis = app.globalData.emojis
Page({
  data: {
    imgUrl:utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "", //适配机型
    statusBarHeightX: "",
    isIphoneX: "",
    qAnswers: false,
    record: false,
    send: true,
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
    changeImageUrl: utils.IMG_URL+'/aIAssistant/voice.png',
    speechIcon: utils.IMG_URL+'/aIAssistant/speech0.png',
    defaultSpeechIcon: utils.IMG_URL+'/aIAssistant/speech0.png',
    emotionIcon: utils.IMG_URL+'/aIAssistant/emotion.png',
    robotAvatar:utils.IMG_URL+'/aIAssistant/机器人.png',
    meAvatar:utils.IMG_URL+'/aIAssistant/miImg.png',
    playingSpeech: '',
    type:'',
    reasonHeight:'',
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
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    let statusBarHeightX;
    if (app.globalData.isIphoneX == true) {
      statusBarHeightX = app.globalData.statusBarHeight + 120
    } else if (app.globalData.isIphoneX == false) {
      statusBarHeightX = app.globalData.statusBarHeight + 88
    }
    let isIphoneX = app.globalData.isIphoneX;
      _this.setData({
      statusBarHeight: statusBarHeight,
      statusBarHeightX: statusBarHeightX,
      isIphoneX: isIphoneX,
      "navbarData.title":options.type
    });
    // 微信同步传译
    _this.initRecord();
    _this.getRecordAuth();
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          windowHeight: res.windowHeight,
          pxToRpx: 750 / res.screenWidth,
          scrollHeight: (res.windowHeight - 50) * 750 / res.screenWidth
        })
      }
    })
    _this.firstShow();
  },
 //随问随答首次展示数据
 firstShow(){
  let that = this;
  let answer = "dsdsdsdd";
  let questions = [{'question':'您可以问:'},{'question':'癌症能不能吃海鲜?'},{'question':' 睡不着怎么办?'},{'question':'感觉恶心怎么办？'},{'question':'阑尾炎手术如何护理？'},{'question':'如何预防冠心病？'}];
  let contents = utils.getContents(answer)
  let id = 'id_' + Date.parse(new Date()) / 1000;
  let data = {
    id: id,
    contents: contents,
    me: false,
    avatar:that.data.robotAvatar,
    speech: false,
    questions:questions,
    isShow:false
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
          changeImageUrl: utils.IMG_URL+'/aIAssistant/voice.png'
        });
      }
    }
  },
  changeType: function () {
    if (this.data.isSpeech) {
      this.setData({
        isSpeech: false,
        changeImageUrl: utils.IMG_URL+'/aIAssistant/voice.png'
      });
    } else {
      this.setData({
        isSpeech: true,
        changeImageUrl: utils.IMG_URL+'/aIAssistant/keyinput.png',
        emotionBox: false,
        scrollHeight: (this.data.windowHeight - 50) * this.data.pxToRpx
      });
    }
  },
  //发送数据
  send: function () {
    var that = this;
    let msg = this.data.msg
    that.question(msg)
    let contents = utils.getContents(msg)
    let id = 'id_' + Date.parse(new Date()) / 1000;
    let avatar = wx.getStorageSync('userInfo').avatarUrl? wx.getStorageSync('userInfo').avatarUrl:that.data.meAvatar;
    let data = {
      id: id,
      contents: contents,
      me: true,
      avatar:avatar,
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
        var tempFilePath = res.tempFilePath
        seconds = seconds == 0 ? 1 : seconds;
        let id = 'id_' + Date.parse(new Date()) / 1000;
        // let data = {
        //   id: id,
        //   me: true,
        //   avatar: wx.getStorageSync('userInfo').avatarUrl,
        //   speech: true,
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
        wx.uploadFile({
          url: host + '/wx/uploadSilk',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'userid': wx.getStorageSync('openid'),
            'username': wx.getStorageSync('userInfo').nickName
          },
          success: function (res) {
            
            let resData = JSON.parse(res.data);
            if (resData.code == 102) {
              let answer = resData.text;
              let contents = utils.getContents(answer)
              let id = 'id_' + Date.parse(new Date()) / 1000;
              let data = {
                id: id,
                contents: contents,
                me: false,
                avatar: '/images/robot.jpg',
                speech: false
              }
              let messages = that.data.messages
              messages.push(data)
              that.setData({
                messages: messages
              })
              that.setData({
                toView: id
              })
            } else if (resData.code == 101) {
              var isFirst = true;
              wx.playBackgroundAudio({
                dataUrl: host + '/static/' + resData.text
              });
              wx.onBackgroundAudioPlay(function () {
                wx.getBackgroundAudioPlayerState({
                  success: function (res) {
                    if (!isFirst) {
                      return;
                    }
                    isFirst = false;
                    let duration = res.duration;
                    wx.stopBackgroundAudio();
                    let id = 'id_' + Date.parse(new Date()) / 1000;
                    let data = {
                      id: id,
                      me: false,
                      avatar: '/images/aIAssistant/robot.jpg',
                      speech: true,
                      seconds: duration == 0 ? 1 : duration,
                      filePath: host + '/static/' + resData.text
                    }
                    let messages = that.data.messages
                    messages.push(data)
                    that.setData({
                      messages: messages
                    });
                    that.setData({
                      toView: id
                    })
                  }
                })
              });
            }
          },
          fail: function (err) {
          }
        })
      },
      fail: function (err) {
      }
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
          speechIcon: utils.IMG_URL+'/aIAssistant/speech0.png',
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
        speechIcon: utils.IMG_URL+'/aIAssistant/speech' + num % 3 + '.png'
      });
      num++;
    }, 500);
    wx.playBackgroundAudio({
      dataUrl: filePath
    });
    wx.onBackgroundAudioStop(function () {
      clearInterval(interval);
      that.setData({
        speechIcon: utils.IMG_URL+'/images/aIAssistant/speech0.png',
        playingSpeech: ''
      });
    })
  },
    //识别语音 -- 初始化
  initRecord: function() {
      const that = this;
      // 有新的识别内容返回，则会调用此事件
      manager.onRecognize = function(res) {
       
      }
      // 正常开始录音识别时会调用此事件
      manager.onStart = function(res) {
      }
      // 识别错误事件
      manager.onError = function(res) {
      }
      //识别结束事件
      manager.onStop = function(res) {
      if(res.result){
        that.question(res.result);
        that.textDisplay(res.result);
      }
       
        // if (res.result == '') {
        //   wx.showModal({
        //     title: '提示',
        //     content: '听不清楚，请重新说一遍！',
        //     showCancel: false,
        //     success: function(res) {}
        //   })
        //   return;
        // }
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
        // })
        // }
      }
    },
    // 权限询问
  getRecordAuth: function () {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.record']) {
              wx.authorize({
                scope: 'scope.record',
                success() {
                  // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                },
                fail() {
                }
              })
            } else {
            }
          },
          fail(res) {
          }
        })
      },
    //文字转换
  textDisplay:function(result){
        var that = this;
        let messages = that.data.messages;
        let contents = utils.getContents(result)
        let id = 'id_' + Date.parse(new Date()) / 1000;
        let avatar = wx.getStorageSync('userInfo').avatarUrl ? wx.getStorageSync('userInfo').avatarUrl:that.data.meAvatar
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
   //问答
    question:function(msg){
        let that = this
        let params = {
          question:msg
        }
        api.questionAnswer(params).then(res => {
          if (res.data) {
          let answer = res.data[0].answer;
          let questions = [];
          res.data.forEach(function(element) {
            questions.push(element)
          });
          let contents = utils.getContents(answer)
          let id = 'id_' + Date.parse(new Date()) / 1000;
          let data = {
            id: id,
            contents: contents,
            me: false,
            avatar:that.data.robotAvatar,
            speech: false,
            questions:questions
          }
          let messages = that.data.messages
          messages.push(data)
          that.setData({
            messages: messages
          })
          that.setData({
            toView: id
           })
         }
        }).catch(function(error) {
      })
    },
  //问答点击详情页面展示
    itemClick:function(item){
      if(item.currentTarget.dataset.item.answer){
        wx.navigateTo({
          url: '/pages/aIAssistant/questionDetails/index?question='+item.currentTarget.dataset.item.question+'&answer='+item.currentTarget.dataset.item.answer
        })
      }
     },
  //解决小程序华为手机问题
   bindfocusDialog(event) {
    let vm = this;
    vm.setData({
      reasonHeight: event.detail.height || 0
    })
    },
   bindblurDialog(event) {
    let vm = this;
    vm.setData({
      reasonHeight: 0
    })
    },
})