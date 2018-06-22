var flag = false;
Page({
  data: {
    name: "",
    tel: "",
    area: "",
    areavalue: "",
    addre: "",
    dateValue: '预约日期',
    timeValue: '预约时间',
    display1: "flex",
    display2: "none",
    marks: [{
        name: 'window',
        value: '  电话　'
      },
      {
        name: 'machine',
        value: ' 短信'
      }
    ],
    comment: ""
  },

  onLoad: function(options) {
    flag = options.flag;
    console.log("..." + flag)
    if (!flag) {
      this.setData({
        display1: "flex",
        display2: "none",
      })

    } else {
      this.setData({
        display1: "none",
        display2: "flex",
        name: options.name,
        tel: options.tel,
        area: options.area,
        areavalue: options.areavalue,
        addre: options.addre
      })
    }


  },

  toChooseAddre: function() {
    wx.redirectTo({
      url: '../chooseAddre/chooseAddre',
      success: function() {
        console.log("选择地址成功")
      },
      fail: function() {
        console.log("选择地址失败")
      }
    });
  },

  timePickerBindchange: function(e) {
    this.setData({
      timeValue: e.detail.value
    })
  },
  datePickerBindchange: function(e) {
    this.setData({
      dateValue: e.detail.value
    })
  },
  //点击立即预约
  formSubmit: function(e) {
    var warn = ""; //弹框时提示的内容
    var flag = true; //判断信息输入是否完整
    //判断的顺序依次是：姓名-手机号-地址-具体地址-预约日期-预约时间-开荒面积
    if (this.data.name == "") {
      warn = "请输入您的地址信息";
    } else if (e.detail.value.date == '预约日期') {
      warn = "请选择预约日期";
    } else if (e.detail.value.time == '预约时间') {
      warn = "请选择预约时间";
    } else {
      //下面对选择面积后判断需要的时间和阿姨的个数
      var timeNum = 0;
      var personNum = 0;
      var size = this.data.areavalue;
      var window = 0;
      var machine = 0;
      if (size == 1) {
        personNum = 1;
        timeNum = 3;
      } else if (size == 2) {
        personNum = 1;
        timeNum = 4;
      } else if (size == 3) {
        personNum = 1;
        timeNum = 5;
      } else if (size == 4) {
        personNum = 2;
        timeNum = 3;
      } else if (size == 5) {
        personNum = 2;
        timeNum = 3.5;
      } else if (size == 6) {
        personNum = 2;
        timeNum = 4;
      } else if (size == 7) {
        personNum = 2;
        timeNum = 5;
      } else if (size == 8) {
        personNum = 3;
        timeNum = 4;
      } else if (size == 9) {
        personNum = 3;
        timeNum = 5;
      } else {
        //wx.showModal({
        //  title: '提示',
        // content: "超过180平米，请拨打电话400-8116-010联系客服为您服务"
        //})
        return false;
      }
      if (e.detail.value.marks.length == 1) {
        if (e.detail.value.marks == "window") {
          window = 1;
        } else {
          machine = 1;
        }
      } else if (e.detail.value.marks.length == 2) {
        window = 1;
        machine = 1;
      }
      flag = false; //若必要信息都填写，则不用弹框，且页面可以进行跳转
      var that = this;
      wx.navigateTo({
        url: '../confirm/confirm?tel=' + that.data.tel + "&addre=" + that.data.addre + "&door=" + that.data.door + "&date=" + e.detail.value.date + "&time=" + e.detail.value.time + "&personNum=" + personNum + "&timeNum=" + timeNum + "&window=" + window + "&machine=" + machine
        //？后面跟的是需要传递到下一个页面的参数
      });
      console.log('form发生了submit事件，携带数据为：', e.detail.value);

    }
    //如果信息填写不完整，弹出输入框
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },

  //提交订单
  pay: function() {
    var that = this;
    wx.login({
      success: function(res) {
        //https://blog.csdn.net/zhourenfei17/article/details/77765585
        console.log(res.code);
        var URL = 'http://www.binzhoushi.xyz/zhy/weixin/login?code=' + res.code;
        wx.request({
          url: URL,
          data: {},
          method: 'GET',
          success: function(res) {
            console.log(res);
            if (res.data != null && res.data != undefined && res.data != '') {
              wx.setStorageSync("openid", res.data.openid); //将获取的openid存到缓存中  
              that.generateOrder(res.data.openid)
            }
          },
          fail: function(res) {
            console.log("pay:" + res);
          }
        })
      }
    })
  },

  generateOrder: function(openid) {
    var that = this;
    var service_url = 'http://www.binzhoushi.xyz/zhy/weixin/wxPay?openid=' + openid;
    wx.request({
      url: service_url,
      data: {},
      method: 'GET',
      success: function(res) {
        console.log("openid:" + openid);
        that.doWxPay(res.data);
      }
    });
  },
  doWxPay(param) {
    //小程序发起微信支付  
    wx.requestPayment({
      timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了  
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      success: function(event) {
        // success     
        console.log(event);

        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function(error) {
        // fail     
        wx.showModal({
          title: '提示',
         content: "支付失败"
        })
        console.log("支付失败:" + param.data.package)
        console.log(error)
      },
      complete: function() {
        // complete     
        //console.log("pay complete")
      }
    });
  },
})