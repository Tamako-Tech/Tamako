require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async (client, message, container) => {
    if (message.author.bot) return;
    let prefixs = [];
    container.Config.prefix.forEach(prefix => {
        prefixs.push(prefix);
    });
    const mentionregexp = 'tamako';
    if (message.channel.type === 'DM'){
        return reply(message);
    }
    const id = client.guildProfiles.get(message.guild.id).chatbotChannel;
    const channel = message.guild.channels.cache.get(id);
    if (message.content.toLowerCase() === mentionregexp) return message.reply(`How may i help you, My prefix are are: \`${prefixs.join('`, `')}\`, the current chatbot channel is set to: ${channel || 'None'}`);
    if (!channel) return;
    if (!(message.channel.id === channel.id)) return;
    let mention = false;
    if (message.type === 'REPLY') {
        const msg1 = await message.fetchReference();
        if (msg1.author.id === client.user.id) {
            mention = true;
        }
    }
    
    if (message.content.toLowerCase() === mentionregexp) {
        return message.channel.send(`How may i help you, My prefix are are: \`${prefixs.join('`, `')}\``);
    } else {
        return reply(message);
    }

};

async function reply(message) {
    const input = message.content;

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

    // send resp
    return message.reply(res.message);
}