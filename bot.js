const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs-extra')

const config = require('./config')
const { handleCommand } = require('./commands')
const { isSleeping } = require('./utils')

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

client.on('message', async msg => {

    const chat = await msg.getChat()

    // ambil contact pengirim (cara paling stabil)
    const contact = await msg.getContact()
    const sender = contact.number

    const whitelist = config.whitelist.map(n => n.trim())

    console.log("Sender:", sender)
    console.log("Whitelist:", whitelist)

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
    handleCommand(msg, client)

    // =========================
    // PRIVATE CHAT
    // =========================
    if (!chat.isGroup) {

        if (isSleeping(config)) {

            msg.reply(config.autoReplyMessage)

        }

    }

    // =========================
    // GROUP CHAT
    // =========================
    if (chat.isGroup) {

        const mentions = await msg.getMentions()

        const botNumber = client.info.wid._serialized

        const isBotMentioned = mentions.some(user => user.id._serialized === botNumber)

        if (isBotMentioned) {

            msg.reply(`Sedang Turu.
Telepon aja kalo urgent bro`)

        }

    }

})

client.initialize()