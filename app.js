require('dotenv').config()
const Discord = require('discord.js')
const fetch = require('node-fetch')
const bot = new Discord.Client()
const TOKEN = process.env.TOKEN
const DELAY = 2 * 60 * 1000 //fetch in every 2 minutes
const DELAY_DATE = 7
const SETU_URL = process.env.SETU_URL
const CHANNEL = process.env.CHANNEL
const SEPERATOR = '\u0000'
const UNNECCESSARY_KEYS = ['center_id','pincode','from','to','lat','long','fee','session_id','fee_type','alow_all_age','slots']
const LINE_SEPERATOR = '-\n-\n-\n'
let lastMsg = ['','','','','','']
bot.login(TOKEN)

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`)
})

const fetchData = async()=>{
    for(let i=1;i<=DELAY_DATE;++i){
        const tmrw = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
        const day = tmrw.getDate(), month = tmrw.getMonth()+1 , year = tmrw.getFullYear()
        const strd = `${day<10?('0'+day):day}-${month<10?('0'+month):month}-${year}`
        const res = await fetch(SETU_URL+strd)
        if(res.ok){
            const data =await res.json()
            const sessions =await data.sessions
            let msg = ''
            sessions.forEach(s => {
                Object.keys(s).filter(e=>!(UNNECCESSARY_KEYS.includes(e))).forEach(k=>{
                    msg+=`${k}:${s[k]}\n`
                })
                msg+=SEPERATOR
            })
            if(lastMsg[i] !== msg && msg){
                msg.split(SEPERATOR).forEach(m=>{
                    if (m) {
                        bot.channels.cache.get(CHANNEL).send(msg+LINE_SEPERATOR)
                    }
                })
            }
            lastMsg[i] = msg
        }
    }
}

setInterval(fetchData, DELAY)