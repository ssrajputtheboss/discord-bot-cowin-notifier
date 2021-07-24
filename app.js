require('dotenv').config()
const Discord = require('discord.js')
const fetch = require('node-fetch')
const bot = new Discord.Client()
const TOKEN = process.env.TOKEN
const DELAY = 60* 1000 //fetch in every 60 seconds
const DELAY_DATE = 6
const SETU_URL = process.env.SETU_URL
const CHANNEL = process.env.CHANNEL
let lastMsg = ''
bot.login(TOKEN)

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
})

const fetchData = async()=>{
    const tmrw = new Date(new Date().getTime() + DELAY_DATE * 24 * 60 * 60 * 1000)
    const day = tmrw.getDate(), month = tmrw.getMonth()+1 , year = tmrw.getFullYear()
    const strd = `${day<10?('0'+day):day}-${month<10?('0'+month):month}-${year}`
    const res = await fetch(SETU_URL+strd)
    if(res.ok){
        const data =await res.json()
        const sessions =await data.sessions
        let msg = ''
        sessions.forEach(s => {
            Object.keys(s).forEach(k=>{
                msg+=`${k}:${s[k]}\n`
            })
            msg+='-------------------\n'
        });
        if(lastMsg !== msg)
            bot.channels.cache.get(CHANNEL).send(msg)
        lastMsg = msg
    }
}

setInterval(fetchData, DELAY);