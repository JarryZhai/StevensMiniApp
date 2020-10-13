// 云函数入口文件
const cloud = require('wx-server-sdk')
const rq = require('request-promise')
cloud.init()
const db = cloud.database()
// 云函数入口函数
// event为小程序调用的时候传递参数，包含请求参数uri、headers、body
exports.main = async (event, context) => {
    await rq({
        method: 'GET',
        uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx35b4a55fd6a2adfd&secret=40b2c50779e92acb33f0327278051aa7',
        data: {
        },
        header: 'application/json'
    }).then(body => {
        return body
    }).catch(err => {
        console.log(err)
        return err
    })
}