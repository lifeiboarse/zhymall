// pages/goodsDetail/goodsDetail.js
var specId = ''
var goodsId = ''
var app = getApp();
var request = require('../../utils/https.js')
var uribuy = 'cartapi/addCart' //立即购买
var uri = 'goods/api/get'
var uri_h5 = 'http://www.binzhoushi.xyz/zhy/goods/api/get'
//在使用的View中引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: '',
    detailData: null,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    var that = this;
    this.requestData(options);
  },

  buyCart: function(event) {
    this.searchCart(1, goodsId);

  },

  buyNow: function(event) { //获取cartId
    //判断是否登陆,如果未登陆跳到登陆界面，如果登陆就调接口，跳转确认订单界面
    var CuserInfo = wx.getStorageSync('CuserInfo');
    console.log(CuserInfo.token)
    if (!CuserInfo.token) {
      //跳转到login
      wx.navigateTo({
        url: '../login/login?goodsId=' + goodsId + '&specId=' + specId,
      })
    } else {
      var that = this;
      request.req(uribuy, {
        specId: specId,
        count: '1',
        saveType: '1',
        goodsId: goodsId
      }, (err, res) => {
        var result = res.data;
        console.log(result);
        if (result.result == 1) { //获取cartId
          //拿着cartId跳转到确认订单界面
          wx.navigateTo({ //获取cartId
            url: '../orderConfirm/orderConfirm?cartIds=' + result.data[0].cartIds,
          })
        } else {
          that.setData({
            tips: res.data.msg
          })
          console.log(res.data.msg)
        }
      })
    }
  },



  //数据请求
  requestData: function(oo) {
    specId = oo.specId;
    var that = this;
    request.req(uri, {
      specId: specId
    }, (err, res) => {
      if (res.data.result == 1) {
        goodsId = res.data.data.id,
          //h5
          wx.request({
            url: uri_h5,
            data: {
              goodsId: goodsId
            },
            method: 'GET',
            success: function(res) {
              console.log(res)
              var goodsDetail = res.data.data;
              goodsDetail = `<div style="margin-top:10px;height:50px;">
		<p class="reply">
			wxParse回复0:不错，喜欢[03][04]
		</p>	
	</div><div style="margin-top:10px;height:50px;">
		<p class="reply">
			wxParse回复1:不错，喜欢[03][04]
		</p>	
	</div><div style="margin-top:10px;height:50px;">
		<p class="reply">
			wxParse回复1:不错，喜欢[03][04]
		</p>	
	</div><div style="margin-top:10px;height:50px;">
		<p class="reply">
			wxParse回复1:不错，喜欢[03][04]
		</p>	
	</div>`;
              WxParse.wxParse('goodsDetail', 'html', goodsDetail, that, 5);
            },
          })
        that.setData({
          //detailData: that.data.detailData.concat(res.data.data),
          detailData: res.data.data,
        })
      }
    })
  },
  //查询购物车
  searchCart: function(userId, goodsId) {
    var that = this;
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/cart/list?userId=' + userId + "&goodsId=" + goodsId,
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      data: {},
      success: function(res) {
        //console.log("search cart success:" + JSON.stringify(res));
        // 页面加载时就给购物车显示商品数量
        if (res.data.data.length === 0) {
          that.addCard(userId, goodsId);
          console.log("add cart success:");
        } else {
          that.updateCartNumber(userId, goodsId);
          console.log("update cart success:");
        }
      },
      fail: function(res) {
        console.log("search cart fail:" + JSON.stringify(res))
      }
    })
  },
  //首次点击添加到购物车
  addCard: function(userId, goodsId) {
    var requestData = {
      'userId': userId,
      'goodsId': goodsId
    };
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/cart/saveSelective',
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: requestData,
      success: function(res) {
        console.log("detail add cart success:" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("detail add cart fail:" + JSON.stringify(res))
      }
    })

  },
  //修改购物数量和总价格
  updateCartNumber: function(userId, goodsId) {
    var requestData = {
      'goodsId': goodsId,
      'userId': userId
    };
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/cart/updateCartNumber',
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: requestData,
      success: function(res) {
        console.log("update cart success:" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("update cart fail:" + JSON.stringify(res))
      },
      complete: function(res) {},
    })

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