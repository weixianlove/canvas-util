//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success: res => {
        //获取屏幕宽度，然后根据宽度图获取图片
        this.globalData.screenWidth = res.screenWidth;
        this.globalData.pixelRatio = res.pixelRatio;
        this.globalData.factor = res.screenWidth / 750;
      },
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    factor: 0.5,
    screenWidth: 375,
    pixelRatio: 2
  },

  toPx: function (rpx) {
    //这里的 2 可以改成 动态的 pixelRatio
    //设成固定的是为了在不同设备生成的图片可以在同一级分辨率 
    return rpx * this.globalData.factor * 2;
  }
})