var index = 0;
var li = [];
//image: null;
Page({
  data: {
    image:"../../images/uncheck.png",
    list: li,
   
  },
  addAddre: function(e) {
    wx.navigateTo({
      url: '../newAddre/newAddre'
    })
  },
  toModifyAddre: function(e) {
    console.log("选中的电话" + e.currentTarget.dataset.addrevalue);
    console.log("选中的index" + e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../modifyAddre/modifyAddre?name=' + e.currentTarget.dataset.name + "&tel=" + e.currentTarget.dataset.tel + "&addrevalue=" + e.currentTarget.dataset.addrevalue + "&areavalue=" + e.currentTarget.dataset.areavalue + "&door=" + e.currentTarget.dataset.door + "&index=" + e.currentTarget.dataset.index + "&id=" + e.currentTarget.dataset.id
    })
  },
  toCleanOrder: function(e) {
    /** 
    for (var i = 0; i < this.data.list.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        li[e.currentTarget.dataset.index].image = "../../images/check.jpg"
      } else {
        li[i].image = "../../images/uncheck.png"
      }
    }
    */
    wx.navigateTo({
      url: '../cleanOrder/cleanOrder?name=' + e.currentTarget.dataset.name + "&tel=" + e.currentTarget.dataset.tel + "&area=" + e.currentTarget.dataset.area + "&addre=" + e.currentTarget.dataset.addre + "&areavalue=" + e.currentTarget.dataset.areavalue + "&flag=" + true,
      success: function(e) {
        //跳转到支付页面成功
        console.log("跳转到支付页面成功" + e)
      },
      fail: function(e) {
        //跳转到支付页面失败
        console.log("跳转到支付页面失败" + e.errMsg)
      }
    });
    
  },

  onLoad: function(options) {
    var flag = false; //判断是从哪个页面跳转过来
    var sign = 0 //判断从修改页面中的保存还是删除按钮过来，保存为1，删除为2
    flag = options.flag;
    sign = options.sign;
    /** 
    if (flag) {
      li.push({
        "index": index++,
        "name": options.name,
        "tel": options.tel,
        "addre": options.addre + options.door,
        "area": options.area,
        "image": "../../images/uncheck.png",
        "addrevalue": options.addrevalue,
        "areavalue": options.areavalue,
        "door": options.door
      })
      this.setData({
        list: li
      })
      
    };*/
   /** 
    if (sign == '1') {
      console.log("我是从修改页面过来的" + options.addrevalue)
      li[options.index].name = options.name;
      li[options.index].tel = options.tel;
      li[options.index].addre = options.addre + options.door;
      li[options.index].area = options.area;
      li[options.index].addrevalue = options.addrevalue;
      li[options.index].areavalue = options.areavalue;
      li[options.index].door = options.door;
      this.setData({
        list: li
      })
    };
    if (sign == '2') {
      li.splice(options.index, 1);
      this.setData({
        list: li
      })
    }
    */
    //查询地址列表
    this.searchAddress();
  },
  //查询收货地址
  searchAddress: function() {
    var userId = 1;
    var that = this;
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/address/list?userId=' + userId,
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      data: {},
      success: function(res) {
        console.log("query address success:" + JSON.stringify(res));
        li = res.data.data;
        /** 
        li.map(item => {
          if (item.image1 === null){
            //item.image = "../../images/uncheck.png";
          }else{
            //item.image = "../../images/uncheck.png";
          }
        });
        */
        that.setData({
          list: li
        })
      },
      fail: function(res) {
        console.log("query address fail:" + JSON.stringify(res))
      }
    })
  },

})