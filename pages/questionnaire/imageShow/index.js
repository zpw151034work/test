// pages/questionnaire/edittextPage/edittextThem.js
const app = getApp()
let utils = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    statusBarHeight: "",
    fileList: [
      {
        url: 'https://img.yzcdn.cn/vant/leaf.jpg',
        name: '图片1',
      },
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true,
        deletable: true,
      },
    ],
    navbarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '图片展示', //导航栏 中间的标题
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let statusBarHeight = app.globalData.statusBarHeight + 44;
    this.setData({
      statusBarHeight: statusBarHeight,
    })
  },
 //上传文件
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },
 
})