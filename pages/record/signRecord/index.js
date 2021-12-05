//获取应用实例
const app = getApp()
let utils = require("../../../utils/util.js")
Page({
  data: {
    imageURL:utils.IMG_URL,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '体征记录', //导航栏 中间的标题
      dialog:false 
    },
    date: '',
    checked: true,
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    statusBarHeightX:"",
    isIphoneX:"",//苹果X手机适配 
    loading: false,
    color: '#000',
    background: '#f8f8f8',
    animated: false,
    imageURL: "https://img01.yzcdn.cn/vant/ipad.jpeg",
    active: "", //tab激活值
    show: false, //手动记录弹出层
    photoShow: true, //拍照记录弹出框
   
    // fileList: [
    //     {
    //       url: 'https://img.yzcdn.cn/vant/leaf.jpg',
    //       name: '图片1',
    //     },
    //     // Uploader 根据文件后缀来判断是否为图片文件
    //     // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
    //     {
    //       url: 'http://iph.href.lu/60x60?text=default',
    //       name: '图片2',
    //       isImage: true,
    //       deletable: true,
    //     },

    // ],
    fileList: [{
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
      },
      {
        url: 'https://img.yzcdn.cn/vant/tree.jpg',

      },
    ], //照片数据
  },
  onLoad: function () {
   
    let _this = this;
    let statusBarHeight = app.globalData.statusBarHeight+44;
    let statusBarHeightX;
    if(app.globalData.isIphoneX ==true){
      statusBarHeightX = app.globalData.statusBarHeight+76
    }
    else if(app.globalData.isIphoneX ==false){
      statusBarHeightX = app.globalData.statusBarHeight+44
    }
    _this.setData({
      statusBarHeight:statusBarHeight,
      statusBarHeightX:statusBarHeightX,
    });

    let isIphoneX = app.globalData.isIphoneX;
      _this.setData({
        isIphoneX: isIphoneX
     })
  },
  //tab切换
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  //进步器
  onChangeqq(event) {
  },
  //弹出层手动记录
  getUserInfo(event) {
  },
  //弹出框拍照记录
  getShow() {
    this.setData({
      show: true,
      "navbarData.dialog":true
    });
  },
  onClose() {
    this.setData({
      show: false,
      "navbarData.dialog":false
    });
  },
  getShowPhoto() {
    this.setData({
      show: true,
      "navbarData.dialog":true
    });
  },
  onClosePhoto() {
    this.setData({
      photoShow: false,
      "navbarData.dialog":false
    });
  },
  //上传图片
  afterRead(event) {
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({
          ...file,
          url: res.data
        });
        this.setData({
          fileList
        });
      },
    });
  },
  // 删除图片
  delete(event) {

    let imgDelIndex = event.detail.index

    let fileList = this.data.fileList

    fileList.splice(imgDelIndex, 1)


    this.setData({
      fileList

    })

    this.uploadImg(fileList)

  },
  // 上传图片

  uploadImg(file) {
    let _this = this

    var imgUrl = [];

    // 多张图片上传

    for (var i = 0; i < file.length; i++) {
      wx.uploadFile({
        url: baseUrl + forumUploadImg, //写自己的路径

        filePath: file[i].path,

        name: 'img',

        formData: {
          'img': file[i].path

        },

        success: function (res) {

          let obj = JSON.parse(res.data);

          imgUrl.push(obj.data.img_path)

          _this.setData({
            imgUrls: imgUrl
           })
         },
       })
     }
  }
})