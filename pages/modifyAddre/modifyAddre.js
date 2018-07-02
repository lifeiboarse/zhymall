var flag = false;
var index = 0;

var animation
var address = require('../../utils/city.js')
Page({
  data: {
    name: "请填写您的姓名",
    tel: "请填写您的联系方式",
    addreValue: 0,
    addreRange: ['　　　　　　　　　　', '长沙市芙蓉区', '长沙市天心区', '长沙市雨花区', '长沙市开福区', '长沙市岳麓区', '长沙市长沙县'],
    door: "街道门牌信息",
    areaValue: 0,
    areaRange: ['　　', '60以下', '60-90', '90-110', '110-130', '130-140', '140-150', '150-160', '160-170', '170-180', '180以上'],
    index: "0",
    addressId: "0",
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
  onLoad: function(options) {
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

    this.setData({
      name: options.name,
      tel: options.tel,
      addreValue: options.addrevalue,
      areaValue: options.areavalue,
      door: options.door,
      index: options.index,
      addressId: options.id
    })
    console.log("传过来的index" + options.index);
    console.log("接收到的index" + this.data.index);
    //修改收货地址
    this.queryAddress(options.id);
  },


  areaPickerBindchange: function(e) {
    this.setData({
      areaValue: e.detail.value
    })
  },
  addrePickerBindchange: function(e) {
    this.setData({
      addreValue: e.detail.value
    })
  },
  //点击删除
  delete: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址信息吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.deleteAddress();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //点击取消，返回上个页面
  cancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击保存
  formSubmit: function(e) {
    var warn = "";
    var that = this;
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

      //调用数据库保存收货地址
      this.updateAddress(e);
    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

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


  //根据ID查询收货地址
  queryAddress: function(id) {
    var that = this;
    var userId = 1;
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/address/query?id=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      data: {},
      success: function(res) {
        console.log("query address success:" + JSON.stringify(res));
        that.setData({
          name: res.data.data.name,
          tel: res.data.data.tel,
          addre: res.data.data.addre,
          door: res.data.data.door,
          addressId: res.data.data.id
        })
      },
      fail: function(res) {
        console.log("query address fail:" + JSON.stringify(res))
      }
    })
  },

  //修改收货地址
  updateAddress: function(e) {
    var that = this;
    var requestData = {
      'id': that.data.addressId,
      'userId': 1,
      'name': e.detail.value.name,
      'tel': e.detail.value.tel,
      'addre': e.detail.value.addre + e.detail.value.door
    };

    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/address/updateSelective',
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: requestData,
      success: function(res) {
        console.log("update address success:" + JSON.stringify(res));
        wx.redirectTo({
          url: '../chooseAddre/chooseAddre?tel=' + e.detail.value.tel + "&addre=" + that.data.addreRange[e.detail.value.addre] + "&door=" + e.detail.value.door + "&name=" + e.detail.value.name + "&area=" + that.data.areaRange[e.detail.value.area] + "&sign=" + '1' + "&areavalue=" + e.detail.value.area + "&addrevalue=" + e.detail.value.addre + "&index=" + that.data.index
          //？后面跟的是需要传递到下一个页面的参数
        });
      },
      fail: function(res) {
        console.log("update address fail:" + JSON.stringify(res))
      }
    })
  },

  //删除收货地址
  deleteAddress: function() {
    var that = this;
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/address/delete?id=' + that.data.addressId,
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: {},
      success: function(res) {
        console.log("delete address success:" + JSON.stringify(res));
        wx.redirectTo({
          url: '../chooseAddre/chooseAddre?index=' + that.data.index + "&sign=" + '2'
        });
      },
      fail: function(res) {
        console.log("delete address fail:" + JSON.stringify(res))
      }
    })
  },
})