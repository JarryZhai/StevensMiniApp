// 云函数入口文件

const cloud = require('wx-server-sdk')
const rq = require('request-promise')
cloud.init({env='ruijie-wxcloud-3'})
// 云函数入口函数
// event为小程序调用的时候传递参数，包含请求参数uri、headers、body
exports.main = async (event, context) => {
  console.log('request开始')
    return await rq({
        method:'POST',
        uri: event.uri,
        headers: event.headers ? event.headers : {},
        body: event.body
    }).then(body => {
        return body
    }).catch(err => {
        return err
    })
}