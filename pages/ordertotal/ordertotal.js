// pages/ordertotal/ordertotal.js
var request = require('../../utils/https.js')
var uri = 'order/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ["全部订单", "待付款", "待收货"],
    currentNavtab: 0,
    pageNo: 1,
    hidden: false,
    list: [],
    newlist: [],
    tips: '' //无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentNavtab: 0
    })
    //刷新数据
    this.getData();
  },
  //切换tab刷新数据
  switchTab: function (o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    if (idx !== that.data.currentNavtab) {
      that.setData({
        currentNavtab: idx,
        list: [], //数据源清空
        newlist: [],
        pageNo: 1
      })
      //刷新数据
      that.getData();
    }
  },

  getData: function () {
    var that = this;
    var status = "";
    var ordertype = that.data.currentNavtab;
    if (ordertype == 0) {
      status = "";
    } else if (ordertype == 1) {
      status = "10";
    } else if (ordertype == 2) {
      status = "30";
    }
    //var pageNo = that.data.pageNo;
    
    request.req(uri, {
      //ordersn: '1',
      //status: status,
      //pageNo: pageNo,
    }, (err, res) => {
      //console.log("list:"+res.data)
      if (true) {
        if (res.data.data.orderList.length==0) {   //无数据
          that.setData({ hidden: true, tips: "没有数据~" })
        } else {
          that.setData({
            hidden: true,
            list: that.data.list.concat(res.data.data.orderList),
          })
          //处理数据
          var list = that.data.list;
          for (var i = 0; i < list.length; i++) {
            var item = list[i]  //状态状态
            if (item.orderStatus == 10) {   //待支付
              that.data.newlist.push({
                button: "去支付",
                state: "待支付",
                orderTotalPrice: item.orderAmountTotal, //总价
                goodsImage: "",//item.orderGoodsList[0].goodsImage,//图片地址
                goodsName: "11",//item.orderGoodsList[0].goodsName,  //商品介绍介绍
                goodsNum: "22",//item.orderGoodsList[0].goodsNum  //商品数量
              });
            } else if (item.orderStatus == 30) {  //待收货
              that.data.newlist.push({
                button: "确认收货",
                state: "待收货",
                orderTotalPrice: item.orderAmountTotal, //总价
                goodsImage: item.orderGoodsList[0].goodsImage,//图片地址
                goodsName: item.orderGoodsList[0].goodsName,  //商品介绍介绍
                goodsNum: item.orderGoodsList[0].goodsNum  //商品数量
              });
            } else {
              that.data.newlist.push({
                button: "查看详情",
                state: "其他状态",
                orderTotalPrice: item.orderTotalPrice, //总价
                goodsImage: "../../assets/images/p1.jpg",// item.orderProductList[0].goodsImage,//图片地址
                goodsName: item.orderProductList[0].productName,  //商品介绍介绍
                goodsNum: item.orderProductList[0].productNumber,  //商品数量
                productId: item.orderProductList[0].id  //商品数量
              });
            }
          }
          console.log(that.data.newlist);
          that.setData({
            newlist: that.data.newlist
          })
        }
      }
    })
  },
  //点击到相应的页面
  orderbutton: function (options) {
    var type = options.currentTarget.dataset.button;
    var id = options.currentTarget.dataset.id;
    console.log(type)
    if (type == "去支付") {

    } else if (type == "查看详情") {
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?id=' + id
      })
      
    } else if (type == "确认收货") {

    }
  },
  //下滑加载更多
  lower: function () {
    console.log("下滑啦");
    var that = this;
    that.setData({ pageNo: that.data.pageNo + 1 })
    //that.getData();
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