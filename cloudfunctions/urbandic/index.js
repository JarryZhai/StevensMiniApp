// 云函数入口文件
const cloud = require('wx-server-sdk')
const rq = require('request-promise')
cloud.init()
// 云函数入口函数
// event为小程序调用的时候传递参数，包含请求参数uri、headers、body
exports.main = async (event, context) => {
    return await rq({
        method: 'GET',
        uri: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define?term='+event.data,
        headers: {
          "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
          "x-rapidapi-key": "81522dbf67msh6d97ae912564327p1c5d20jsn2224ff506fbc"
        }
    }).then(body => {
        return body
    }).catch(err => {
        return err
    })
}