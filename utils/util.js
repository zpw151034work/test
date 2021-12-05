   function formatTime(time) {
     let date = new Date(time);
     const year = date.getFullYear()
     const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
     const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
     const hour = date.getHours()
     const minute = date.getMinutes()
     const second = date.getSeconds()
     return `${[year, month, day].map(formatNumber).join('-')} `
   }
   const formatNumber = n => {
     n = n.toString()
     return n[1] ? n : `0${n}`
   }
   //今天时间
   var day2 = new Date();
   day2.setTime(day2.getTime());
   var lastY = day2.getFullYear();
   var lastM = day2.getMonth() + 1;
   var lastD = day2.getDate();
   const today = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD);
   let day3 = new Date(day2.getTime() - 24 * 60 * 60 * 1000);
   const yesterday = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
   //前一天时间
   function preDate(curDate) {
     var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
     return preDate
   }

   function newPreDate(curDate) {
     var preDate = new Date(curDate).getTime() - 24 * 60 * 60 * 1000; //前一天
     return preDate
   }
   //时间转换
   function formatDate(date) {
     date = new Date(date);
     return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
   }
   /**
    * 封装微信的的request
    */
   function request(url, data = {}, method = "GET", token) {
     return new Promise(function (resolve, reject) {
       console.log('556644',data)
       wx.request({
         url: url,
         data: data,
         method: method,
         header: {
           'Content-Type': 'application/json',
           'Token': `${wx.getStorageSync('Token')}`
         },
         success: function (res) {
           if (res.statusCode == 200) {
             resolve(res.data);
           } else if (res.statusCode == 201) {
             //创建成功
             resolve(res);
           } else if (res.statusCode == 202) {
             //成功
             resolve(res);
           } else if (res.statusCode == 204) {
             //成功但未找到
             resolve(res);
           } else if (res.statusCode == 400) {
             //错误
             reject(res);
           } else if (res.statusCode == 401) {
             //未登录授权用户信息
             wx.navigateTo({
               url: '/pages/auth/user_info'
             })
             reject(res);
           } else if (res.statusCode == 402) {
             //未绑定手机号
             wx.navigateTo({
               url: '/pages/auth/user_mobile'
             })
             reject(res);
           } else if (res.statusCode == 404) {
             //未登录
             reject(res);
           } else {
             wx.hideLoading()
             reject(res.message);
           }
         },
         fail: function (err) {
           wx.hideLoading()
           reject(err)
         }
       })
     });
   }
   //字符串拼接

   function insertStrOnceSize(content, str, size) {
     if (content.length <= size) return content;
     return content.substring(0, size) + "\n" + insertStrOnceSize(content.substring(15, content.length), '\n', size);
   }
   //选这时间
   function selectData(params) {
     return params
   }

   function getContents(msg, url) {
     let contents = []
     if (url) {
       contents.push({
         type: 'text',
         text: msg + "\n" + insertStrOnceSize(url, '\n', 15)
       })
       return contents;
     }
     let arr = msg.match(/\[[^\[\]]+\]/g);
     for (let i in arr) {
       let emoji = arr[i].substring(1, arr[i].length - 1);
       let index = emojis.indexOf(emoji);
       if (index != -1) {
         let str = msg.substring(0, msg.indexOf(arr[i]));
         if (str) {
           contents.push({
             type: 'text',
             text: insertStrOnceSize(str, '\n', 15)
           })
         }
         contents.push({
           type: 'image',
           url: '/emoji/' + emojisEn.slice(index, index + 1)[0] + '.png'
         })
         msg = msg.substring(msg.indexOf(arr[i]) + arr[i].length, msg.length)
       }
     }
     if (msg) {
       contents.push({
         type: 'text',
         text: insertStrOnceSize(msg, '\n', 15)
       })
     }
     return contents
   }

   function getEmojiEn(emoji) {
     let index = emojis.indexOf(emoji);
     return emojisEn.slice(index, index + 1)[0];
   }
   //获取当前时间30天前的时间
   function daysAgo() {
     var day2 = new Date();
     var strtime = today + ' 00:00:00';
     var date = new Date(strtime); //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
     var date = new Date(strtime.replace(/-/g, '/'));
     var lastDate = new Date(date - 1000 * 60 * 60 * 24 * 29); //最后30天可以更改，意义：是获取多少天前的时间
     var lastY = lastDate.getFullYear();
     var lastM = lastDate.getMonth() + 1;
     var lastD = lastDate.getDate();
     var LDate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD); //得到30天前的时间
     return LDate + " 00:00:00";
   }
   // var API_URL = 'https://shejiao-api.hanfoto.com';
   var API_URL = 'https://ihealthmind.com/applets';
   var IMG_URL = "https://ihealthmind.com"; //静态图片
   var Host = "http://123.56.45.225:8063/"; //动态图片地址
   //var IMG_URL ='../../../assets/images'
   var config = {
     AccessKeySecret: 'H7GH5MkloifwfMbAOAomOg49VC7kDE',
     OSSAccessKeyId: 'LTAIMp7z2lxwvugc',
     timeout: 87600
   };
   //-------------------------------------问卷 start-----------------------------
   var pageIdFirstScreen = 29; //初筛  page_id
   var pageIdSleepScreen = 19; //睡眠二筛  page_id
   var pageIdPsychologyScreen = 17; //心理二筛  page_id
   var questionID_nativePlace = 175; //籍贯  答案选项为本地选项，答案为选项内容
   var questionID_sexSpecial = 145; //特殊时期  根据性别判断是否显示此题
   /**
    * 性别的question id
    * 143
    */
   var questID_sex = 143

   /**
    * 起床时间question id
    * 30
    * 下拉选择的内容为本地维护，需要根据ID进行匹配;
    * 确定作为答案后需要对选项去除时间格式转为Int
    */
   var questID_wakeUpTime = 30;
   /**
    * 晚上上床时间question id
    * 27
    * 下拉选择的内容为本地维护，需要根据ID进行匹配
    * 确定作为答案后需要对选项去除时间格式转为Int
    */
   var questID_gotoBedTime = 27;
   /**
    * 实际入睡时长question id
    * 31
    * 下拉选择的内容为本地维护，需要根据ID进行匹配
    */
   var questID_sleepTime = 31;


   /**
    * 营养——主食 question id
    * 165
    * 显示图片，展示事例按钮
    */
   var questID_nutritionMeal = 165

   /**
    * 营养——肉类 question id
    * 166
    * 显示图片，展示事例按钮
    */
   var questID_nutritionMeat = 166

   /**
    * 营养——蛋类 question id
    * 167
    * 显示图片，展示事例按钮
    */
   var questID_nutritionEgg = 167

   /**
    * 营养——豆腐 question id
    * 168
    * 显示图片，展示事例按钮
    */
   var questID_nutritionTofu = 168

   /**
    * 营养——牛奶 question id
    * 169
    * 显示图片，展示事例按钮
    */
   var questID_nutritionMilk = 169

   /**
    * 营养——水产 question id
    * 170
    * 显示图片，展示事例按钮
    */
   var questID_nutritionAquactic = 170

   /**
    * 营养——蔬菜 question id
    * 171
    * 显示图片，展示事例按钮
    */
   var questID_nutritionVegetable = 171

   /**
    * 营养——水果 question id
    * 172
    * 显示图片，展示事例按钮
    */
   var questID_nutritionFruit = 172

   /**
    * 营养——坚果 question id
    * 173
    * 显示图片，展示事例按钮
    */
   var questID_nutritionNuts = 173

   /**
    * 营养 165-173
    * 当question id 在这个分为内，则选择内容为本地维护的Int数组
    */
   var nutritionIDGroup = [questID_nutritionMeal,
     questID_nutritionMeat,
     questID_nutritionEgg,
     questID_nutritionTofu,
     questID_nutritionMilk,
     questID_nutritionAquactic,
     questID_nutritionVegetable,
     questID_nutritionFruit,
     questID_nutritionNuts
   ]

   /**
    * 您是否同时患有其他疾病
    * 158
    * 非必选题，可以跳过
    */
   var questID_otherDiagnose = 158

   /**
    * 身高显示 单位 cm
    * 146
    */
   var questID_heightBody = 146

   /**
    * 体重显示 单位 kg
    * 147
    */
   var questID_weightBody = 147

   /**
    * 下面4个选项中，您符合哪种情况（可多选）question id
    * 157
    * 多选题，但是选择 以上均没有的时候，与其它选项互斥，
    * 目前按照互斥为最后一条选项来做，以后更新题库，需要注意选项的顺序
    */
   var questID_fourYouAre = 157

   /**
    * 您是否对以下食物过敏 question id
    * 159
    * 多选题，但是选择 以上均没有的时候，与其它选项互斥，
    * 目前按照互斥为最后一条选项来做，以后更新题库，需要注意选项的顺序
    */
   var questID_allergy = 159
   /**
    * 抑郁-评分是否触发二级筛查
    * 评分涉及的question id
    */
   var depressedScore = [9, 10, 11, 12, 13, 14, 15, 16, 17]
   /**
    * 焦虑-评分是否触发二级筛查
    * 评分涉及的question id
    */
   var anxiousScore = [18, 19, 20, 21, 22, 23, 24]
   /**
    * 睡眠-评分是否触发二级筛查
    * 评分涉及的question id
    */
   var sleepScore = [25, 26]

   /**
    * 女性特殊时期的question id
    * 145
    */
   var questID_specialDay = 145
   /**
    * 问卷
    * 获取questionID
    * @param {*} conunt 展示问题的页面序号
    */
   function obtainQuestionID(count) {
     let dataResStr = wx.getStorageSync('dataRes')
     let dataRes = JSON.parse(dataResStr)
     let questionId = dataRes[count].questionId
     return questionId
   }

   /**
    * 问卷
    * 获取cssID
    * @param {*} conunt 展示问题的页面序号
    */
   function obtainCssId(count) {
     let dataResStr = wx.getStorageSync('dataRes')
     let dataRes = JSON.parse(dataResStr)
     let cssId = dataRes[count].cssId
     return cssId
   }

   /**
    *  问卷
    * 获取总的问题个数
    */
   function obtainTotalCount() {
     let dataResStr = wx.getStorageSync('dataRes')
     let dataRes = JSON.parse(dataResStr)
     let total = dataRes.length
     return total
   }

   /**
    * 根据cssID获取问卷展示题目的的页面URL
    * @param {*} cssID 问卷界面的样式类型
    */
   function qustionnaireChange(cssID) {
     let pageUrl = ''
     if (cssID == "0") {
       pageUrl = "../multipleChoice/index"
     } else if (cssID == "1") {
       pageUrl = "../radioPage/index"
     } else if (cssID == "2") {
       pageUrl = "../edittextPage/index"
     } else if (cssID == "3") {
       pageUrl = "../pickerPage/index"
     } else if (cssID == "4") {
       pageUrl = "../multipleSearch/index"
     } else if (cssID == "5") {
       pageUrl = "../singleSearch/index"
     } else if (cssID == "6") {
       pageUrl = "../picPickerPage/index"
     } else if (cssID == "7") {
       pageUrl = "../ageSelection/index"
     }
     return pageUrl
   }

   /**
    *  问卷页面跳转Url拼接参数
    * @param {*} pageUrl 目标页面的跳转链接
    * @param {*} questionID 问题 question id
    * @param {*} count 目标页面的序号
    * @param {*} total 题目的总个数
    */
   function questionnaireChangeSplitParmeter(pageUrl, questionID, count, total, sectionTitle, answerListStr) {
     let pathUrl = pageUrl + "?questionID=" + questionID + "&count=" + count + "&total=" + total + "&sectionTitle=" + sectionTitle + "&answerListStr=" + answerListStr
     return pathUrl
   }

   /**
    * 问卷页面跳转逻辑，外部调用方法
    * 小程序页面只能累积10层
    * @param {*} count 目标页面的序号
    */
   function questionnairePage(currentCount, targetCount, answerListStrResult) {

     let answerListStr = answerListStrResult
     let questionID = obtainQuestionID(targetCount)

     if (questionID == questionID_sexSpecial) { //通过性别判断是否显示特殊时期
       let dataResList = JSON.parse(answerListStr)
       let sexChooseTemp = dataResList[targetCount - 1].answer

       if (sexChooseTemp == 0) { //男性没有特殊时期
         if (currentCount < targetCount) {
           targetCount += 1
         } else {
           targetCount -= 1
         }
         questionID = obtainQuestionID(targetCount) //跳过特殊时期重新拿取 questionId
       }
     }

     if (currentCount > targetCount) { //返回跳转，清除目标序号之后的答案，避免答案混乱
       let dataResList = JSON.parse(answerListStr)
       let dataResListTemp = new Array()
       for (let i = 0; i < dataResList.length - 1; i++) {
         dataResListTemp.push(dataResList[i])
       }
       answerListStr = JSON.stringify(dataResListTemp)
     }

     let pageIdTemp = wx.getStorageSync('pageId')
     let sectionTitleTemp = ""
     if (pageIdTemp == pageIdFirstScreen) {
       sectionTitleTemp = sectionTitle(pageIdTemp, targetCount)
     } else if (pageIdTemp == pageIdSleepScreen) {
       sectionTitleTemp = "睡眠评测"
     } else if (pageIdTemp == pageIdPsychologyScreen) {
       sectionTitleTemp = "心理评测"
     }
     let cssId = obtainCssId(targetCount)
     let basePath = qustionnaireChange(cssId)
     let total = obtainTotalCount()
     let patheUrl = questionnaireChangeSplitParmeter(basePath, questionID, targetCount, total, sectionTitleTemp, answerListStr)
     return patheUrl
   }

   /**
    * 正向跳转
    * 决定下一个页面的类型，
    * retrun 跳转小节页面 1 , 跳转问题页面 2 , 问卷结束 0
    * @param {*} count 
    */
   function resolveNextPageStyle(pageID, count) {
     let sectionTemp = 2
     let total = obtainTotalCount()
     if (pageID == pageIdFirstScreen) { //只有初筛才有小节
       if (count == 0) { //基本信息

       } else if (count == 11) { //疾病信息
         sectionTemp = 1
       } else if (count == 20) { //生活信息
         sectionTemp = 1
       } else if (count == 25) { //营养筛查
         sectionTemp = 1
       } else if (count == 35) { //心理筛查
         sectionTemp = 1
       } else if (count == 51) { //运动筛查
         sectionTemp = 1
       } else if (count == 55) { //睡眠筛查
         sectionTemp = 1
       }
     }
     if (count == total) { //结束
       sectionTemp = 0
     }
     return sectionTemp
   }
   /**
    * 小节页面标题
    * @param {*} count 
    */
   function sectionTitle(pageID, count) {
     let sectionTemp = '基本信息'
     if (pageID == pageIdFirstScreen) { //只有初筛才有小节
       if (count >= 0 && count < 11) { //基本信息
         sectionTemp = '基本信息'
       } else if (count >= 10 && count < 20) { //疾病信息
         sectionTemp = '疾病信息'
       } else if (count >= 19 && count < 25) { //生活信息
         sectionTemp = '生活信息'
       } else if (count >= 24 && count < 35) { //营养筛查
         sectionTemp = '营养筛查'
       } else if (count >= 34 && count < 51) { //心理筛查
         sectionTemp = '心理筛查'
       } else if (count >= 50 && count < 55) { //运动筛查
         sectionTemp = '运动筛查'
       } else if (count >= 56) { //睡眠筛查
         sectionTemp = '睡眠筛查'
       }
     }
     return sectionTemp
   }

   /**
    * 记录答案
    * 将新的答案拼接到答案列表中，转成json字符串返回
    * @param {*} answeerList 
    * @param {*} questionID 
    * @param {*} answeer 
    * @param {*} score 初筛心理和睡眠
    */
   function arrangeAnsweer(answeerListStr, questionId, answeer, score) {
     let answeerList = ''
     if (answeerListStr.length <= 0) {
       answeerList = new Array()
     } else {
       answeerList = JSON.parse(answeerListStr)
     }
     let objTemp = {
       "questionId": questionId,
       "answer": answeer,
       "score": score
     }
     answeerList.push(objTemp)
     let answeerListStrTemp = JSON.stringify(answeerList)
     return answeerListStrTemp
   }

   /**
    * 当前部分（初筛、睡眠、情绪）完结的时候对后续逻辑进行判断
    * 是跳转二筛页面还是直接上传
    * 返回值 0 没有二筛  1 睡眠二筛   2 心理二筛   3 睡眠和心理都有   
    * 4 当心理二筛结束后     5睡眠二筛结束后
    * @param {*} pageId 
    * @param {*} resultData  当前部分所有问题的答案集合
    */
   function overJudgement(pageId, resultData) {
     if (pageId == pageIdFirstScreen) {
       let overScore = 0
       let sleepScoreT = 0
       let psychology = 0
       let depressScoreTemp = 0
       let anxiouScoreTemp = 0
       let sleepScoreTemp = 0
       let resultList = JSON.parse(resultData)
       for (let i = 0; i < resultList.length; i++) {
         let questionId = resultList[i].questionId
         for (let j = 0; j < depressedScore.length; j++) {
           if (questionId == depressedScore[j]) {
             let scoreTemp = parseInt(resultList[i].score)
             depressScoreTemp += scoreTemp
           }
         }
         for (let j = 0; j < anxiousScore.length; j++) {
           if (questionId == anxiousScore[j]) {
             let scoreTemp = parseInt(resultList[i].score)
             anxiouScoreTemp += scoreTemp
           }
         }
         for (let j = 0; j < sleepScore.length; j++) {
           if (questionId == sleepScore[j]) {
             let scoreTemp = parseInt(resultList[i].score)
             sleepScoreTemp += scoreTemp
           }
         }
       }
       if (depressScoreTemp >= 5) {
         psychology = 2
       }
       if (anxiouScoreTemp >= 5) {
         psychology = 2
       }
       if (sleepScoreTemp < 15) {
         sleepScoreT = 1
       }
       overScore = psychology + sleepScoreT
       return overScore
     } else if (pageId == pageIdSleepScreen) {
       return 5
     } else if (pageId == pageIdPsychologyScreen) {
       return 4
     }
   }

   /**
    * 当前部分（初筛 睡眠  心理）答完后整理答案串
    */
   function arrangeAswerStr(answerStr) {
     let answerList = JSON.parse(answerStr)
     let aswerListArrange = new Array()
     for (let i = 0; i < answerList.length; i++) {
       aswerListArrange.push(answerList[i])
       let questionID = answerList[i].questionId
       if (questionID == questID_sex) { // 男性要补充生理期的答案格式
         let answer = answerList[i].answer
         if (answer == 0) {
           let objTemp = {
             "questionId": questID_specialDay,
             "answer": '',
             "score": ''
           }
           aswerListArrange.push(objTemp)
         }
       }
     }
     let endResult = JSON.stringify(aswerListArrange)
     return endResult
   }
   //----------------------------------questionnaire end----------------------------

   module.exports = {
     formatTime,
     request,
     config,
     API_URL,
     getContents,
     getEmojiEn,
     formatDate,
     today,
     preDate,
     newPreDate,
     yesterday,
     daysAgo,
     selectData,
     IMG_URL,
     Host,
     pageIdFirstScreen,
     pageIdSleepScreen,
     pageIdPsychologyScreen,
     obtainQuestionID,
     obtainCssId,
     obtainTotalCount,
     qustionnaireChange,
     questionnaireChangeSplitParmeter,
     questionnairePage,
     resolveNextPageStyle,
     arrangeAnsweer,
     questionID_nativePlace,
     questID_wakeUpTime,
     questID_gotoBedTime,
     questID_sleepTime,
     nutritionIDGroup,
     questID_nutritionMeal,
     questID_otherDiagnose,
     questID_heightBody,
     questID_weightBody,
     questID_fourYouAre,
     questID_allergy,
     overJudgement,
     arrangeAswerStr,
     questID_nutritionMeat,
     questID_nutritionEgg,
     questID_nutritionTofu,
     questID_nutritionMilk,
     questID_nutritionAquactic,
     questID_nutritionVegetable,
     questID_nutritionFruit,
     questID_nutritionNuts,
   }