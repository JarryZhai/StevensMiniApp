// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数

exports.main = async (event, context) => {
  try {
    return await db.collection('house').where({renttime: '0'}).orderBy('createTime','desc').get();
  } catch (e) {
    console.error(e);
  }
}