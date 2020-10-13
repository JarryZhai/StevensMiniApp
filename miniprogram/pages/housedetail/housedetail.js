// miniprogram/pages/housedetail/housedetail.js
wx.cloud.init({});
const db = wx.cloud.database().collection('house');
const dbs = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseid: '',
    detaillist: [],
    swiperIdx: 0,
    mergeValue: 0,
    imgdone: 0,
    shareimg: '',
    AptHousejs: ['公寓','别墅'],
    renttimejs: ['短租','长租'],
    roomtypejs: ['主卧','次卧','客厅','其他房型'],
    bathroomjs: ['独立卫浴','2人公用卫浴','3人公用卫浴','4人+公用卫浴'],
  },

  bindchange(e) {
    this.setData({
      swiperIdx: e.detail.current
    })
  },

    //搜索
    searchID: function () {
      db.where({_id:this.data.houseid}).get({
      // wx.cloud.callFunction({
      //   name: 'housedetail', //短租
      //   data: {
      //     a:this.data.houseid,
      //   },
        success: res => {
          console.log(res)
          this.setData({
            detaillist: res.data
          }, function() {
            if(this.data.detaillist[0].imgID.length>3){
              this.mergeImg4()
            }else if(this.data.detaillist[0].imgID.length>1){
              this.mergeImg2()
            }else{
              this.setData({shareimg: this.data.detaillist[0].imgID[0], imgdone: 1})
            }
          })
        }
      })
    },

    onClickLeft:function(){
      wx.switchTab({
        url: '/pages/house/house',
      })
    },

    copyText: function (e) {
      console.log(e)
      wx.setClipboardData({
        data: this.data.detaillist[0].hwxid,
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

    checkMap: function(){
      if(this.data.detaillist[0].hlocation1==''){
        wx.showToast({
          title: '发布者没有提供',
          icon: 'none'
        })
      }
          wx.openLocation({
            longitude: Number(this.data.detaillist[0].hlocation2),
            latitude: Number(this.data.detaillist[0].hlocation1),
            name: '房屋地址',
            address: '点击导航可以调用Google Maps',
            scale: 18
          })

    },

    previewimg:function(){
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: this.data.detaillist[0].imgID // =============重点重点=============
      })
    },

    mergeImg4: function(){
      let that = this
      const ctx = wx.createCanvasContext("firstCanvas")
      var count = 0
      for(var i = 0; i < 4; i++){
        let x = parseInt(i%2)
        let y = parseInt(i/2)
        wx.getImageInfo({
          src: that.data.detaillist[0].imgID[i],
          success: function(res) {
            // 根据 图片的大小 绘制底图 的大小
            console.log(res.path, x, y,count)
            let imgPath = res.path
            ctx.drawImage(imgPath, x*188, y*150, 188, 150)
            count++;
            that.setData({mergeValue: Math.round(count/4*100)})
            if(count==4){
              ctx.draw(true, function() {
                wx.canvasToTempFilePath({// 文件保存为 JPG 格式
                  fileType: 'jpg',
                  canvasId: 'firstCanvas',
                  success: function (res) {
                    console.log(res.tempFilePath)
                    that.setData({
                      imgdone:1, 
                      shareimg: res.tempFilePath,
                    })
                  }
                })
              })
            }
          }
        })
      }
    },

    mergeImg2: function(){
      let that = this
      const ctx = wx.createCanvasContext("firstCanvas")
      var count = 0
      for(var i = 0; i < 2; i++){
        let y = parseInt(i%2)
        wx.getImageInfo({
          src: that.data.detaillist[0].imgID[i],
          success: function(res) {
            // 根据 图片的大小 绘制底图 的大小
            console.log(res.path, y,count)
            let imgPath = res.path
            ctx.drawImage(imgPath, 0, y*150, 375, 150)
            count++;
            that.setData({mergeValue: Math.round(count/2*100)})
            if(count==2){
              ctx.draw(true, function() {
                wx.canvasToTempFilePath({// 文件保存为 JPG 格式
                  fileType: 'jpg',
                  canvasId: 'firstCanvas',
                  success: function (res) {
                    console.log(res.tempFilePath)
                    that.setData({
                      imgdone:1, 
                      shareimg: res.tempFilePath,
                    })
                  }
                })
              })
            }
          }
        })
      }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.share){
      var da = decodeURIComponent(options.share);
      var car = JSON.parse(da);
      this.data.houseid = car;
      this.searchID();
    }else{
      this.data.houseid = options.share;
      this.searchID();
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
    var that = this;
    var json = encodeURIComponent(JSON.stringify(this.data.detaillist[0]._id));
    if(this.data.houselist!=''){
      return{
        　　　　title: "【"+this.data.renttimejs[this.data.detaillist[0].renttime] + this.data.AptHousejs[this.data.detaillist[0].AptHouse] + this.data.roomtypejs[this.data.detaillist[0].roomtype]+"】"+this.data.detaillist[0].hprice+"/月"+"\t"+this.data.detaillist[0].date1+"起租【点击查看详情】",        // 默认是小程序的名称(可以写slogan等)
        　　　　path: '/pages/housedetail/housedetail?share='+json,        // 默认是当前页面，必须是以‘/’开头的完整路径
        　　　　imageUrl: this.data.shareimg,     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        　　　　success: function(res){
        　　　　　　// 转发成功之后的回调
        　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
        　　　　　　}
        　　　　},
        　　　　fail: function(){
        　　　　　　// 转发失败之后的回调
        　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
        　　　　　　　　// 用户取消转发
        　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
        　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
        　　　　　　}
        　　　　},
        　　}
    }else{
      return {
        title: '【Stevens二手平台】一键生成闲置列表，自动更新，买卖搜索都方便',
        imageUrl: '../../images/moneybag.png',
        path: '/pages/index/index'
      }
    }
    console.log(this.data.openid)
    console.log(json)
　　// 设置菜单中的转发按钮触发转发事件时的转发内容
　　
　　// 来自页面内的按钮的转发
// 　　if( options.from == 'button' ){
// 　　　　var eData = options.target.dataset;
// 　　　　console.log( eData.id);     // shareBtn
// 　　　　// 此处可以修改 shareObj 中的内容
// 　　　　shareObj.path = '/pages/goods/goods?goodId='+eData.id;
// 　　};
// 　　// 返回shareObj
// 　　return shareObj;
  },
})