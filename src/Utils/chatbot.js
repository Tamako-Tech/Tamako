require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async (client, message, container) => {
    
    let prefixs = [];
    container.Config.prefix.forEach(prefix => {
        prefixs.push(prefix);
    });
    
    const mentionregexp = 'tamako';
    
    let mention = false;
    if (message.type === 'REPLY') {
        const msg1 = await message.fetchReference();
        if (msg1.author.id === client.user.id) {
            mention = true;
        }
    }

    if (message.content.toLowerCase().startsWith(mentionregexp) || mention) {
        if (message.content.toLowerCase() === mentionregexp) {
            return message.channel.send(`How may i help you, My prefix are are: \`${prefixs.join('`, `')}\``);
        } else {
            const input = message.content.replace(mentionregexp, '');

            if (!input.split(/ +/).filter(Boolean).length){
                return message.channel.reply('How may i help you?');
            }
            message.channel.sendTyping();

            const res = await fetch(`${process.env.API_URL}/api/chat&message=${encodeURIComponent(input)}`)
                .then(res => res.json())
                .catch(() => {});
  
            if (typeof res.message !== 'string'){
                return message.reply('???');
            }
            return message.reply(res.message);
        }
    } 
};