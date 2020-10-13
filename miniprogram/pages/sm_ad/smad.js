// miniprogram/pages/sm_ad/smad.js
wx.cloud.init({});
const db = wx.cloud.database().collection('member');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id: '',
    SMname: '',
    SMmail: '',
    radio1: '0',
    radio2: '1',
    date: '1997-06-01',
    steps: [
      {
        text: '填写问券',
        desc: '确认参与',
      },
      {
        text: '正在审核',
        desc: '等待通知',
      },
      {
        text: '[礼品卡]',
        desc: '审核通知',
      },
    ],
    activeNames: [],
    card: ['Amazon', 'Sephora', 'Starbucks'],
    grade: ['未选择','本科', '研一', '研二','博士'],
    ruleUrl: ['https://s1.ax1x.com/2020/07/12/U1cKW8.jpg','https://s1.ax1x.com/2020/07/12/U1cQSS.jpg', 'https://s1.ax1x.com/2020/07/12/U1cuJf.jpg'],
    reasonlist:  ['价格合理', '保险产品全面', '朋友/平台推荐','服务好','成立时间长，靠谱','其他'],
    reasonresult: [],
    stepactive: 10,
    newName: '',
    newMail: '',
    showposter: false,
  },

  ifNew: function () {
    wx.cloud.init({});
    const db = wx.cloud.database().collection('member');
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[登录成功]: ', res.result.openid)
        app.globalData.openid = res.result.openid
        db.where({ _openid: res.result.openid}).get({
          success: res=>{
            console.log('[会员信息]：'+res.data)
            if(res.data[0]==null){
              console.log('新会员');
              this.newMember();
            }
            else{
              this.setData({
                //老会员信息提取
              })
            }
            this.setData({
              memberinfo: res.data
            })
          },
          fail: err => {
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err) 
      }
    })
  },

  newMember: function(){
    wx.cloud.init({});
    const db = wx.cloud.database().collection('member');
    console.log('添加新会员');
    var timestamp = Date.parse(new Date());  
    timestamp = timestamp / 1000; 
    db.add({      //db之前宏定义的 在这里指数据库中的Room表； add指 插入
      data: {          // data 字段表示需新增的 JSON 数据       
        stevensID: 0,    
        stevensPW: 0,
        campusID: 0,
        term: [0,f],
        onetime: 1,
        createTime: timestamp,
        address: '',
        schedule: [['课程编号', '课程名称', '周一 8:30 AM', 'Room', '课程Note可随时更改，课程左滑可以删除']],
        SM10: 0, //SM保险活动
      },          
      success: res=> {
        this.setData({
          //注册成功act
        })
        console.log("新会员创建成功", res)  
        this.searchMine()
      },
    })  
  },

  searchSM: function(){
    db.where({ _openid: app.globalData.openid}).get({
      success: res=>{
        console.log(res)
        this.setData({
          SMname: res.data[0].SMname,
          SMmail: res.data[0].SMmail,
          stepactive: res.data[0].SM10,
          date: res.data[0].SMbirth
        })
        if(res.data[0].SM10==0){
          this.setData({showposter:true})
        }
      },
      fail: err => {
       console.error('[数据库] [查询记录] 失败：', err)
     }
    })
  },

  onNewNameChange(event) {
    this.setData({newName: event.detail});
  },
  onNewMailChange(event) {
    this.setData({newMail: event.detail});
  },
  onReasonShow(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  onRadio1Change(event) {
    this.setData({
      radio1: event.detail,
    });
  },

  onRadio2Change(event) {
    this.setData({
      radio2: event.detail,
    });
  },

  onReasonChange(event) {
    this.setData({
      reasonresult: event.detail
    });
  },

  onClose(){
    this.setData({showposter:false})
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  noop() {},

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  openRule: function(){
    wx.previewImage({
      urls: this.data.ruleUrl, //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
    })
  },


  addSM10: function(){
    if(this.data.newMail=='' || this.data.newName=='' || this.data.radio1==0 || this.data.reasonresult[0]==null){
      wx.showToast({
        icon: 'none',
        title: '还有未填写的项目喔'
      })
    }else{
      db.doc(this.data.member_id).update({
        data: {
          SMname: this.data.newName,
          SMmail: this.data.newMail,
          SMtime: this.getNowTime(),
          SMgrade: this.data.radio1,
          SMcard: this.data.card[this.data.radio2-1],
          SMgrade: this.data.grade[this.data.radio1],
          SMreason: this.data.reasonresult,
          SM10: 1,
          SMbirth: this.data.date
        },
        success: res => {
          wx.showToast({
            icon: 'none',
            title: '参与成功'
          })
          this.searchSM()
          this.setData({
            stepactive: 1
          })
          wx.requestSubscribeMessage({
            tmplIds: ['NfnH-UrYFUunuz77-npT-oqgRonibx40vzg1zI5n5j4'],
            success (res) { 
              console.log(res)
            },
            fail(err){
              console.log(err)
            }
          })
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err)
          wx.showToast({
            icon: 'none',
            title: '请重试'
          })
        }
      })
    }
  },

  // buySM10: function(){
  //   db.doc(this.data.member_id).update({
  //     data: {
  //       SM10: 2
  //     },
  //     success: res => {
  //       this.searchSM()
  //       this.setData({
  //         stepactive: 2
  //       })
  //     },
  //     fail: err => {
  //       console.error('[数据库] [更新记录] 失败：', err)
  //     }
  //   })
  // },

  onCopy: function (e) {
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

  getNowTime: function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if(month < 10) {
      month = '0' + month;
    };
    if(day < 10) {
      day = '0' + day;
    };
    //  如果需要时分秒，就放开
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var formatDate = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s +'北京时间';
    console.log('当前时间',formatDate)
    return formatDate;
  },

  onClickLeft:function(){
    wx.switchTab({
      url: '/pages/hot/hot',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ifNew()
    db.where({ _openid: app.globalData.openid}).get({
      success: res=>{
        console.log(res)
        this.setData({
          member_id: res.data[0]._id
        })
        this.searchSM()
      },
      fail: err => {
       console.error('[数据库] [查询记录] 失败：', err)
     }
    })
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
      title: '【填1分钟问券，送$10礼品卡】仅限SIT学生参与👇详情点击👇',
      imageUrl: 'https://s1.ax1x.com/2020/07/16/UBVqeK.png',
      path: '/pages/sm_ad/smad'
    }
  },

})