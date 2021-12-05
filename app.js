// app.js
App({
  onLaunch() {
   
    // 展示本地存储能力
    var that = this
    that.globalData.statusBarHeight = wx.getSystemInfoSync()['statusBarHeight']
  },
  onShow(e) {
    var that = this
    // 获取设备机型
    wx.getSystemInfo({
        success:  res=>{
          let model = res.model;
            if (/iphone\sx/i.test(model) || (/iphone/i.test(model) && /unknown/.test(model))|| /iphone\s11/i.test(model)){
                that.globalData.isIphoneX = true;

            }else{
                that.globalData.isIphoneX = false;
               
            }
        }
    })
  }
  ,onHide() {
    
  },
  globalData: {
      imgUrl:"https://jk.aspoontech.com",
      emojisEn: ['bugaoxing', 'guai', 'qinqin', 'lengmo', 'qie', 'mianqiang', 'chijing', 'tushe', 'hehe', 'hu', 'yi', 'haha', 'ku', 'pen', 'weiqu', 'kaixin', 'deyi', 'nu', 'exin', 'jingku', 'jingya', 'han', 'huaji', 'kuanghan', 'shengqi', 'yiwen', 'zhenbang', 'shuijue', 'xiaoyan', 'mengmengda', 'bishi', 'yinxian', 'heixian'],
      emojis: ['不高兴', '乖', '亲亲', '冷漠', '切~', '勉强', '吃惊', '吐舌', '呵呵', '呼~', '咦', '哈哈', '哭', '喷', '委屈', '开心', '得意', '怒', '恶心', '惊哭', '惊讶', '汗', '滑稽', '狂汗', '生气', '疑问', '真棒', '睡觉', '笑眼', '萌萌哒', '鄙视', '阴险', '黑线'],
      userInfo: null,
      share: false,  // 分享默认为false
      height: 0,
      list:[
      {image:"/assets/images/main/营养.png",name:"营养",url:"pages/healthManagement/nutritionProgramme/index"},
      {image:"/assets/images/main/运动.png",name:"运动",url:"pages/healthManagement/exerciseProgram/index"},
      {image:"/assets/images/main/睡眠.png",name:"睡眠",url:"pages/healthManagement/tcmProgram/index"},
      {image:"/assets/images/main/心理.png",name:"心理",url:"pages/healthManagement/tcmProgram/index"},
      {image:"/assets/images/main/症状.png",name:"症状",url:"pages/healthManagement/tcmProgram/index"},
      {image:"/assets/images/main/护理.png",name:"用药",url:"pages/healthManagement/medicationProgram/index"},
      ],  //全局数据方案
     isIphoneX: false,//判断机型
     statusBarHeight: '',//适配各种机型页面导航条的高度
     robotAvatar:'/assets/images/aIAssistant/机器人.png',
     meAvatar:'/assets/images/aIAssistant/miImg.png'
  },

  observe(obj, key, fun, caller){
    var val = obj[key];
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set(value) {
        val = value;
        fun.call(caller, value, val)
      },
      get() {
        return val;
      }
    })
  },

 // 监听特定data对象的属性变化
 // caller :保留this指针
  watch(data, watch, caller){
    Object.keys(watch).forEach(v => {
      this.observe(data, v, watch[v], caller);
    })

  }
})

