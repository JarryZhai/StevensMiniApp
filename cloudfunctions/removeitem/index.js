
const cloud = require('wx-server-sdk')
 
cloud.init({
})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var id = event._id
  console.log(id)
  try {
    return await db.collection('useditems').doc(id).remove()
    
 
  } catch (e) {
    console.log(e)
  }
}