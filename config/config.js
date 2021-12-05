/**
 * 项目API环境配置
 * ENV
 *  test：测试环境
 *  rd：预发布环境
 *  pro：生产环境
 */
  
const ENV = "pro";
const VERSION = "1.0.0"; //使用在线参数控制时，此版本号控制内容的展示与否！！！！！！

const API = {
  test: Object.freeze({
    ihealthDomain: 'https://ihealthmind.com/',
  }),

  rd: Object.freeze({
    ihealthDomain: 'https://ihealthmind.com/',
  }),

  pro: Object.freeze({
    ihealthDomain: 'https://ihealthmind.com/',
  })
};
// 导出API环境配置
module.exports = Object.assign({
  ENV,
  VERSION,
}, API[ENV]);