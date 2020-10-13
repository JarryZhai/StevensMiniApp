// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数

exports.main = async (event, context) => {
  try {
    return await db.collection('useditems').where({ _openid: event.ID}).orderBy('createTime','desc').limit(MAX_LIMIT).get();
  } catch (e) {
    console.error(e);
  }
}