// miniprogram/pages/additem/additem.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();
wx.cloud.init({});
const db = wx.cloud.database().collection('useditems');
const dbmember = wx.cloud.database().collection('member');
const dbs = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliver: ['送货', '自取', '送货自取均可'],
    deliverv: '',
    delivershow: false,
    iname: '',
    iaddress: '',
    ilocation1: '',
    ilocation2: '',
    iwxid: '',
    iintro: '',
    iprice: '',
    ideliver: '',
    icategory: '',
    fileList6: [],
    imgID: '',
    cloudPath: [],
    checked: false,
    loading: false,
    radio: 'radio1',
    cw : 0,
    ch : 0,
    compressed: '',
    i_id: ''
  },

  onRadioChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onNameChange(e) {
    this.setData({
      iname: e.detail,
    });
  },

  onAddressChange(e) {
    this.setData({
      iaddress: e.detail,
    });
  },

  onWxidChange(e) {
    this.setData({
      iwxid: e.detail,
    });
  },

  onIntroChange(e) {
    this.setData({
      iintro: e.detail,
    });
  },

  onPriceChange(e) {
    this.setData({
      iprice: e.detail,
    });

  },

  onDeliverChange(event) {
    const {value, index } = event.detail;
    Toast(`value：${value}, index：${index}`);
    this.setData({
      deliverv: event.detail,
      ideliver: this.data.deliver[event.detail],
    });
    dbmember.doc(this.data.i_id).update({
      data: {
        wxid: this.data.iwxid,
        address: this.data.iaddress,
        itemdeliver: event.detail
      },
      complete:res=>{
        console.log(res)
      }
    })
  },

  // onCategoryChange(event) {
  //   const {value, index } = event.detail;
  //   Toast(`value：${value}, index：${index}`);
  //   this.setData({
  //     icategory: value,
  //   });
  // },

  onLocationChange(event) {
    this.setData({ checked: event.detail });
    if(this.data.checked){
      var self = this
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          self.setData({ ilocation1: res.latitude, ilocation2: res.longitude });
        }
       })
    }
  },

  showdeliverpop() {
    this.setData({ delivershow: true, ideliver: '自取'});
  },

  showcategorypop() {
    this.setData({ categoryshow: true, icategory: '家具'});
  },

  onClose() {
    this.setData({ 
      delivershow: false,
      categoryshow:false
    });
  },

  //上传图片
  beforeRead(event) {
    const { file, callback = () => {} } = event.detail;
    wx.getImageInfo({
      src: event.detail.file.path,
      success: function (res) {
        console.log(res.width,'*',res.height)
        if(res.width * res.height>=6000*8000000){
          wx.showToast({ title: '图片画幅过大，请更换图片', icon: 'none' })
        }else{
          callback(true);
        }
      }
    })
  },

  afterRead(event) {
    const { file, name } = event.detail;
    this.setData({ fileList6: this.data.fileList6.concat(file) });
  },

  delete(event) {
    const { index, name } = event.detail;
    const fileList = this.data[`fileList${name}`];
    fileList.splice(index, 1);
    this.setData({ [`fileList${name}`]: fileList });
  },

  clickPreview() {},

  uploadToCloud() {
    let that=this
    const { fileList6: fileList = [] } = this.data;
    var timestamp = Date.parse(new Date());  
    timestamp = timestamp / 1000;  
    if (this.data.iwxid==''){
      wx.showToast({ title: '请填写微信号', icon: 'none' });
    }else{
      if (this.data.iname==''){
        wx.showToast({ title: '没有物品名称不能发布', icon: 'none' });
      }else{
        if (!fileList.length) {
          wx.showToast({ title: '没有图片不能发布', icon: 'none' });
        } else {
          this.setData({loading:"ture",});
          wx.showLoading({title: '压缩图片中',})
          wx.getImageInfo({
            src: this.data.fileList6[0].path,
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
                  // 要求宽度*(原生图片比例)=新图片尺寸
                  targetWidth = maxWidth;
                  targetHeight = Math.round (maxWidth * (originHeight / originWidth));
                } else {
                  targetHeight = maxHeight;
                  targetWidth = Math.round (maxHeight * (originWidth / originHeight));
                }
              }// 更新 canvas 大小
              that.setData ({
                cw: targetWidth,
                ch: targetHeight
              });// 尝试压缩文件，创建 canvas
              var ctx = wx.createCanvasContext ('firstCanvas');
              ctx.clearRect (0, 0, targetWidth, targetHeight);
              console.log(targetWidth, targetHeight)
              ctx.drawImage (that.data.fileList6[0].path, 0, 0, targetWidth, targetHeight);
              ctx.draw (false,function (){// 获得新图片输出
                setTimeout(() => {
                  wx.canvasToTempFilePath({// 文件保存为 JPG 格式
                    fileType: 'jpg',
                    canvasId: 'firstCanvas',
                    success: function (res1) {
                      console.log(res1.tempFilePath)
                      wx.showLoading({title: '审核图片中',})
                      wx.getFileSystemManager().readFile({
                        filePath: res1.tempFilePath,
                        success: res2 => {
                          console.log('调用imgcheck')
                          that.setData ({
                            cw: targetWidth*3,
                            ch: targetHeight*3
                          })
                          wx.cloud.callFunction({
                            // 云函数名称
                            name: 'imgcheck',
                            // 传给云函数的参数
                            data: ({img: res2.data}),
                            success: function (res3){
                              console.log(res3)
                              if (res3.result.errCode == 87014){
                                wx.hideLoading({})
                                wx.showToast({ title: '图片含违规内容，请更换图片', icon: 'none' });
                                that.setData({loading:false,fileList6:[]});
                                return
                              }else{
                                wx.compressImage({
                                  src: that.data.fileList6[0].path,
                                  quality: 10,
                                  success: function (res4) {
                                    wx.showLoading({title: '正在发布',})
                                    const finalname = app.globalData.openid + timestamp+'.jpg'
                                    // wx.cloud.callFunction({    //上传别的服务器
                                    //   name: 'proxy',
                                    //   data: ({img: res4.tempFilePath}),
                                    //   success: function(data){
                                    //     wx.hideLoading({})
                                    //     wx.showToast({
                                    //       title: '发布成功',
                                    //       duration: 2000,
                                    //     })
                                    //     that.data.imgID = data;
                                    //     that.setData({ cloudPath: data.cdn});
                                    //     that.onClickButton();
                                    //   },
                                    //   fail: function(err){
                                    //     wx.hideLoading({})
                                    //     wx.showToast({ title: '由于您的网络问题，发布失败', icon: 'none' });
                                    //     console.log(err);
                                    //     that.setData({loading: false});
                                    //   }
                                    // })
                                    wx.cloud.uploadFile({
                                      cloudPath: finalname,
                                      filePath: res4.tempFilePath,
                                      success: function(data){
                                        wx.hideLoading({})
                                        wx.showToast({
                                          title: '发布成功',
                                          duration: 2000,
                                        })
                                        that.data.imgID = data.fileID;
                                        that.setData({ cloudPath: data,});
                                        that.onClickButton();
                                      },
                                      fail: function(err){
                                        wx.hideLoading({})
                                        wx.showToast({ title: '由于您的网络问题，发布失败', icon: 'none' });
                                        console.log(err);
                                        that.setData({loading: false});
                                      }
                                    })
                                    
                                  }
                              })
                              }
                            },
                            fail: err=> {
                              wx.hideLoading({})
                              wx.showToast({ title: '腾讯服务器故障，请稍后再试', icon: 'none' });
                              console.log(err);
                              that.setData({loading: false});
                            }
                          })
                        },
                        fail: err=> {
                          wx.hideLoading({})
                          wx.showToast({ title: '发布失败，请更换图片', icon: 'none' });
                          console.log(err);
                          that.setData({loading: false});
                        }
                      })
                    },
                    fail: err=> {
                      // wx.showToast({ title: '网络繁忙，请重试', icon: 'none' });
                      console.log(err);
                      that.uploadToCloud()
                      // that.setData({loading: false});
                    }
                  },this)
                },1000)
              }) 
            }
          })
        }
      }
    }
  },

  onClickButton: function (e) {    
    let that = this;
    console.log();
    var timestamp = Date.parse(new Date());  
      timestamp = timestamp / 1000; 
      db.add({      //db之前宏定义的 在这里指数据库中的Room表； add指 插入
        data: {          // data 字段表示需新增的 JSON 数据       
          iname: this.data.iname,    //将我们获取到的Rname1的value值给Room表中的Rname
          iaddress: this.data.iaddress,
          iwxid: this.data.iwxid,
          iintro: this.data.iintro,
          ideliver: this.data.ideliver,
          icategory: this.data.icategory,
          iprice: this.data.iprice,
          imgID: this.data.imgID,
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
          iwxid: res.data[0].wxid,
          iaddress: res.data[0].address,
          i_id: res.data[0]._id,
          deliverv: res.data[0].itemdeliver,
          ideliver: this.data.deliver[res.data[0].itemdeliver],
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
      title: '【我的课表】功能上线！',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/hot/hot'
    }
  }
})