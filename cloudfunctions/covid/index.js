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
        uri: 'https://coronavirus-19-api.herokuapp.com/countries/USA',
        data: {
        },
        header: 'application/json'
    }).then(body => {
      db.collection('info').doc('911c8c4a5f05e1de000a76d42b231ef5').update({
        data: {
          covid: body
        },
        success: res => {
          console.log('新冠自动更新成功')
        }
      })
    }).catch(err => {
        console.log(err)
    })
}

