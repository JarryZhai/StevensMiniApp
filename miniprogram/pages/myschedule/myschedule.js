// miniprogram/pages/myschedule/myschedule.js
wx.cloud.init({});
const db = wx.cloud.database().collection('member');
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    member_id: '',
    schedule: [],
    active: [],
    newCourseID: '',
    noteshow: false,
    tempnoteid: '',
    newCourseName: '',
    newCourseTime: '',
    newCourseRoom: '',
    newCourseNote: '',
    oldCourseNote: '',
  },

  searchCourse: function(){
    db.where({ _openid: app.globalData.openid}).get({
      success: res=>{
        console.log(res)
        this.setData({
          schedule: res.data[0].schedule
        })
      },
      fail: err => {
       console.error('[数据库] [查询记录] 失败：', err)
     }
    })
  },

  updateNote: function(e){
    var id = e.currentTarget.dataset.id
    var targetnote = 'schedule.'+id+'.4'
    if(this.data.oldCourseNote==''){
      wx.showToast({
        icon: 'none',
        title: '不能为空'
      })
    }else{
      db.doc(this.data.member_id).update({
        data: {
          [targetnote]: this.data.oldCourseNote,
        },
        success: res => {
          wx.showToast({
            icon: 'none',
            title: '更新成功'
          })
          this.searchCourse()
          this.setData({
            oldCourseNote: '',
            noteshow: false,
            tempnoteid: ''
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

  deleteCourse: function(e){
    var id = e.currentTarget.dataset.id
    this.data.schedule.splice(id,1)
    var newschedule = this.data.schedule
    db.doc(this.data.member_id).update({
      data: {
        schedule: newschedule,
      },
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '删除成功'
        })
        this.searchCourse()
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '请重试'
        })
      }
    })
  },

  onAddChange(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail,
    });
  },

  //新建课程
  onCourseIDChange(event) {
    this.setData({newCourseID: event.detail});
  },
  onCourseNameChange(event) {
    this.setData({newCourseName: event.detail});
  },
  onCourseTimeChange(event) {
    this.setData({newCourseTime: event.detail});
  },
  onCourseRoomChange(event) {
    this.setData({newCourseRoom: event.detail});
  },
  onCourseNoteChange(event) {
    this.setData({newCourseNote: event.detail});
  },
  onUpdateCourseNoteChange(event) {
    this.setData({oldCourseNote: event.detail});
  },

  onNoteShow: function(e){
    var id = e.currentTarget.dataset.src
    this.setData({
      tempnoteid: id,
      noteshow: true,
      oldCourseNote: this.data.schedule[id][4],
    })
  },
  onNoteClose: function(){
    this.setData({noteshow: false})
  },

  addCourse: function(){
    var newschedule = this.data.schedule
    newschedule.push([this.data.newCourseID, this.data.newCourseName, this.data.newCourseTime, this.data.newCourseRoom, this.data.newCourseNote])
    db.doc(this.data.member_id).update({
      data: {
        schedule: newschedule,
      },
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '添加成功'
        })
        this.searchCourse()
        this.setData({
          newCourseID: '',
          newCourseName: '',
          newCourseTime: '',
          newCourseRoom: '',
          newCourseNote: '',
          active: []
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
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    db.where({ _openid: app.globalData.openid}).get({
      success: res=>{
        console.log(res)
        this.setData({
          member_id: res.data[0]._id
        })
        this.searchCourse()
      },
      fail: err => {
       console.error('[数据库] [查询记录] 失败：', err)
     }
    })
  },

  onClickLeft:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
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
      title: '更多功能上线！【教职工信息】【我的课表】【中文校历】【校园地图】',
      imageUrl: 'https://s1.ax1x.com/2020/07/09/UeGv3d.png',
      path: '/pages/hot/hot'
    }
  }
})