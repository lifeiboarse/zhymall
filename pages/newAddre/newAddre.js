var index = 0;
var animation
var address = require('../../utils/city.js')
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    addreValue: 0,
    addreRange: ['　　　　　　　　　　', '长沙市芙蓉区', '长沙市天心区', '长沙市雨花区', '长沙市开福区', '长沙市岳麓区', '长沙市长沙县', '长沙市长沙县444'],
    door: "街道门牌信息",
    areaValue: 0,
    areaRange: ['　　', '60以下', '60-90', '90-110', '110-130', '130-140', '140-150', '150-160', '160-170', '170-180', '180以上'],

    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: ''
  },
  areaPickerBindchange: function(e) {
    this.setData({
      areaValue: e.detail.value
    })
  },
  addrePickerBindchange: function(e) {
    console.log("addrePickerBindchange:" + e.detail.value)
    this.setData({
      addreValue: e.detail.value
    })
  },
  formSubmit: function(e) {
    var warn = "";
    var that = this;
    var flag = false;
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.addre == "") {
      warn = "请选择您的所在区域";
    } else if (e.detail.value.door == "") {
      warn = "请输入您的具体地址";
    } else if (e.detail.value.area == '0') {
      warn = "请输入您的房屋面积";
    } else {
      flag = true;
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      wx.redirectTo({
        url: '../chooseAddre/chooseAddre?tel=' + e.detail.value.tel + "&addre=" + e.detail.value.addre + "&door=" + e.detail.value.door + "&name=" + e.detail.value.name + "&flag=" + flag + "&addrevalue=" + e.detail.value.addre
        //？后面跟的是需要传递到下一个页面的参数

      });
      //调用数据库保存收货地址
      this.addAddress(e.detail.value);
      console.log("传过去的地址下标是多少？" + e.detail.value.addre)
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

  },
  //保存收货地址
  addAddress: function(e) {
    var requestData = {
      'userId': 1,
      'name': e.name,
      'tel': e.tel,
      'addre': e.addre + e.door
    };
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/address/saveSelective',
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: requestData,
      success: function(res) {
        console.log("add address success:" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("add address fail:" + JSON.stringify(res))
      },
      complete: function(res) {},
    })
  },
  onLoad: function() {
    console.log("onload start")
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    console.log(this.data)
  },

  // 点击所在地区弹出选择框
  selectDistrict: function(e) {
    var that = this
    console.log('111111111')
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(55 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
    })
  },
  hideCitySelected: function(e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },


})