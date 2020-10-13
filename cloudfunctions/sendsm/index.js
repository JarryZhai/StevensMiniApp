// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  console.log('开始调用云函数')
  try {
    const result = await cloud.openapi.subscribeMessage.send({ 
    touser: event.openid,     //接收openid
    page: '/pages/sm_ad/smad',        //page
    templateId: 'NfnH-UrYFUunuz77-npT-oqgRonibx40vzg1zI5n5j4' ,   //模板id
    data: { 
      thing2: {value: '点击查看审核结果'}, 
      character_string4: {value: 'Student Medicover $10'}, 
      thing6: {value: "如有疑问联系客服" }, 
      thing3: {value: "审核完成" }, }, 
    }) 
    console.log(result)
    return result 
  } catch (err) { 
    console.log(err)
    return err 
  }
}