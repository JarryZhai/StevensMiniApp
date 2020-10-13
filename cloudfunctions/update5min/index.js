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
        uri: 'http://api.openweathermap.org/data/2.5/weather?q=hoboken&appid=17f5c01a630a938543a791117c7c68a9',
        data: {
        },
        header: 'application/json'
    }).then(body => {
      db.collection('info').doc('911c8c4a5f05e2c3000a7d6255db1000').update({
        data: {
          weather: body
        },
        success: res => {
          console.log('天气自动更新成功')
        }
      })
    }).catch(err => {
        console.log(err)
    })
    await rq({
      method: 'GET',
      uri: 'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,CNY',
      data: {
      },
      header: 'application/json'
    }).then(body => {
      db.collection('info').doc('08e51e265f1dbfd4007add6a7b802aa2').update({
        data: {
          exchange: body
        },
        success: res => {
          console.log('汇率自动更新成功')
        }
      })
    }).catch(err => {
        console.log(err)
    })

    await rq({
      method: 'GET',
      uri: 'https://coronavirus-19-api.herokuapp.com/countries/China',
      data: {
      },
      header: 'application/json'
    }).then(body => {
      db.collection('info').doc('911c8c4a5f05e1de000a76d42b231ef5').update({
        data: {
          covidcn: body
        },
        success: res => {
          console.log('中国新冠自动更新成功')
        }
      })
    }).catch(err => {
        console.log(err)
    })
}

