// miniprogram/pages/share/share.js
wx.cloud.init({});
const db = wx.cloud.database().collection('useditems');
const dbs = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemslist: [],
    openid: '',
    deliver: ['送货', '自取', '送货/自取'],
    category: ['电脑/显示器','手机/平板','家具','厨房用品','生活用品','其他'],
    itemslist: [],
    value: '',
    sharedID: '',
  },


  //搜索
  searchID: function () {
    wx.cloud.callFunction({
      name: "searchAllItem",
      data: {
        ID: this.data.sharedID,
      },
      success: res => {
        console.log(res)
        this.setData({itemslist: res.result.data})
      },
      fail: err => {
        wx.showToast({
        icon: 'none',
        title: '查询记录失败'
        })
      }
    })
    // db.where({ _openid: this.data.sharedID}).get({
    //   success: res=>{
    //     console.log(res)
    //     this.setData({
    //     itemslist: res.data.reverse()
    //     })
    //   },
    //   fail: err => {
    //     wx.showToast({
    //     icon: 'none',
    //     title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })
  },

  //复制微信号
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
      urls: [src] // =============重点重点=============
    })
  },

  onClickLeft:function(){
    wx.switchTab({
      url: '/pages/buy/buy',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.share){
      var da = decodeURIComponent(options.share);
      var car = JSON.parse(da);
      this.data.sharedID = car;
      this.searchID();
    }else{
      wx.switchTab({
        url: '/pages/hot/hot',
      })
    }
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
    return {
      title: '【实时疫情】【教职工信息】【我的课表】【中文校历】【校园地图】',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/hot/hot'
    }
  }
})