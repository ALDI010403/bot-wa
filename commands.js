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

const command = body.slice(1).trim()

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

msg.reply(`📖 *Bot Command Guide*

.sleep
Mengaktifkan sleep mode.
Bot akan auto reply semua pesan masuk.

.wake
Mematikan sleep mode.
Bot kembali normal dan tidak auto reply.

.status
Menampilkan status bot saat ini.

.ping
Mengecek apakah bot masih aktif.

.help
Menampilkan daftar command dan fungsi masing-masing.`)

break

}

}

module.exports = { handleCommand }