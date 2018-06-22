// pages/pay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtOrderCode: ''
  },

  pay:function(){
    var that = this;
    wx.login({
      success:function(res){
        //https://blog.csdn.net/zhourenfei17/article/details/77765585
        console.log(res.code);
        var URL = 'http://www.binzhoushi.xyz/zhy/weixin/login?code=' + res.code;
        wx.request({
          url: URL,
          data:{},
          method: 'GET',   
          success: function (res){
            console.log(res);
            if (res.data != null && res.data != undefined && res.data != '') {
              wx.setStorageSync("openid", res.data.openid);//将获取的openid存到缓存中  
              that.generateOrder(res.data.openid)
            }  
          },
          fail:function(res){
            console.log("pay:"+res);
          }
        })
      }
    })    
  },

  generateOrder: function (openid){
    var that = this;
    var service_url = 'http://www.binzhoushi.xyz/zhy/weixin/wxPay?openid=' + openid;
    wx.request({
      url: service_url,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log("openid:" + openid);
        that.doWxPay(res.data);
      }
    });  
  },
  doWxPay(param) {
    //小程序发起微信支付  
    wx.requestPayment({
      timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了  
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      success: function (event) {
        // success     
        console.log(event);

        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (error) {
        // fail     
        console.log("支付失败:" + param.data.package)
        console.log(error)
      },
      complete: function () {
        // complete     
        //console.log("pay complete")
      }
    });
  }  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})