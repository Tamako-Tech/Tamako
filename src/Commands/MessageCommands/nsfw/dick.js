const fetch = require('node-fetch');

module.exports = {
    name: 'dickpic',
    aliases: [],
    description: 'For the women out there',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'NSFW',
    usage: '',
    run: async (client, message, args, container) => {
        if (!message.channel.nsfw) return message.reply('This channel is not NSFW!');
        try {
            const data = await fetch('https://reddit.com/r/HugeDickTinyChick.json').then(res => res.json()).catch(()=>{});
            
            const { data : { children } } = data;
    
            let res = children.filter( m => m.data.post_hint === 'image');

            const { data : { title, url, permalink, created_utc }  } = res[Math.floor(Math.random() * (res.length-1))];
    
            const embed = new container.Discord.MessageEmbed()
                .setAuthor({ name: title, iconURL: null, url: `https://www.reddit.com${permalink}` })
                .setColor('RED')
                .setImage(url)
                .setTimestamp(created_utc * 1000);

            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
