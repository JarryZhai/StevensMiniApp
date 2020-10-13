// miniprogram/pages/smadmin/smadmin.js
wx.cloud.init({});
const db = wx.cloud.database().collection('member');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist: ''
  },

  searchAll: function(){
    db.where({ SM10 : 1 }).orderBy('SMtime','desc').get({
      success: res=>{
        console.log(res)
        this.setData({
          orderlist: res.data
        })
      },
      fail: err => {
       console.error('[数据库] [查询记录] 失败：', err)
     }
    })
  },

  SMyes: function(event){
    let _id=event.currentTarget.dataset.id
    let _openid=event.currentTarget.dataset.openid
    db.doc(_id).update({
      data: {
        SM10: 2
      },
      success: res => {
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '成功'
        })
        this.searchAll()
        wx.cloud.callFunction({
          name: "sendsm",
          data: {
            openid: _openid,
            result: '审核成功'
          },
          success: res => {
            console.log('[云函数] 发送通知！！ ', res)
          },
          fail: err => {
            console.error('[云函数] 调用失败', err)
          }
        })
      }
    })
  },

  SMno: function(event){
    let _id=event.currentTarget.dataset.id
    let _openid=event.currentTarget.dataset.openid
    db.doc(_id).update({
      data: {
        SM10: 3
      },
      success: res => {
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '失败'
        })
        this.searchAll()
        wx.cloud.callFunction({
          name: "sendsm",
          data: {
            openid: _openid,
            result: '审核失败'
          },
          success: res => {
            console.log('[云函数] 发送通知！！ ', res)
          },
          fail: err => {
            console.error('[云函数] 调用失败', err)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchAll()
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
    this.searchAll();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },1000);
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
      title: '更多功能上线！【教职工信息】【我的课表】【中文校历】【校园地图】',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/hot/hot'
    }
  }
})