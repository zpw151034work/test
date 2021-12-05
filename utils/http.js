
module.exports = {
  _post: function (url, postData = {}, header) {
    return new Promise((resolve, reject) => {
      if (!header) {
        header = {
          'Content-Type': 'application/json',
          'Token': `${wx.getStorageSync('Token')}`,
        };
      }
      wx.request({
        url,
        header,
        data: postData,
        method: 'POST',
        success: function (res) {
            if(res.statusCode == 200){
                resolve(res.data);
            }else if (res.statusCode == 401) {
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
        fail: function (res) {
            wx.hideLoading()
            reject(res)
        }
      })
    });
  },

  _get: function (url, postData = {}, header) {
    return new Promise((resolve, reject) => {
      if (!header) {
        header = {
            'Content-Type': 'application/json',
            'Token': `${wx.getStorageSync('Token')}`,
          };
      }
      wx.request({
        url,
        header,
        data: postData,
        method: 'GET',
        success: function (res) {
            if(res.statusCode == 200){
                resolve(res.data);
            }else if (res.statusCode == 401) {
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
        fail: function (res) {
            wx.hideLoading()
            reject(res)
        }
      })
    });
  },



};
