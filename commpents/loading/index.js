const app = getApp()
Component({
  properties: {
    loadingData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    }
  },
  data: {
    loadingData:{
      loading:"",
    }
  },
 attached: function () {
  },
  methods: {
    onClickShow() {
      this.setData({ show: true });
    },
  
    onClickHide() {
      this.setData({ show: false });
    },
  
    noop() {},
  }
}) 