// 云函数入口文件

const cloud = require('wx-server-sdk')
const rq = require('request-promise')
cloud.init()
// 云函数入口函数
// event为小程序调用的时候传递参数，包含请求参数uri、headers、body
exports.main = async (event, context) => {
    return await rq({
        method: 'GET',
        uri: 'https://api.themoviedb.org/3/movie/550?api_key=f70fc7a0424d192d4bbfe0153da697f4',
    }).then(body => {
        return body
    }).catch(err => {
        return err
    })
}