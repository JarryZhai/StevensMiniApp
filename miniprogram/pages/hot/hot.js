//AppSecret 40b2c50779e92acb33f0327278051aa7
// miniprogram/pages/hot/hot.js
const app = getApp()
var plugin = requirePlugin("chatbot");
import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * Page initial data
   */
  data: {
    calenderpopshow: false,
    officehourpopshow: false,
    schedulepopshow: false,
    flightpopshow: false,
    metspopshow: false,
    urbanpopshow: false,
    urbanloading: false,
    momapopshow: false,
    showcheck: false,
    whitneypopshow: false,
    downloadshow: false,
    showexchange: false,
    valuedollar: '',
    valuermb: '',
    random: 0,
    covid: [],
    covidcn: [],
    memberinfo: '',
    timestatus: '',
    ohvalue: '',
    urbanvalue: '',
    ohlist: '',
    info: '',
    flight: '',
    weather: '',
    met: '',
    moma: '',
    whitney: '',
    urbanlist: '',
    share: '',
    active: '',
    exchange: '',
    download: '',
    mapUrl: ['https://s1.ax1x.com/2020/07/06/UC0bGR.png','https://s1.ax1x.com/2020/07/06/UC0qR1.png'],
    calender20f:[
      {
        date: '8月31日 周一',
        detail: '2020Fall开学'
      },
      {
        date: '9月1日 周二',
        detail: '2021Spring PhD申请截止日'
      },
      {
        date: '9月6日 周日',
        detail: '退课退全款截止日'
      },
      {
        date: '9月7日 周一',
        detail: 'Labor Day 假日，学校办公室关闭',
        note: '假日'
      },
      {
        date: '9月14日 周一',
        detail: '退课退90%学费截止日，在此之后，加课需要老师签字，退课会在成绩单上显示‘W’记号，建议在此之前决定课表'
      },
      {
        date: '9月18日 周五',
        detail: '2020年12月毕业研究生的毕业申请截止日'
      },
      {
        date: '9月28日 周一',
        detail: '退课退50%学费截止日'
      },
      {
        date: '10月1日 周四',
        detail: '2021年5月毕业本科生的毕业申请截止日'
      },
      {
        date: '10月12日 周一',
        detail: '秋假（哥伦布日）停课，学校正常办公',
        note: '假日'
      },
      {
        date: '10月13日 周二',
        detail: '【上周一的课】'
      },
      {
        date: '10月20日 周二',
        detail: '退课退25%学费截止日'
      },
      {
        date: '10月26日 周一',
        detail: 'Master/PhD 春季选课开始'
      },
      {
        date: '11月2日 周一',
        detail: '本科生春季选课开始'
      },
      {
        date: '11月10日 周二',
        detail: '之后退课不退费，并且需要‘老师，Advisor，院长’三方签字'
      },
      {
        date: '11月24日 周二',
        detail: '预约博士论文答辩截止'
      },
      {
        date: '11月25 周三 ~ 11月29 周日',
        detail: '感恩节假期，停课，办公室关闭',
        note: '假日'
      },
      {
        date: '12月4日 周五',
        detail: '此后不可退课'
      },
      {
        date: '12月11日 周五',
        detail: '课程结束，准备考试'
      },
      {
        date: '12月24日 周四',
        detail: '寒假最迟开始日，学期结束'
      },
    ],
    checktotal: 0
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
            plugin.init({
              appid: "VLoss2UzoWy8gKjiKGrJruQu8Db7x8", //小程序账户
              openid: app.globalData.openid,//用户的openid，非必填，建议传递该参数
              success: () => {},
              fail: error => {},
              guideList: ["你会做什么","我想听歌","讲个笑话","转人工"],
              textToSpeech: false, //默认为ture打开状态
              welcome: "陪我聊聊天吧",
              background: "rgba(247,251,252,1)",
              guideCardHeight: 40,
              operateCardHeight: 145,
              history: true,
              historySize: 60,
              navHeight: 0,
              robotHeader: 'https://s1.ax1x.com/2020/07/11/UQam9I.png',
              userHeader: 'https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/rightHeader.png',
              userName: '',
              defaultWheel: ''
            })
            this.setData({
              memberinfo: res.data
            })
            if(res.data[0]==null){
              console.log('新会员');
              this.newMember();
            }
            if(this.data.memberinfo[0].onetime==1){
              this.setData({showonetime: true})
              db.doc(this.data.memberinfo[0]._id).update({
                data: {
                  onetime: 0,
                }
              })
            }
            if(this.data.memberinfo[0].checktoday==0){
              Notify({
                type: 'success',
                message: '已为您自动签到，记得明天也要来喔',
                top: 80,
                duration: 3000,
              });
              db.doc(this.data.memberinfo[0]._id).update({
                data: {
                  checkin: this.data.memberinfo[0].checkin+1,
                  checktoday: 1
                },
                success: res =>{
                  this.ifNew().then(
                    this.setData({
                      checktotal : this.data.memberinfo[0].checkin
                    })
                  )
                }
              })
            }else{
              this.setData({
                checktotal : this.data.memberinfo[0].checkin
              })
            }
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
        onetime: 1,
        term: [0,f],
        createTime: timestamp,
        address: '',
        schedule: [['课程编号', '课程名称', '周一 8:30 AM', 'Room', '课程Note可随时更改，课程左滑可以删除']],
        SM10: 0, //SM保险活动
        checkin: 0,
        checktoday: 0
        
      },          
      success: res=> {
        this.setData({
          //注册成功act
        })
        console.log("新会员创建成功", res)  
        this.ifNew()
      },
    })  
  },

  // 刷新用户数据
  refreshMember: function(){
    wx.cloud.init({});
    const db = wx.cloud.database().collection('member');
    db.where({ _openid: app.globalData.openid}).get({
      success: res=>{
        this.setData({
          memberinfo: res.data,
          checktotal : res.data[0].checkin
        })
      }
    })
  },

  getTimeState :function(){
    // 获取当前时间
    let timeNow = new Date();
    // 获取当前小时
    let hours = timeNow.getHours();
    // 设置默认文字
    let text = ``;
    // 判断当前时间段
    if (hours >= 0 && hours <= 4) {
        text = `早点休息`;
    }else if (hours > 4 && hours <= 10) {
        text = `记得吃早饭`;
    }else if (hours > 10 && hours <= 14) {
        text = `午餐时间到啦`;
    } else if (hours > 14 && hours <= 18) {
        text = `下午好`;
    } else if (hours > 18 && hours <= 24) {
        text = `晚上好`;
    }
    // 返回当前时间段对应的状态
    this.setData({
      timestatus: text
    })
  },

  openMap: function(){
    var mapUrl = this.data.mapUrl;
    wx.previewImage({
      urls: mapUrl, //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
    })
  },

  openCalender: function(){
    this.setData({calenderpopshow: true})
  },

  openOfficeHour: function(){
    this.setData({officehourpopshow: true})
  },

  openFlight: function(){
    this.setData({flightpopshow: true, })
  },

  openMets: function(){
    this.setData({metspopshow: true, })
  },

  openMOMA: function(){
    this.setData({momapopshow: true, })
  },

  openWhitney: function(){
    this.setData({whitneypopshow: true, })
  },

  openUrban: function(){
    this.setData({urbanpopshow: true, })
  },

  openCheck: function(){
    this.setData({showcheck: true, })
  },

  openDownload: function(){
    this.setData({downloadshow: true, })
  },

  openExchange: function(){
    this.setData({showexchange: true, })
  },

  openReturn: function(){
    wx.showLoading({
      title: '正在打开',
    })
    wx.cloud.downloadFile({
      fileID: 'cloud://ruijie-wxcloud-3.7275-ruijie-wxcloud-3-1302229551/return-to-campus-guide-07212020.pdf',
      success: res => {
        // get temp file path
        console.log(res.tempFilePath)
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('打开文档成功')
            wx.hideLoading({})
          }
        })
      },
      fail: err => {
        wx.hideLoading({})
        wx.showToast({
          title: '失败请重试',
        })
      }
    })
  },

  onClose: function(){
    this.setData({
      calenderpopshow: false,
      officehourpopshow: false,
      schedulepopshow: false,
      flightpopshow: false,
      metspopshow: false,
      urbanpopshow: false,
      showonetime: false,
      momapopshow: false,
      showcheck: false,
      whitneypopshow: false,
      downloadshow: false,
      showexchange: false
    })
  },

  MOMArefresh: function(){
    wx.cloud.init({});
    const db = wx.cloud.database().collection('moma_new');
    db.aggregate().sample({size: 1}).end().then(res=>{
      this.setData({moma: res.list[0]})
      console.log('moma',res.list[0])
    })
  },

  whitneyrefresh: function(){
    wx.cloud.init({});
    const db = wx.cloud.database().collection('whitney');
    db.aggregate().sample({size: 1}).end().then(res=>{
      this.setData({whitney: res.list[0]})
      console.log('whitney',res.list[0])
    })
  },

  metrefresh: function(){
    wx.cloud.init({});
    const db = wx.cloud.database().collection('met');
    db.aggregate().sample({size: 1}).end().then(res=>{
      this.setData({met: res.list[0]})
      console.log('met',res.list[0])
    })
  },

  previewimg: function(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.img],
    })
  },

  OHChange(e) {
    this.setData({
      ohvalue: e.detail
    });
  },

  UrbanChange(e) {
    this.setData({
      urbanvalue: e.detail
    });
  },

  DollarChange(e) {
    this.setData({
      valuedollar: e.detail,
      valuermb: e.detail*this.data.exchange
    });
  },

  RMBChange(e) {
    this.setData({
      valuedollar: e.detail/this.data.exchange,
      valuermb: e.detail
    });
  },

  onOHSearch: function () {
    wx.cloud.init({});
    const db = wx.cloud.database().collection('officehour');
    const dbs = wx.cloud.database()
    const _ = wx.cloud.database().command;
    if (!this.data.ohvalue) {
      wx.showToast({
        icon: 'none',
        title: '请输入搜索内容',
        duration: 2000,
      })
    } 
    else{
      db.where(_.or([{
        name: dbs.RegExp({
          regexp: '.*' + this.data.ohvalue,
          options: 'i',
        })
      }
    ])).get({
        success: res => {
        console.log(res),
        this.setData({
          ohlist: res.data
        })
      },
      fail: err => {
      },
    })
    }
  },

  openSchedule: function(){
    this.setData({schedulepopshow: true})
  },

  toSchedule: function(){
    wx.navigateTo({
      url: '/pages/myschedule/myschedule',
    })
    this.setData({schedulepopshow: false})
  },

  clickPop: function(){
    this.setData({startpopshow: false})
    wx.navigateTo({
      url: '/pages/sm_ad/smad',
    })
  },

  onUrbanSearch:function(){
    var that = this
    wx.cloud.init({});
    this.setData({urbanloading: true,urbanlist:''})
    wx.cloud.callFunction({
        name:'urbandic',
        data: {
            // http域名 https域名 第三方域名 非验证域名 IP[:prot] 内网IP或花生壳域名
            data: this.data.urbanvalue
        },
        fail: err=>{
          that.setData({urbanloading: false})
          wx.showToast({
            title: '没找到or接口挂掉了',
            icon: 'none'
          })
        },
        success: res=>{
          console.log('[字典查询]：'+res.result)
          that.setData({urbanlist: JSON.parse(res.result),urbanloading: false})
        }
    })
  },

  gotobuy: function(){
    wx.switchTab({
      url: '/pages/buy/buy',
    })
  },

  gotohouse: function(){
    wx.switchTab({
      url: '/pages/house/house',
    })
  },

  getInfo: function(){
    var that=this
    wx.cloud.init({});
    const db = wx.cloud.database().collection('info');
    db.get({
      success: function(res) {
        console.log(res)
        that.setData({
          info: res.data,
          covid: JSON.parse(res.data[0].covid),
          covidcn: JSON.parse(res.data[0].covidcn),
          weather: JSON.parse(res.data[1].weather),
          download: res.data[2].download,
          share: res.data[3].share,
          active: res.data[4].active,
          exchange: JSON.parse(res.data[5].exchange).rates.CNY.toFixed(3),
        })
      }
    })
  },

  // 兑换
  prize: function(e){
    let that = this;
    wx.cloud.init({});
    const db = wx.cloud.database().collection('member');
    let name = e.currentTarget.dataset.text;
    switch ( name ) {
      case "renewitem1":
        console.log("兑换擦亮卡一张");
        if(that.data.memberinfo[0].checkin<2){
          wx.showToast({
            title: '你的连续签到天数不够喔',
            icon: 'none'
          })
        }else{
          db.doc(that.data.memberinfo[0]._id).update({
            data: {
              checkin: that.data.memberinfo[0].checkin-2,
              renewitemcard: that.data.memberinfo[0].renewitemcard+1
            },
            success: function(res) {
              that.refreshMember()
            }
          })
          wx.showToast({
            title: '兑换成功',
            icon: 'none'
          })
        }
        break;
    }
  },

  //预览图片
  previewImage:function(e){
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // =============重点重点=============
    })
  },

  // 复制
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

  Makecall: function(e){
    var num = e.currentTarget.dataset.num
    wx.makePhoneCall({
      phoneNumber:num
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var random = Math.floor(Math.random() * 10 );
    this.ifNew()
    this.setData({
      startpopshow: true,
      random: random
    })
    this.whitneyrefresh()
    this.MOMArefresh()
    this.metrefresh()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          active: 0
        })
      }
    this.getTimeState()
    this.getInfo()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
    return {
      title: this.data.share[0],
      imageUrl: this.data.share[1],
      path: this.data.share[2]
    }
  }
})