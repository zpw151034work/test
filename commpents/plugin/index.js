//获取应用实例
const app = getApp()
Component({
	properties: {
    pluginData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {}
    }
  },
 data: {
  },
	//第一次进入页面的时候
	attached: function () {
	
	 },
	 methods: {

	 }
})