# WhatsApp Auto Reply Bot

Bot WhatsApp sederhana berbasis **Node.js** yang dapat secara otomatis membalas pesan ketika pengguna sedang offline atau tidur. Bot ini juga dapat merespon ketika disebut (mention) di dalam grup WhatsApp.

Bot menggunakan library **whatsapp-web.js** yang memanfaatkan WhatsApp Web untuk menjalankan automasi.

---

# Features

* Auto reply ketika **sleep mode aktif**
* Respon ketika bot **di mention di grup**
* **Whitelist system** (nomor tertentu tidak akan di auto-reply)
* **Command system** untuk mengontrol bot
* **Chat logging** ke file
* Session login tersimpan sehingga tidak perlu scan QR setiap restart
* Mendukung **private chat dan group chat**

---

# Tech Stack

* Node.js
* whatsapp-web.js
* Puppeteer
* fs-extra

---

# Project Structure

```
bot-wa
│
├── bot.js          # Main bot script
├── config.js       # Bot configuration
├── commands.js     # Command handler
├── utils.js        # Helper utilities
├── package.json
├── README.md
├── .gitignore
│
└── logs
    └── chat.log    # Chat logs
```

---

# Installation

Clone repository

```
git clone https://github.com/ALDI010403/bot-wa.git
cd bot-wa
```

Install dependencies

```
npm install
```

---

# Running the Bot

Jalankan bot dengan:

```
node bot.js
```

Saat pertama kali dijalankan, terminal akan menampilkan **QR Code**.

Scan QR menggunakan WhatsApp:

WhatsApp → Linked Devices → Link Device

Setelah berhasil login, bot akan aktif.

---

# Configuration

Semua konfigurasi berada di file:

```
config.js
```

Contoh konfigurasi:

```
module.exports = {

sleepMode: true,

sleepTime: {
start: 23,
end: 7
},

owner: [
"62xxxxxxxxx"
],

whitelist: [
"62xxxxxx",
"62xxxxxx"
],

autoReplyMessage: `Halo 👋

Saat ini saya sedang offline / turu.

Pesan kamu sudah saya terima dan akan saya balas ketika sudah online.

Terima kasih 🙏`

}
```

Penjelasan konfigurasi:

| Parameter        | Deskripsi                                       |
| ---------------- | ----------------------------------------------- |
| sleepMode        | Mengaktifkan atau menonaktifkan mode auto reply |
| sleepTime        | Jam mulai dan selesai sleep mode                |
| owner            | Nomor admin bot                                 |
| whitelist        | Nomor yang tidak akan menerima auto reply       |
| autoReplyMessage | Pesan balasan otomatis                          |

---

# Commands

Command dapat dikirim oleh **owner** melalui chat WhatsApp ke bot.

| Command   | Function                 |
| --------- | ------------------------ |
| `.sleep`  | Mengaktifkan sleep mode  |
| `.wake`   | Menonaktifkan sleep mode |
| `.status` | Melihat status bot       |

---

# Bot Behavior

### Private Chat

Jika seseorang mengirim pesan saat sleep mode aktif:

```
User: bro ada waktu?

Bot:
Halo 👋
Saat ini saya sedang offline / turu.
Pesan kamu sudah saya terima dan akan saya balas ketika sudah online.
```

---

### Group Chat

Bot hanya akan merespon jika **di mention**.

Contoh:

```
@BotName bro ada info?
```

Bot akan membalas:

```
Halo 👋
Sedang Turu.
Silakan DM jika urgent.
```

---

# Logs

Semua pesan masuk akan dicatat di:

```
logs/chat.log
```

Contoh isi log:

```
62xxxxxxxx : bro ada waktu?
62xxxxxxxx : halo
```

---

# Deployment (Optional)

Untuk menjalankan bot 24/7 di server gunakan **PM2**.

Install PM2

```
npm install pm2 -g
```

Jalankan bot

```
pm2 start bot.js --name wa-bot
```

Auto start saat server reboot

```
pm2 save
pm2 startup
```

---

# Troubleshooting

### Bot tidak merespon

Pastikan:

* Bot sudah login
* QR sudah di scan
* Internet stabil

---

### Bot logout sendiri

Hapus folder session:

```
.wwebjs_auth
```

Lalu login ulang dengan scan QR.

---

# Security Notes

Jangan upload folder berikut ke GitHub:

```
node_modules
logs
.wwebjs_auth
```

Folder tersebut sudah di-ignore melalui `.gitignore`.

---

# Disclaimer

Project ini menggunakan **whatsapp-web.js** yang memanfaatkan WhatsApp Web. Gunakan bot secara bijak dan hindari spam untuk mengurangi risiko pembatasan akun oleh WhatsApp.

---

# License

MIT License
