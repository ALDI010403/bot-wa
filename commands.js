const config = require('./config')

function handleCommand(msg, client){

const body = msg.body

if(!body.startsWith(".")) return

const args = body.slice(1).split(" ")
const command = args[0]

switch(command){

case "sleep":

config.sleepMode = true

msg.reply("😴 Sleep mode aktif")

break

case "wake":

config.sleepMode = false

msg.reply("☀️ Sleep mode dimatikan")

break

case "status":

msg.reply(`Bot Status:

Sleep Mode : ${config.sleepMode}
Sleep Time : ${config.sleepTime.start}:00 - ${config.sleepTime.end}:00`)

break

}

}

module.exports = { handleCommand }