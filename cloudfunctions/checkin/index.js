// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('member').where({checktoday:0}).update({
    data: {
      checkin: 0
    },
    success: res => {
      console.log('签到')
      
    }
  },200)
  await db.collection('member').where({checktoday:1}).update({
    data: {
      checktoday: 0
    },
    success: res => {
      console.log('签到')
    }
  })

}