// miniprogram/pages/myhouse/myhouse.js
wx.cloud.init({});
const db = wx.cloud.database().collection('house');
const dbs = wx.cloud.database()
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    houselist: [],
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

  onDelete: function(e) {
    var that = this;
    let src=e.currentTarget.dataset.src;
    let imgid=e.currentTarget.dataset.imgid;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: "removehouse",
            data: {
              _id: src,
            },
            success: res => {
              console.log(src)
              console.log('[云函数] [deleteBook] 删除成功！！ ', res)
              wx.cloud.deleteFile({
                fileList: imgid
              }).then(res => {
                console.log(res.fileList),
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功',
                })
                that.searchMine();
              }).catch(error => {
              })
            },
            fail: err => {
              console.error('[云函数] [deleteBook] 调用失败', err)
            }
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  onClickLeft:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  searchMine: function () {
    wx.showLoading({
      title: '正在刷新',
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.data.openid = res.result.openid
        console.log('[云函数] [login] user openid: ', this.data.openid)
    db.where({ _openid: res.result.openid}).orderBy('createTime','desc').get({
        success: res=>{
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res)
          this.setData({
            houselist: res.data
          })
        },
         fail: err => {
           wx.showToast({
             icon: 'none',
             title: '查询记录失败'
           })
           console.error('[数据库] [查询记录] 失败：', err)
         }
    })
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
          title: '登录成功'
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
    this.searchMine();
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
    this.searchMine();
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
      title: '【实时疫情】【教职工信息】【我的课表】【中文校历】【校园地图】',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/house/house'
    }
  }
  
})