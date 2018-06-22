// pages/login/login.js
var util = require('../../utils/util.js')
var request = require('../../utils/https.js')
var app = getApp()
var uri = 'loginapi/login' //登录接口
var option = {}
var uribuy = 'cartapi/addCart' //立即购买
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backcolor: '#f0f2f5',
    username: '',
    psword: '',
    userInfo: {},
    disabled: true, //是否能点击
    plain: false,
    loading: false, //true 为加载中
    showToast: '',
  },
  //用户名
  bindusnInput: function(e) {
    this.setData({
      username: e.detail.value,
    })
    if (this.data.username && this.data.psword) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  //密码
  bindpsdInput: function(e) {
    this.setData({
      psword: e.detail.value,
    })
    if (this.data.username && this.data.psword) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

  //确定--登陆
  loginbutton: function() {
    var that = this;
    that.setData({
      loading: true,
      disabled: true,
    })

    var username = that.data.username;
    var password = that.data.psword;

    request.req(uri, {
      username: username,
      password: password
    }, (err, res) => {
      console.log(res);
      this.setData({
        loading: false,
        disabled: false,
      })

      if (res.data.data.result == 0) {
        var result = res.data.data[0] 
        //存储数据
        var CuserInfo = {
          token: result.token,
          code: result.code,
          //cartcount: result.cartCount,
          loginname: result.memberName,
          avatar_url: result.memberAvatar   //用户头像
        };
        console.log("CuserInfo:" + CuserInfo);
        wx.setStorageSync('CuserInfo', CuserInfo);
        //登陆成功 跳转
        if (option.specId && option.goodsId) { //立即购买
          var that = this;  
          request.req(uribuy, {
            specId: option.specId,
            count: '1',
            saveType: '1',
            goodsId: option.goodsId
          }, (err, res) => {
            var result = res.data;
            console.log(result);
            if (result.result == 1) { //获取cartId
              //拿着cartId跳转到确认订单界面
              console.log("哈哈")
              var cartIds = result.data[0].cartIds;
              wx.redirectTo({   //获取cartId
                url: '../orderConfirm/orderConfirm?cartIds=' + cartIds,
              })

            } else {
              console.log(res.data.msg)
              that.setData({ showToast: res.data.msg })
              //跳转到goodsDetail**
              setTimeout(
                wx.redirectTo({   //获取cartId
                  url: '../goodsDetail/goodsDetail?specId=' + option.specId,
                }), 2000)
            }
          })
        } else if (option.id == 3){
          wx.redirectTo({   //加个参数  
            url: '../service/service'
          })
          console.log("跳转到售后界面")
        }else{
          wx.redirectTo({
            url: '../ordertotal/ordertotal?id=' + option.id,
          })
          console.log("跳转到ordertotal界面")
        }

      } else {
        //提示
        this.setData({
          showToast: res.data.msg,
          backcolor: 'red',
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  }
})