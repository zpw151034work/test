const config = require('../config/config'),
      { _post , _get } = require('./http');

module.exports = {
//   ==================  pages/healthManagement =====================

  //页面数据——营养、运动、心理、睡眠 
  userHealtFfindMaxKey: function (data) {
    return _post(config.ihealthDomain + 'applets/userHealthScore/findMaxKey', data)
  },
  //页面数据——健康得分
  userEvaluationFindMaxKey: function (data) {
    return _post(config.ihealthDomain + 'applets/userEvaluationReport/findMaxKey', data)
  },
  //页面数据——预警
  findByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/userAlertLink/findByCondition', data)
  },
  //页面数据——获取医院和科室
  findMapByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/userClinicRecord/findMapByCondition', data)
  },
   //扫码上传广告机字符串，获取健康评估id
   userPageAnswerCreate: function (data) {
    return _post(config.ihealthDomain + 'applets/userPageAnswer/create', data)
  },
  //获取recipe id
  userSportPlanFindMapByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/userSportPlan/findMapByCondition', data)
  },
  //获取时间和频次
  sportRecipeFindMapByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/sportRecipe/findMapByCondition', data)
  },
  //获取建议方式
  sportFindByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/sportRecipeMethod/findByCondition', data)
  },
  //获取所有建议运动的小运动的图片
  recipeActionFindByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/recipeAction/findByCondition', data)
  },
  //改变服用状态
  updateMedicineIsUse: function (data) {
    return _post(config.ihealthDomain + 'applets/userMedicineRecipe/updateMedicineIsUse', data)
  },
  //
  findMedicineList: function (data) {
    return _post(config.ihealthDomain + 'applets/userMedicineRecipe/findMedicineList', data)
  },
  //
  insertSleepRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userSleepRecord/insertSleepRecord', data)
  },
  //获取当前饮食原则和碳水、蛋白、脂肪
  userDietRecipeFindMapByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/userDietRecipe/findMapByCondition', data)
  },
  //获取早餐 午餐 晚餐 加餐
  userFoodRecipeFindByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodRecipe/findByCondition', data)
  },
  //
  userDiseaseHistoryeFind: function (data) {
    return _post(config.ihealthDomain + 'applets/userDiseaseHistory/findByCondition', data)
  },
  //推荐营养标签接口
  foodTagGetOkNutrientTag: function (data) {
    return _get(config.ihealthDomain + 'applets/foodTag/getOkNutrientTag', data)
  },
   //避免营养标签接口
  foodTagGetBadNutrientTag: function (data) {
    return _get(config.ihealthDomain + 'applets/foodTag/getBadNutrientTag', data)
  },
   //
   userInfoFindMapByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/userInfo/findMapByCondition', data)
  },
  //获取recipe id
  userPsychoRecipe: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoRecipe/findMapByCondition', data)
  },
  //可能诱因、调节原则 
  userPsychoRisk: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoRisk/findByCondition', data)
  },
  //应对策 和 不建议应对策
  userPsychoStrategy: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoStrategy/findByCondition', data)
  },
  //获取地区热线及电话号码
  psychoServicePhone: function (data) {
    return _post(config.ihealthDomain + 'applets/psychoServicePhone/findServicePhoneByProvince', data)
  },
  //获取recipe id 和 task id
  userSleepRecipeLink: function (data) {
    return _post(config.ihealthDomain + 'applets/userSleepRecipeLink/findMapByCondition', data)
  },
  //获取建议入睡时间、建议卧室温度
  sleepRecipeFindMapByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/sleepRecipe/findMapByCondition', data)
  },
  //不入睡困难常见诱因
  sleepCauseFindAll: function (data) {
    return _post(config.ihealthDomain + 'applets/sleepCause/findAll', data)
  },
  //睡前活动
  getSleepEventList: function (data) {
    return _post(config.ihealthDomain + 'applets/sleepEvent/getSleepEventList', data)
  },
  //睡眠建议
  getSleepSuggestionList: function (data) {
    return _post(config.ihealthDomain + 'applets/sleepSuggestion/getSleepSuggestionList', data)
  },
  //睡具体
  sleepToolFindAll: function (data) {
    return _post(config.ihealthDomain + 'applets/sleepTool/findAll', data)
  },

  //   ==================  pages/aIAssistant =====================
  //问答
  questionAnswer: function (data) {
    return _post(config.ihealthDomain + 'applets/aiHelper/questionAnswer', data)
  },
  //获取问题相关信息
  findPageQuestion: function (data) {
    return _post(config.ihealthDomain + 'applets/pageQuestion/findPageQuestion', data)
  },
  //记录运动
  analyseSportRecordContent: function (data) {
    return _post(config.ihealthDomain + 'applets/aiHelper/analyseSportRecordContent', data)
  },
  //饮食确认弹出框
  insertSureSportRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/aiHelper/insertSureSportRecord', data)
  },
  //解密微信session_keystr
  getSessionKey: function (data) {
    return _post(config.ihealthDomain + 'applets/user/getSessionKey', data)
  },
  //调用登录接口获取登录信息
  login: function (data) {
    return _post(config.ihealthDomain + 'applets/user/login', data)
  },
  //注册接口，授权获取手机号成功后进行注册
  registry: function (data) {
    return _post(config.ihealthDomain + 'applets/user/registry', data)
  },
  //返回用户手机号
  updateUserPhoneNum: function (data) {
    return _post(config.ihealthDomain + 'applets/user/updateUserPhoneNum', data)
  },

//   ==================  pages/healthAssessment =====================
  //风险，运动，心理，睡眠，营养
  userHealthEvaluation: function (data) {
    return _post(config.ihealthDomain + 'applets/userHealthEvaluation/findMapByCondition', data)
  },
  //
  userEvaluationReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userEvaluationReport/findMapByCondition', data)
  },
  //柱状图
  userEvaluationReportGetList: function (data) {
    return _post(config.ihealthDomain + 'applets/userEvaluationReport/getList', data)
  },
  //
  userInfoFindUserInfo: function (data) {
    return _post(config.ihealthDomain + 'applets/userInfo/findUserInfo', data)
  },

//   ==================  pages/questionnaire =====================
  //获取css_id 和 question_id
  findQuestionIdAndCssId: function (data) {
    return _post(config.ihealthDomain + 'applets/pageQuestion/findQuestionIdAndCssId', data)
  },
  //既往病史  搜索
  icd10Diagnose: function (data) {
    return _post(config.ihealthDomain + 'applets/icd10Diagnose/findDiagnoses', data)
  },
  //常见病
  findCommonDiseases: function (data) {
    return _post(config.ihealthDomain + 'applets/diseaseCommonLocation/findCommonDiseases', data)
  },

  //   ==================  pages/record =====================
  //初入页面早餐查询
  foodUnionWeigth: function (data) {
    return _post(config.ihealthDomain + 'applets/foodUnionWeigth/findCommonFood', data)
  },
  //早餐查询
  foodQueryByParam: function (data) {
    return _post(config.ihealthDomain + 'applets/es/food/queryByParam', data)
  },
  //点击添餐
  findByFoodName: function (data) {
    return _post(config.ihealthDomain + 'applets/foodUnitWeight/findByFoodName', data)
  },
  //新增餐保存
  insertFoodRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodRecord/insertFoodRecord', data)
  },
  //饮食记录
  findFoodRecordList: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodRecord/findFoodRecordList', data)
  },
  //运动记录
  findSportRecordList: function (data) {
    return _post(config.ihealthDomain + 'applets/userSportRecord/findSportRecordList', data)
  },
  //饮食记录删除
  deleteFoodRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodRecord/deleteFoodRecord', data)
  },
  //运动记录删除
  deleteSportRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userSportRecord/deleteSportRecord', data)
  },
  //运动记录删除
  updateFoodRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodRecord/updateFoodRecord', data)
  },
  //用药查询
  drugFindByCondition: function (data) {
    return _post(config.ihealthDomain + 'applets/drug/findByCondition', data)
  },
  //新增用药保存
  insertUserMedicineRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userMedicineRecord/insertUserMedicineRecord', data)
  },
  //用药记录查询
  findMedicineRecordList: function (data) {
    return _post(config.ihealthDomain + 'applets/userMedicineRecord/findMedicineRecordList', data)
  },
  //用药记录保存
  insertUserMedicineRecordNew: function (data) {
    return _post(config.ihealthDomain + 'applets/userMedicineRecord/insertUserMedicineRecordNew', data)
  },
  //
  findCommonExercise: function (data) {
    return _post(config.ihealthDomain + 'applets/exercise/findCommonExercise', data)
  },
  //新增运动保存
  insertSportRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userSportRecord/insertSportRecord', data)
  },
  //运动查询
  findExerciseList: function (data) {
    return _post(config.ihealthDomain + 'applets/exercise/findExerciseList', data)
  },
  //查询回显
  findUserPsychoRecord: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoRecord/findUserPsychoRecord', data)
  },
  //数据保存
  userPsychoRecordInsert: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoRecord/insert', data)
  },
  //
  findNowUserSleepReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userSleepRecord/findNowUserSleepReport', data)
  },
 
  //   ==================  pages/report =====================
   //运动报告echarrts数据展示
   findHistoryUserSportReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userSportDailyReport/findHistoryUserSportReport', data)
  },
  //运动报告echarrts数据展示
  findHistoryUserFoodDailyReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodDailyReport/findHistoryUserFoodDailyReport', data)
  },
  //页面报告数据
  findUserFoodDailyReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodDailyReport/findUserFoodDailyReport', data)
  },
  //页面数据展示今天
  findUserPsychoDailyReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoDailyReport/findUserPsychoDailyReport', data)
  },
  //
  findHistoryUserPsychoDailyReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userPsychoDailyReport/findHistoryUserPsychoDailyReport', data)
  },
  //
  checkReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userFoodDailyReport/checkReport', data)
  },
  //睡眠报告echarrts数据展示
  findHistoryUserSleepReport: function (data) {
    return _post(config.ihealthDomain + 'applets/userSleepRecord/findHistoryUserSleepReport', data)
  },


}