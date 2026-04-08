const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs-extra')

const config = require('./config')
const { handleCommand } = require('./commands')
const { isSleeping } = require('./utils')

// spam tracker
const userTracker = new Map()

// cooldown time
const COOLDOWN_TIME = 5 * 60 * 1000

function formatCooldown(ms){

const totalSeconds = Math.floor(ms / 1000)
const minutes = Math.floor(totalSeconds / 60)
const seconds = totalSeconds % 60

return `${minutes} menit ${seconds} detik`

}

const client = new Client({
authStrategy: new LocalAuth(),
puppeteer:{
headless:true,
args:['--no-sandbox']
}
})

client.on('qr', qr => {

qrcode.generate(qr,{small:true})
console.log("Scan QR untuk login")

})

client.on('ready', ()=>{

console.log("Bot WhatsApp Ready 🚀")

})

// =========================
// AUTO RECONNECT
// =========================
client.on('disconnected', reason =>{

console.log("WhatsApp disconnected:",reason)
console.log("Reconnecting...")

client.initialize()

})

// =========================
// MESSAGE HANDLER
// =========================
client.on('message', async msg => {

if(msg.fromMe){
return
}

const chat = await msg.getChat()

const contact = await msg.getContact()

// normalisasi nomor
const sender = contact.number.replace(/\D/g, "")

const whitelist = config.whitelist.map(n => n.replace(/\D/g, ""))

console.log("Sender:", sender)
console.log("Whitelist:", whitelist)

// =========================
// WHITELIST CHECK
// =========================
if(whitelist.includes(sender)){

console.log("Whitelist detected → skip reply")
// owner tetap bisa jalankan command
await handleCommand(msg)
return

}

// =========================
// LOGGING
// =========================
fs.ensureDirSync("./logs")

fs.appendFileSync(
"./logs/chat.log",
`${sender} : ${msg.body}\n`
)

// =========================
// COMMAND HANDLER
// =========================
await handleCommand(msg)

// =========================
// PRIVATE CHAT AUTO REPLY
// =========================
if(!chat.isGroup){

if(isSleeping(config)){

const now = Date.now()

let data = userTracker.get(sender)

if(!data){

data={
count:0,
firstMessageTime:now
}

}

const elapsed = now - data.firstMessageTime

if(elapsed > COOLDOWN_TIME){

data={
count:0,
firstMessageTime:now
}

}

data.count +=1

userTracker.set(sender,data)

const remaining = COOLDOWN_TIME - elapsed

// pesan ke 1 dan 2
if(data.count <=2){

msg.reply(config.autoReplyMessage)
return

}

// pesan ke 3 warning
if(data.count ===3){

msg.reply(`${config.autoReplyMessage}

⚠️ *Peringatan Spam*

Kamu terdeteksi mengirim pesan berulang.

Bot tidak akan merespon pesan berikutnya.

Cooldown tersisa: ${formatCooldown(remaining)}`)

return

}

// pesan ke 4 ke atas
if(data.count >=4){

console.log("Spam detected → ignoring message")
return

}

}

}

// =========================
// GROUP MENTION REPLY
// =========================
if(chat.isGroup){

const mentions = await msg.getMentions()

const botNumber = client.info.wid._serialized

const isMention = mentions.some(u=>u.id._serialized === botNumber)

if(isMention){

const now = Date.now()

let data = userTracker.get(sender)

if(!data){

data={
count:0,
firstMessageTime:now
}

}

const elapsed = now - data.firstMessageTime

if(elapsed > COOLDOWN_TIME){

data={
count:0,
firstMessageTime:now
}

}

data.count +=1

userTracker.set(sender,data)

const remaining = COOLDOWN_TIME - elapsed

if(data.count <=2){

msg.reply("Sedang Turu. DM aja kalau urgent.")
return

}

if(data.count ===3){

msg.reply(`⚠️ *Peringatan Spam*

Kamu terlalu sering mention bot.

Cooldown tersisa: ${formatCooldown(remaining)}`)

return

}

if(data.count >=4){

console.log("Group spam detected → ignoring")
return

}

}

}

})

// =========================
// MEMORY CLEANUP
// =========================
setInterval(()=>{

userTracker.clear()

},3600000)

client.initialize()