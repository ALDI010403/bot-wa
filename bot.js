const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs-extra')

const config = require('./config')
const { handleCommand } = require('./commands')
const { isSleeping } = require('./utils')

// cooldown map
const cooldown = new Map()

// cooldown time (ms)
const COOLDOWN_TIME = 5 * 60 * 1000

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
})

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
    console.log("Scan QR untuk login")
})

client.on('ready', () => {
    console.log("Bot WhatsApp Ready 🚀")
})

// =========================
// AUTO RECONNECT
// =========================
client.on('disconnected', reason => {

    console.log("WhatsApp disconnected:", reason)
    console.log("Reconnecting...")

    client.initialize()

})

// =========================
// MESSAGE HANDLER
// =========================
client.on('message', async msg => {

    if (msg.fromMe) {
    return
    }
    const chat = await msg.getChat()

    // ambil contact pengirim
    const contact = await msg.getContact()
    const sender = contact.number

    const whitelist = config.whitelist.map(n => n.trim())

    console.log("Sender:", sender)

    // =========================
    // WHITELIST CHECK
    // =========================
    if (whitelist.includes(sender)) {

        console.log("Whitelist detected → skip reply")
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
    if (!chat.isGroup) {

        if (isSleeping(config)) {

            const lastReply = cooldown.get(sender)
            const now = Date.now()

            if (lastReply && now - lastReply < COOLDOWN_TIME) {

                console.log("Cooldown active → skip reply")
                return

            }

            msg.reply(config.autoReplyMessage)

            cooldown.set(sender, now)

        }

    }

    // =========================
    // GROUP MENTION REPLY
    // =========================
    if (chat.isGroup) {

        const mentions = await msg.getMentions()

        const botNumber = client.info.wid._serialized

        const isBotMentioned = mentions.some(user => user.id._serialized === botNumber)

        if (isBotMentioned) {

            const lastReply = cooldown.get(sender)
            const now = Date.now()

            if (lastReply && now - lastReply < COOLDOWN_TIME) {

                console.log("Cooldown active → skip group reply")
                return

            }

            msg.reply(`Halo 👋

Sedang Turu.

Silakan DM jika urgent.`)

            cooldown.set(sender, now)

        }

    }

})

client.initialize()