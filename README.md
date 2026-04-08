![NodeJS](https://img.shields.io/badge/node.js-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)
# WhatsApp Auto Reply Bot

Bot WhatsApp automation berbasis **Node.js** menggunakan library **whatsapp-web.js** yang dapat membalas pesan secara otomatis ketika pengguna sedang offline atau tidur.

Bot ini dirancang untuk penggunaan personal dengan fitur **anti spam protection**, **manual sleep mode**, dan **command system** yang dapat dikontrol oleh owner.

---

# Features

## Core Features

* Auto reply ketika **sleep mode aktif**
* **Manual sleep mode** cocok untuk pengguna dengan jadwal kerja shifting
* **Persistent sleep mode** (status tetap tersimpan walaupun bot restart)
* **Whitelist system** (nomor tertentu tidak akan di auto reply)
* **Command system** untuk mengontrol bot
* **Group mention reply**
* **Chat logging system**
* **Auto reconnect** jika WhatsApp disconnect
* **Ignore self message** untuk mencegah loop

---

## Anti Spam Protection

Bot dilengkapi sistem anti spam sederhana namun efektif.

Behavior anti spam:

| Message Count | Bot Response                  |
| ------------- | ----------------------------- |
| 1             | Auto reply                    |
| 2             | Auto reply                    |
| 3             | Warning spam + cooldown timer |
| 4+            | Bot tidak merespon            |

Contoh warning spam:

```
⚠️ Peringatan Spam

Kamu terdeteksi mengirim pesan berulang.

Bot tidak akan merespon pesan berikutnya.

Cooldown tersisa: 3 menit 12 detik
```

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
├── bot.js
├── commands.js
├── utils.js
├── config.js
├── state.json
├── package.json
├── README.md
├── .gitignore
│
└── logs
    └── chat.log
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

Start bot:

```
node bot.js
```

Saat pertama kali dijalankan, terminal akan menampilkan **QR Code**.

Scan menggunakan WhatsApp:

```
WhatsApp → Linked Devices → Link Device
```

Setelah berhasil login, bot akan aktif.

---

# Configuration

Edit file:

```
config.js
```

Contoh konfigurasi:

```javascript
module.exports = {

cooldownMinutes: 5,

owner: [
"628xxxxxxxxxx"
],

whitelist: [
"628xxxxxxxxxx",
"628xxxxxxxxxx"
],

autoReplyMessage: `Sedang Turu. Telepon aja kalo urgent bro`

}
```

Penjelasan konfigurasi:

| Parameter        | Description                         |
| ---------------- | ----------------------------------- |
| cooldownMinutes  | Durasi cooldown anti spam           |
| owner            | Nomor admin bot                     |
| whitelist        | Nomor yang tidak akan di auto reply |
| autoReplyMessage | Pesan auto reply                    |

---

# Commands

Command hanya bisa digunakan oleh **owner**.

| Command   | Function                   |
| --------- | -------------------------- |
| `.sleep`  | Mengaktifkan sleep mode    |
| `.wake`   | Mematikan sleep mode       |
| `.status` | Menampilkan status bot     |
| `.ping`   | Mengecek apakah bot aktif  |
| `.help`   | Menampilkan daftar command |

---

# Usage Example

### Activate Sleep Mode

```
.sleep
```

Bot response:

```
😴 Sleep mode aktif
```

---

### Check Bot Status

```
.status
```

Bot response:

```
Bot Status

Sleep Mode : ON 😴
```

---

### Disable Sleep Mode

```
.wake
```

Bot response:

```
☀️ Sleep mode dimatikan
```

---

# Logs

Semua pesan masuk akan dicatat pada file:

```
logs/chat.log
```

Contoh isi log:

```
6281234567890 : bro ada waktu?
6289876543210 : halo
```

---

# Deployment (Optional)

Untuk menjalankan bot secara **24/7** gunakan PM2.

Install PM2

```
npm install pm2 -g
```

Run bot

```
pm2 start bot.js --name wa-bot
```

Auto start saat server reboot

```
pm2 save
pm2 startup
```

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
