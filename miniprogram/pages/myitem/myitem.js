// miniprogram/pages/myitem/myitem.js
wx.cloud.init({});
const db = wx.cloud.database().collection('useditems');
const dbm = wx.cloud.database().collection('member');
const dbs = wx.cloud.database()
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemslist: [],
    openid: '',
    shareimg: '',
    imgdone: 0,
    mergeValue: 0,
    memberinfo: '',
    deliver: ['送货', '自取', '送货/自取'],
    category: ['电脑/显示器','手机/平板','家具','厨房用品','生活用品','其他'],
  },

  memberInfo: function(){
    dbm.where({ _openid: app.globalData.openid}).get({
      success: res=>{
        console.log('刷新用户信息')
        this.setData({
          memberinfo: res.data,
        })
      }
    })
  },

  renew: function(e){
    let that = this
    let id = e.currentTarget.dataset.src;
    let openid = e.currentTarget.dataset.openid;
    var timestamp = Date.parse(new Date())/1000; 
    if(this.data.memberinfo[0].renewitemcard==0){
      wx.showToast({
        title: '你还没有擦亮卡喔',
        icon: 'none'
      })
    }else{
      console.log(id,openid,timestamp)
      db.doc(id).update({
        data: {
          createTime: timestamp,
        },
        success: function(res) {
          wx.showToast({
            title: '擦亮成功'
          })
          that.useRenewCard(openid)
        }
      })
    }
  },

  useRenewCard: function(openid){
    let that = this
    console.log(this.data.memberinfo[0].renewitemcard-1)
    dbm.doc(this.data.memberinfo[0]._id).update({
      data: {
        renewitemcard: that.data.memberinfo[0].renewitemcard-1,
      },
      success: function(res) {
        that.memberInfo()
        that.searchMine()
      }
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
            name: "removeitem",
            data: {
              _id: src,
            },
            success: res => {
              console.log(src)
              console.log('[云函数] [deleteBook] 删除成功！！ ', res)
              wx.cloud.deleteFile({
                fileList: [imgid]
              }).then(res => {
                console.log(res.fileList)
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
        wx.cloud.callFunction({
          name: "searchAllItem",
          data: {
            ID: res.result.openid,
          },
          success: res => {
            console.log(res)
            wx.hideLoading({
              success: (res) => {},
            })
            this.setData({itemslist: res.result.data}, function() {
              if(this.data.itemslist.length>11){
                this.mergeImg12()
              }else if(this.data.itemslist.length>8){
                this.mergeImg9()
              }else if(this.data.itemslist.length>5){
                this.mergeImg6()
              }else if(this.data.itemslist.length>3){
                this.mergeImg4()
              }else if(this.data.itemslist.length>1){
                this.mergeImg2()
              }else {
                this.setData({shareimg: this.data.itemslist[0].imgID, imgdone: 1})
              }
            })
          },
          fail: err => {
            wx.showToast({
            icon: 'none',
            title: '查询记录失败'
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err) 
      }
    })
  },

  // 拼图
  mergeImg2: function(){
    let that = this
    const ctx = wx.createCanvasContext("firstCanvas")
    var count = 0
    for(var i = 0; i < 2; i++){
      let x = parseInt(i%2)
      wx.getImageInfo({
        src: this.data.itemslist[i].imgID,
        success: function(res) {
          // 根据 图片的大小 绘制底图 的大小
          console.log(res.path, x,count)
          let imgW = res.width
          let imgH = res.height
          let imgPath = res.path
          // 绘制底图 用原图的宽高比绘制
          // if(imgW>imgH){
          //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
          // }else{
          //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
          // }
          ctx.drawImage(imgPath, x*188, 0, 188, 300)
          count++;
          that.setData({mergeValue: Math.round(count/2*100)})
          console.log(count)
          if(count==2){
            that.draw(ctx)
          }
        }
      })
    }
  },

  mergeImg4: function(){
    let that = this
    const ctx = wx.createCanvasContext("firstCanvas")
    var count = 0
    for(var i = 0; i < 4; i++){
      let x = parseInt(i%2)
      let y = parseInt(i/2)
      wx.getImageInfo({
        src: this.data.itemslist[i].imgID,
        success: function(res) {
          // 根据 图片的大小 绘制底图 的大小
          console.log(res.path, x, y,count)
          let imgW = res.width
          let imgH = res.height
          let imgPath = res.path
          // 绘制底图 用原图的宽高比绘制
          // if(imgW>imgH){
          //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
          // }else{
          //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
          // }
          ctx.drawImage(imgPath, x*188, y*150, 188, 150)
          count++;
          that.setData({mergeValue: Math.round(count/4*100)})
          console.log(count)
          if(count==4){
            that.draw(ctx)
          }
        }
      })
    }
  },

  mergeImg6: function(){
    let that = this
    const ctx = wx.createCanvasContext("firstCanvas")
    var count = 0
    for(var i = 0; i < 6; i++){
      let x = parseInt(i%3)
      let y = parseInt(i/2)
      wx.getImageInfo({
        src: this.data.itemslist[i].imgID,
        success: function(res) {
          // 根据 图片的大小 绘制底图 的大小
          console.log(res.path, x, y,count)
          let imgW = res.width
          let imgH = res.height
          let imgPath = res.path
          // 绘制底图 用原图的宽高比绘制
          // if(imgW>imgH){
          //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
          // }else{
          //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
          // }
          ctx.drawImage(imgPath, x*125, y*150, 125, 150)
          count++;
          that.setData({mergeValue: Math.round(count/6*100)})
          console.log(count)
          if(count==6){
            that.draw(ctx)
          }
        }
      })
    }
  },

  mergeImg9: function(){
    let that = this
      const ctx = wx.createCanvasContext("firstCanvas")
      var count = 0
      for(var i = 0; i < 9; i++){
        let x = parseInt(i%3)
        let y = parseInt(i/3)
        wx.getImageInfo({
          src: this.data.itemslist[i].imgID,
          success: function(res) {
            // 根据 图片的大小 绘制底图 的大小
            console.log(res.path, x, y,count)
            let imgW = res.width
            let imgH = res.height
            let imgPath = res.path
            // 绘制底图 用原图的宽高比绘制
            // if(imgW>imgH){
            //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
            // }else{
            //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
            // }
            ctx.drawImage(imgPath, x*125, y*100, 125, 100)
            count++;
            that.setData({mergeValue: Math.round(count/9*100)})
            console.log(count)
            if(count==9){
              that.draw(ctx)
            }
          }
        })
      }
  },

  mergeImg12: function(){
      let that = this
      const ctx = wx.createCanvasContext("firstCanvas")
      var count = 0
      for(var i = 0; i < Math.min(this.data.itemslist.length,12); i++){
        let x = parseInt(i%4)
        let y = parseInt(i/4)
        wx.getImageInfo({
          src: this.data.itemslist[i].imgID,
          success: function(res) {
            // 根据 图片的大小 绘制底图 的大小
            console.log(res.path, x, y,count)
            let imgW = res.width
            let imgH = res.height
            let imgPath = res.path
            // 绘制底图 用原图的宽高比绘制
            // if(imgW>imgH){
            //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
            // }else{
            //   ctx.drawImage(imgPath, i%3*125, i/3*100, 125, 100)
            // }
            count++;
            ctx.drawImage(imgPath, x*94, y*100, 94, 100)
            that.setData({mergeValue: Math.round(count/12*100)})
            console.log(count)
            if(count==12){
              that.draw(ctx)
            }
          }
        })
      }
  },

  draw: function(ctx){
    let that = this
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
          wx.showToast({
            title: '分享卡片已生成',
            icon: 'none'
          })
        }
      })
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
    this.memberInfo()
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
      wx.showToast({
        title: '刷新中',
        icon: 'none'
      })
    },300);
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
    var json = encodeURIComponent(JSON.stringify(this.data.openid));

    if(this.data.itemslist!=''){
      return{
        　　　　title: this.data.itemslist[0].iname+"仅需【"+this.data.itemslist[0].iprice+"】刀，闲置低至【免费】，点击搜索",        // 默认是小程序的名称(可以写slogan等)
        　　　　path: '/pages/share/share?share='+json,        // 默认是当前页面，必须是以‘/’开头的完整路径
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
  }
  
})