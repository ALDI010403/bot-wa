const moment = require('moment')

function isSleeping(config){

if(!config.sleepMode) return false

const hour = moment().hour()

if(config.sleepTime.start > config.sleepTime.end){
return hour >= config.sleepTime.start || hour < config.sleepTime.end
}

return hour >= config.sleepTime.start && hour < config.sleepTime.end

}

module.exports = { isSleeping }