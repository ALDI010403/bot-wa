const config = require("./config")
const { loadState, saveState } = require("./utils")

async function handleCommand(msg){

const body = msg.body

if(!body.startsWith(".")) return

const contact = await msg.getContact()
const sender = contact.number

if(!config.owner.includes(sender)){
return
}

const args = body.slice(1).split(" ")
const command = args[0]

const state = loadState()

switch(command){

case "sleep":

state.sleepMode = true
saveState(state)

msg.reply("😴 Sleep mode aktif")

break


case "wake":

state.sleepMode = false
saveState(state)

msg.reply("☀️ Sleep mode dimatikan")

break


case "status":

msg.reply(`Bot Status

Sleep Mode : ${state.sleepMode ? "ON 😴" : "OFF ☀️"}`)

break


case "ping":

msg.reply("🏓 Pong! Bot aktif")

break


case "help":

msg.reply(`📖 Bot Command Guide

.sleep → aktifkan auto reply
.wake → matikan auto reply
.status → cek status bot
.ping → cek bot aktif
.whitelist add <nomor>
.whitelist remove <nomor>
.whitelist list`)

break


case "whitelist":

const action = args[1]
const number = args[2]

if(!state.whitelist){
state.whitelist=[]
}

if(action === "add"){

if(!number){
msg.reply("Format: .whitelist add 628xxxx")
return
}

if(state.whitelist.includes(number)){
msg.reply("Nomor sudah ada di whitelist")
return
}

state.whitelist.push(number)
saveState(state)

msg.reply(`Nomor ${number} berhasil ditambahkan ke whitelist`)

}

else if(action === "remove"){

if(!number){
msg.reply("Format: .whitelist remove 628xxxx")
return
}

state.whitelist = state.whitelist.filter(n=>n!==number)
saveState(state)

msg.reply(`Nomor ${number} dihapus dari whitelist`)

}

else if(action === "list"){

if(state.whitelist.length === 0){
msg.reply("Whitelist kosong")
return
}

msg.reply(`Whitelist:

${state.whitelist.join("\n")}`)

}

break

}

}

module.exports = { handleCommand }