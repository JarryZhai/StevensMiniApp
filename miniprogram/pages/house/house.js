// miniprogram/pages/house/house.js
wx.cloud.init({});
const db = wx.cloud.database().collection('house');
const dbs = wx.cloud.database()
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shorthouselist: [],
    longhouselist: [],
    openid: '',
    AptHousejs: ['公寓','别墅'],
    renttimejs: ['短租','长租'],
    roomtypejs: ['主卧','次卧','客厅','其他房型'],
    bathroomjs: ['独立卫浴','2人公用卫浴','3人公用卫浴','4人+公用卫浴'],
    AptHousese: [
      { text: '公寓+别墅', value: '10' },
      { text: '公寓', value: '0' },
      { text: '别墅', value: '1' },
    ],
    roomtypese: [
      { text: '不限', value: '10' },
      { text: '主卧', value: '0' },
      { text: '次卧', value: '1' },
      { text: '客厅', value: '2' },
      { text: '其他房型', value: '3' },
    ],
    bathroomse: [
      { text: '不限', value: '10' },
      { text: '独立卫浴', value: '0' },
      { text: '2人公用卫浴', value: '1' },
      { text: '3人公用卫浴', value: '2' },
      { text: '4人+公用卫浴', value: '3' },
    ],
    AptHousev: '10',
    roomtypev: '10',
    bathroomv: '10',
    active: 0,
    max: 7,
    loading: 0
  },

  onTabChange(event) {
    this.setData({
      active: event.detail.name,
      loading: 0
    })
  },

  doSearch: function () {
    db.where({renttime: '0'}).orderBy('createTime','desc').limit(this.data.max).get({
      success: res => {
        console.log(res),
        this.setData({
          shorthouselist: res.data
        })
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      },
    })

    db.where({renttime: '1'}).orderBy('createTime','desc').limit(this.data.max).get({
      success: res => {
        console.log(res),
        this.setData({
          longhouselist: res.data
        })
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      },
    })
  },

  searchMoreShort: function () {
    db.where({renttime: '0'}).orderBy('createTime','desc').skip(this.data.shorthouselist.length).limit(this.data.max).get({
      success: res => {
        if(res.data.length==0){
          wx.showToast({
            title: '到底啦',
            icon: 'none'
          })
          this.setData({loading: 2})
        }else{
          this.setData({
          shorthouselist: this.data.shorthouselist.concat(res.data) ,
          loading: 0
        })
        }
        console.log(res)
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '没有更多啦',
          icon: 'none'
        })
        this.setData({loading: 2})
      },
    })
  },

  searchMoreLong: function () {
    db.where({renttime: '1'}).orderBy('createTime','desc').skip(this.data.longhouselist.length).limit(this.data.max).get({
      success: res => {
        console.log(res)
        if(res.data.length==0){
          wx.showToast({
            title: '到底啦',
            icon: 'none'
          })
          this.setData({loading: 2})
        }else{
          this.setData({
          longhouselist: this.data.longhouselist.concat(res.data) ,
          loading: 0
        })
        }
        console.log(res)
      },
      fail: err => {con
        console.log(err)
        wx.showToast({
          title: '没有更多啦',
          icon: 'none'
        })
        this.setData({loading: 2})
      },
    })
  },

  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  //预览图片
  previewImage:function(e){
    let that = this;
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src[0]] // =============重点重点=============
    })
  },

  //获取用户openid
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.showToast({
        //   title: '加载中',
        //   icon: 'loading'
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        
      }
    })
  },

  onDetail: function (e) {
    var that = this;
    var json = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.src));
    wx.navigateTo({
      url: '/pages/housedetail/housedetail?share=' + json,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.doSearch();
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
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      active: 2
    })
    }
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
    this.doSearch();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },400);
    wx.showToast({
      title: '刷新中',
      icon: 'none'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({loading: 1})
    if(this.data.active==0){
      this.searchMoreLong()
    }else{
      this.searchMoreShort()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '【转租信息】长短租分类，动态展示页面，专属页面分享',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/house/house'
    }
  }
})