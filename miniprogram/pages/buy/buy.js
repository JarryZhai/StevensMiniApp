// miniprogram/pages/buy/buy.js
wx.cloud.init({});
const db = wx.cloud.database().collection('useditems');
const dbs = wx.cloud.database()
const app = getApp()
let interstitialAd = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemslist: [],
    openid: '',
    deliver: ['送货', '自取', '送货/自取'],
    category: ['电脑/显示器','手机/平板','家具','厨房用品','生活用品','其他'],
    textValue: '',
    value: '',
    max: 6,
    loading: 0,
    search: 0
  },


  //搜索输入
  txtChange(e) {
    this.setData({
      value: e.detail
    });
  },

  onCancel(e){},

  // 显示全部
  searchAll: function () {
    db.orderBy('createTime','desc').limit(this.data.max).get({
      success: res => {
        console.log(res),
        this.setData({
          search: 0,
          loading: 0,
          itemslist: res.data,
          value: ''
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

  // 显示免费
  searchFree: function () {
    db.where({iprice:'0'}).orderBy('createTime','desc').get({
      success: res => {
        console.log(res),
        wx.showToast({
          title: '已显示最新20个免费物品',
          icon: 'none'
        })
        this.setData({
          search: 1,
          loading: 2,
          itemslist: res.data,
          value: ''
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

  // // 显示更多
  searchMore: function () {
    if(this.data.search==0){
      db.orderBy('createTime','desc').skip(this.data.itemslist.length).limit(this.data.max).get({
        success: res => {
          console.log(res),
          this.setData({
            itemslist: this.data.itemslist.concat(res.data) ,
            loading: 0
          })
          if(res.data.length==0){
            wx.showToast({
              title: '到底啦',
              icon: 'none'
            })
            this.setData({loading: 2})
          }
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
    }
  },


  //搜索
  onSearch: function () {
    console.log(this.data.value);
    const _ = wx.cloud.database().command;
    if (!this.data.value) {
      wx.showToast({
        icon: 'none',
        title: '请输入搜索内容',
        duration: 2000,
      })
    } 
    else{
      db.where(_.or([{
        iname: dbs.RegExp({
          regexp: '.*' + this.data.value,
          options: 'i',
        })
      },])).orderBy('createTime','desc').get({
        success: res => {
        console.log(res)
        if(res.data.length==0){
          wx.showToast({
            title: '没找到',
            icon: 'none'
          })
        }else{
          this.setData({
            search: 1,
            loading: 2,
            itemslist: res.data,
          })
        }
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '没找到',
          duration: 2000,
        })
      },
    })
    }
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
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // =============重点重点=============
    })
  },

  //获取用户openid
  onGetOpenid: function() {
    // 调用云函数
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '/pages/additem/additem',
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
    this.searchAll()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 1
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
    this.searchAll();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },500);
    wx.showToast({
      title: '刷新中',
      icon: 'none'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.searchMore()
    if(this.data.search==0){
      this.setData({loading: 1})
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '【闲置物品交易】卖得高效，找得方便',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/buy/buy'
    }
  },
})