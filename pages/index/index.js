//index.js
//获取应用实例
var app = getApp()
const imgUrl ="http://www.binzhoushi.xyz/wx";
Page({
  // activeIndex 是当前播放图片的下标
  data: {
    activeIndex: 0, // 标记轮播到哪个图片
    scrollXList: [], // 滚动的商品列表
    goodsSorts: [], // 商品的十种分类   用于获取商品分类信息，显示在页面上
    //2018.6.18
    httpURL: "",
    goodclassify: ["生鲜果蔬", "粮油干货", "地方特产", "名茶名酒", "进口食品"],
    goodclassifyimg: [
      imgUrl+"/image/dining-table-header.jpg",
      imgUrl +"/image/grain-dry-cargo-header.jpg",
      imgUrl +"/image/local-specialty-header.jpg",
      imgUrl +"/image/tea-tobacco-header.jpg",
      imgUrl +"/image/imported-food-header.jpg"
    ],
    friut: [{
        "name": "菜心 2kg",
        "pic": imgUrl +"/image/dining-1.jpg",
        "price": "￥8.9",
        "id":1
      },
      {
        "name": "羊肉卷",
        "pic": imgUrl +"/image/dining-18.jpg",
        "price": "￥21.98",
        "id": 2
      },
      {
        "name": "安迪山苹果",
        "pic": imgUrl +"/image/dining-3.jpg",
        "price": "￥8.9",
        "id": 3
      }
    ],
    grain: [{
        "name": "有机石板米",
        "pic": imgUrl +"/image/grain-1.jpg",
        "price": "￥188.0",
        "id": 1
      },
      {
        "name": "长寿花金胚玉米油",
        "pic": imgUrl +"/image/grain-16.jpg",
        "price": "￥208.0",
        "id": 1
      },
      {
        "name": "龙稻稻花香大米",
        "pic": imgUrl +"/image/grain-23.jpg",
        "price": "￥96.0",
        "id": 1
      }
    ],
    local: [{
        "name": "振豫臻品腐竹",
        "pic": imgUrl +"/image/local-1.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "原味丹堤腰果",
        "pic": imgUrl +"/image/local-2.jpg",
        "price": "￥398.0",
        "id": 1
      },
      {
        "name": "精选陕北红枣",
        "pic": imgUrl +"/image/local-3.jpg",
        "price": "￥83.0",
        "id": 1
      }
    ],
    teawine: [{
        "name": "韩国清河清酒",
        "pic": imgUrl +"/image/tea-2.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "特级明前茶",
        "pic": imgUrl +"/image/tea-3.jpg",
        "price": "￥398.0",
        "id": 1
      },
      {
        "name": "欢沁桃红葡萄酒",
        "pic": imgUrl +"/image/tea-4.jpg",
        "price": "￥83.0",
        "id": 1
      },
      {
        "name": "普洱迷你小沱茶",
        "pic": imgUrl +"/image/tea-5.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "忆江南龙井",
        "pic": imgUrl +"/image/tea-6.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "欢沁桃红葡萄酒",
        "pic": imgUrl +"/image/tea-7.jpg",
        "price": "￥82.0",
        "id": 1
      }
    ],
    imported: [{
        "name": "泰国金枕头榴莲",
        "pic": imgUrl +"/image/imported-1.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "爱伦蒂全脂纯牛奶",
        "pic": imgUrl +"/image/imported-2.jpg",
        "price": "￥398.0",
        "id": 1
      },
      {
        "name": "澳洲混合桉树蜂蜜",
        "pic": imgUrl +"/image/imported-3.jpg",
        "price": "￥83.0",
        "id": 1
      },
      {
        "name": "马来西亚白咖啡",
        "pic": imgUrl +"/image/imported-4.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "越南白心火龙果 ",
        "pic": imgUrl +"/image/imported-6.jpg",
        "price": "￥82.0",
        "id": 1
      },
      {
        "name": "西班牙特级橄榄油",
        "pic": imgUrl +"/image/imported-39.jpg",
        "price": "￥82.0",
        "id": 1
      }
    ]
  },
  scan: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  // 点击不同的小圆点切换不同的图片
  changeTag: function(e) {
    var type = e.target.dataset.index;
    this.setData({
      activeIndex: type
    });
  },
  // 滑动切换图片，获取点击的下标，改变相应小圆点的状态
  swiperTab: function(e) {
    var type = e.detail.current;
    this.setData({
      activeIndex: type
    });
  },
  chooseAddr: function() {
    wx.navigateTo({
      url: "../chooseAddress/chooseAddress"
    })
  },
  linkToList: function(e) {
    // console.log(e.currentTarget.id);
    // 将用户点击的分类保存在全局变量中，用于页面跳转后的商品显示
    app.globalData.goodsSortsChoice = e.currentTarget.id;
    // console.log(app.globalData.goodsSortsChoice);
    /** 
    wx.navigateTo({
      url: "../goodsList/goodsList"
    })
    */
    wx.navigateTo({
      url: "/pages/classification/index"
    });
  },
  //事件处理函数
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },

  addInCart: function(e) {
    console.log(e);
    const good = this.data.scrollXList[e.currentTarget.id]; // 根据index，判断用户点击了哪个商品加入购物车
    const cart = app.globalData.cardList; // 获取购物车列表
    // 设置一个标记，判断用户想加入购物车的商品是否已经存在购物车了
    // some 是es6新增的方法，用于遍历整个数组，如果数组中存在一个及以上元素，就返回true
    var flag = false;
    flag = cart.some((item) => {
      return item === good;
    })
    console.log(flag);
    // 如果购物车中没有该元素，就将该商品加入购物车，否则就将该商品的购买数量加一
    if (!flag) {
      //调用DB添加购物车
      this.addCard(e);

      cart.push(good); // 用户选择商品加入购物车后，将该商品加入购物车列表
      wx.showToast({
        title: '商品已加入购物车',
        icon: 'success',
        duration: 2000
      })
    } else {
      //调用DB修改购物车数量
      this.updateCartNumber(e);

      this.data.scrollXList[e.currentTarget.id].count++;
    }
  },


  //首次点击添加到购物车
  addCard: function(e) {
    var requestData = {
      'userId': 1,
      'shopId': 1,
      'productId': e.currentTarget.id,
      'number': 1
    };
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/cart/saveSelective',
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: requestData,
      success: function(res) {
        console.log("add cart success:" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("add cart fail:" + JSON.stringify(res))
      },
      complete: function(res) {},
    })

  },
  //修改购物数量和总价格
  updateCartNumber: function(e) {
    var requestData = {
      'productId': e.currentTarget.id,
      'userId':1
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
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function() {
    wx.request({
      url: "https://www.easy-mock.com/mock/5a223b51707056548f086d8b/hema/getIndexScrollX",
      success: (res) => {
        // console.log(res.data);
        this.setData({
          scrollXList: res.data.data.goods
        })
        // console.log(res.data.data.goods);
      }
    })
    /** 
    wx.request({
      url: app.globalData.domain +'/category/all',
      success: (res) => {
        console.log(res.data.data);
        this.setData({
          goodsSorts: res.data.data
        })
      }
    })
    */
   
    var goodsSortsTmp = [];
    if (app.globalData.categories!=null&&app.globalData.categories.length>0){
      for (var i = 0; i < app.globalData.categories.length;i++){
          if (app.globalData.categories[i].ifShow==1){
            goodsSortsTmp.push(app.globalData.categories[i]);
          }
      }
    }

    this.setData({
      goodsSorts: goodsSortsTmp
    })
    
    //初始化商品列表
    //this.searchProductList();
  },

  getUserInfo: function(e) {

  },
  //跳转到goodsdetail
  itemclick: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + id
    })
  },
  //查询商品列表
  searchProductList: function () {
    var that = this;
    wx.request({
      url: 'http://www.binzhoushi.xyz/zhy/product/list',
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      data: {},
      success: function (res) {
        //console.log("search Product success:" + JSON.stringify(res));
        // 页面加载时就显示商品
        that.setData({
          scrollXList: res.data.data
        })
      },
      fail: function (res) {
        console.log("search Product fail:" + JSON.stringify(res))
      }
    })
  },

})