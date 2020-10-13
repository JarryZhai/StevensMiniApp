// miniprogram/pages/addhouse/addhouse.js
const app = getApp();
wx.cloud.init({});
const db = wx.cloud.database().collection('house');
const dbmember = wx.cloud.database().collection('member');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '',
    AptHouse: '',
    renttime: '',
    roomtype: '',
    bathroom: '',
    hwxid: '',
    hintro: '',
    hprice: '',
    hlocation1: '',
    hlocation2: '',
    cw : 0,
    ch : 0,
    fileList6: [],
    fileList6temp: [],
    imgID: [],
    cloudPath: [],
    checked: false,
    loading: false,
    date1: '',
    date2: '',
    date1show: false,
    date2show: false,
  },

  onAptHouseChange(event) {
    this.setData({
      AptHouse: event.detail,
    });
  },

  onRentTimeChange(event) {
    this.setData({
      renttime: event.detail,
    });
  },

  onRoomTypeChange(event) {
    this.setData({
      roomtype: event.detail,
    });
  },

  onBathroomChange(event) {
    this.setData({
      bathroom: event.detail,
    });
  },

  onRadioChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onWxidChange(e) {
    this.setData({
      hwxid: e.detail,
    });
  },

  onIntroChange(e) {
    this.setData({
      hintro: e.detail,
    });
  },

  onPriceChange(e) {
    this.setData({
      hprice: e.detail,
    });
  },

  onDate1Display() {
    this.setData({ date1show: true });
  },

  onDate2Display() {
    this.setData({ date2show: true });
  },

  onDateClose() {
    this.setData({ date1show: false, date2show: false });
  },

  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  onDate1Confirm(event) {
    this.setData({
      date1show: false,
      date1: this.formatDate(event.detail),
    });
  },

  onDate2Confirm(event) {
    this.setData({
      date2show: false,
      date2: this.formatDate(event.detail),
    });
  },

  //上传图片
  beforeRead(event) {
    const { file, callback = () => {} } = event.detail;
    if(event.detail.file.size<11000000000){
      callback(true);
    }else{
      wx.showToast({ title: '图片不得超过10M', icon: 'none' });
    }
  },

  afterRead(event) {
    const { file, name } = event.detail;
    console.log(event.detail)
    let that = this
    wx.showLoading({title: '图片压缩中',})
    wx.getImageInfo({
      src: event.detail.file.path,
      success: function (res) {
        var originWidth, originHeight;
        originHeight = res.height;
        originWidth = res.width;
        console.log (originWidth);
        // 压缩比例
        // 最大尺寸限制
        var maxWidth = 100,
            maxHeight = 100;
        // 目标尺寸
        var targetWidth = originWidth,
            targetHeight = originHeight;
        // 等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              console.log('1')
                // 要求宽度*(原生图片比例)=新图片尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round (maxWidth * (originHeight / originWidth));
            } else {
              console.log('2')
                targetHeight = maxHeight;
                targetWidth = Math.round (maxHeight * (originWidth / originHeight));
            }
        }
        // 更新 canvas 大小
        that.setData ({
            cw: targetWidth,
            ch: targetHeight
        });
        console.log('3')
          // 尝试压缩文件，创建 canvas
        var ctx = wx.createCanvasContext ('firstCanvas');
        ctx.clearRect (0, 0, targetWidth, targetHeight);
        ctx.drawImage (event.detail.file.path, 0, 0, targetWidth, targetHeight);
        ctx.draw (false,function (){// 获得新图片输出
          console.log('4')
          setTimeout(() => {
              wx.canvasToTempFilePath({// 文件保存为 JPG 格式
              fileType: 'jpg',
              canvasId: 'firstCanvas',
              success: function(res1) {
                console.log(res1.tempFilePath)
                var myfile={path: res1.tempFilePath} //压缩路径
                wx.showLoading({title: '图片审核中',})
                wx.getFileSystemManager().readFile({
                  filePath: res1.tempFilePath,
                  success: res2 => {
                    console.log('调用imgcheck')
                    wx.cloud.callFunction({
                      // 云函数名称
                      name: 'imgcheck',
                      // 传给云函数的参数
                      data: ({img: res2.data}),
                      success: function (res){
                        console.log(res)
                        if (res.result.errCode == 87014){
                          wx.hideLoading({}),
                          wx.showToast({ title: '图片含违规内容，请更换图片', icon: 'none' });
                        }else{
                          wx.compressImage({
                            src: event.detail.file.path,
                            quality: 40,
                            success: function (res4) {
                              wx.hideLoading({}),
                              wx.showToast({ title: '审核完成，添加成功', icon: 'none' })
                              console.log( event.detail,)
                              that.setData({ 
                                fileList6: that.data.fileList6.concat(file) ,
                                fileList6temp: that.data.fileList6temp.concat({path: res4.tempFilePath})
                              });
                            }
                          })
                        }
                      },
                      fail: err=> {
                        wx.hideLoading({})
                        wx.showToast({ title: '图片审查失败', icon: 'none' });
                        console.log(err);
                      }
                    })
                  },
                  fail: err=> {
                    console.log(err)
                    wx.hideLoading({})
                    wx.showToast({ title: '腾讯服务器错误', icon: 'none' });
                  }
                })
              },
              fail: err=> {
                console.log(err)
                wx.hideLoading({})
              }
            }, this)
          },1000)
        })
      }
    })
  },

  // compresscheck: function（）{

  // },

  delete(event) {
    const { index, name } = event.detail;
    const fileList = this.data[`fileList${name}`];
    const fileListt = this.data[`fileList6temp`];
    fileList.splice(index, 1);fileListt.splice(index, 1);
    this.setData({ [`fileList${name}`]: fileList });
    this.setData({ [`fileList6temp`]: fileListt });
  },

  clickPreview() {},

  uploadToCloud() {
    const { fileList6temp: fileList = [] } = this.data;
    var timestamp = Date.parse(new Date());  
      timestamp = timestamp / 1000;  
      if (this.data.hwxid==''){
        wx.showToast({ title: '请填写微信号', icon: 'none' });
      }else{
        if (this.data.renttime==''){
          wx.showToast({ title: '请选择租期长短', icon: 'none' });
        }else{
          if (!fileList.length) {
            wx.showToast({ title: '请至少添加一张房屋图片', icon: 'none' });
          } else {
            this.setData({loading:"ture"});
            wx.showLoading({title: '正在发布请稍后',})
            const finalname = app.globalData.openid + timestamp
            const uploadTasks = fileList.map((file, index) =>
            this.uploadFilePromise(finalname+`${index}`+'.jpg', file)
            );
            Promise.all(uploadTasks)
            .then(data => {
            // wx.showToast({ title: '上传成功', icon: 'none' });
            wx.hideLoading({})
            wx.showToast({
              title: '发布成功',
              duration: 2000,
            })
            const fileList = data.map(item => ({ url: item.fileID }));
            for(let item in data){
                this.data.imgID[item] = data[item].fileID;
            }
            this.setData({ cloudPath: data});
            this.onClickButton();
            })
            .catch(e => {
            wx.showToast({ title: '由于您的网络问题，发布可能需要更长时间，时间过长请重试', icon: 'none' });
            console.log(e);
            this.data.loading=false;
            });
          }
        }
      }
  },

  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.path,
    });
  },


  onClickButton: function (e) {    
    let that = this;
    var timestamp = Date.parse(new Date());  
      timestamp = timestamp / 1000; 
    console.log();
      db.add({      //db之前宏定义的 在这里指数据库中的Room表； add指 插入
        data: {          // data 字段表示需新增的 JSON 数据       
          AptHouse: this.data.AptHouse,    //将我们获取到的Rname1的value值给Room表中的Rname
          renttime: this.data.renttime,
          roomtype: this.data.roomtype,
          bathroom: this.data.bathroom,
          hprice: this.data.hprice,
          hwxid: this.data.hwxid,
          date1: this.data.date1,
          date2: this.data.date2,
          imgID: this.data.imgID,
          hintro: this.data.hintro,
          hlocation1: this.data.hlocation1,
          hlocation2: this.data.hlocation2,
          createTime: timestamp,
        },          
        success: function (res) {
          console.log("上传成功", res)  
          
          wx.navigateBack({
            complete: (res) => {},
          })
        },
      })  
      
  },

  //定位信息
  onLocationChange(event) {
    this.setData({ checked: event.detail });
    if(this.data.checked){
      var self = this
      wx.chooseLocation({
        type: 'wgs84',
        success (res) {
          const latitude = res.latitudeh
          const longitude = res.longitude
          self.setData({ hlocation1: res.latitude, hlocation2: res.longitude });
        }
       })
    }
  },

  onClickLeft:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  checkid: function(){
    dbmember.where({_openid: app.globalData.openid}).get({
      success: res=>{
        console.log(res)
        this.setData({
          hwxid: res.data[0].wxid,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkid()
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
      title: '【教职工信息直接查询】更多新功能上线！',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/hot/hot'
    }
  }
})