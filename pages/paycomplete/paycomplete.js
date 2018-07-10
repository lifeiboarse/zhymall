// pages/paycomplete/paycomplete.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    success: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.flag == 1) {
      this.setData({
        success: '支付成功'
      })
    } else {
      this.setData({
        success: '支付失败'
      })

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  continue: function() {
    //跳转到列表
    wx.navigateTo({
      url: '../ordertotal/ordertotal'

    })

  },
  orderdetail: function() {
    //跳转到列表
    wx.navigateTo({
      url: '../orderDetail/orderDetail'

    })
  }

})