const fs = require("fs")

const STATE_FILE = "./state.json"

function loadState(){

if(!fs.existsSync(STATE_FILE)){
fs.writeFileSync(STATE_FILE, JSON.stringify({ sleepMode:false }, null,2))
}

return JSON.parse(fs.readFileSync(STATE_FILE))

}

function saveState(state){

fs.writeFileSync(STATE_FILE, JSON.stringify(state, null,2))

}

function isSleeping(){

const state = loadState()
return state.sleepMode

}

module.exports = { loadState, saveState, isSleeping }