// miniprogram/pages/mine/mine.js
wx.cloud.init({});
const db = wx.cloud.database().collection('useditems');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showabout: false,
    showadv: false,
    showupdate: false,
    showrule: false,
    web: false,
    groupUrl: ['https://s1.ax1x.com/2020/07/11/UQ2FDs.jpg'],
    appId: "wx8abaf00ee8c3202e",
        extraData : {
            // 把1221数字换成你的产品ID，否则会跳到别的产品
            id : "164851",
            // 自定义参数，具体参考文档
            customData : {
                clientInfo: `iPhone OS 10.3.1 / 3.2.0.43 / 0`,
                imei: '7280BECE2FC29544172A2B858E9E90D0'
            }
        },
  },

  showAboutPopup() {
    this.setData({ showabout: true });
  },

  showAdvPopup() {
    this.setData({ showadv: true });
  },

  showUpdatePopup() {
    this.setData({ showupdate: true });
  },

  showRulePopup() {
    this.setData({ showrule: true });
  },

  openGroup: function(){
    var groupUrl = this.data.groupUrl;
    wx.previewImage({
      urls: groupUrl, //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
    })
  },

  onClose() {
    this.setData({ showabout: false, showadv: false, showupdate:false, showrule: false });
  },

  openweb: function(){
    wx.navigateTo({
      url: '/pages/code/code',
    })
    this.setData({showadv: false})
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
        wx.showToast({
          title: '加载中',
          icon: 'loading'
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      active: 3
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
      title: '【大都会博物馆藏品】实时刷新，更多新功能上线！',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/hot/hot'
    }
  }
})