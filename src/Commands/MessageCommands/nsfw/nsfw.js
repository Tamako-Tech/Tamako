const nekos = require('nekos.life');
const validTypes = ['anal', 'avatar', 'bJ', 'blowJob', 'boobs', 'classic', 'cumArts', 'cumsluts', 'ero', 'eroFeet', 'eroKemonomimi', 'eroKitsune', 'eroNeko', 'eroYuri', 'feet', 'feetGif', 'femdom', 'futanari', 'girlSolo', 'girlSoloGif', 'hentai', 'holo', 'holoEro', 'kemonomimi', 'keta', 'kitsune', 'kuni', 'lesbian', 'neko', 'nekoGif', 'pussy', 'pussyArt', 'pussyWankGif', 'randomHentaiGif', 'yuri', 'tits', 'trap'];


module.exports = {
    name: 'nsfw',
    aliases: [],
    description: 'Generate random anime nsfw image depending on the category.\n\nHere are the complete list of categories:\n\n`anal`, `avatar`, `bJ`, `blowJob`, `boobs`, `classic`, `cumArts`, `cumsluts`, `ero`, `eroFeet`, `eroKemonomimi`, `eroKitsune`, `eroNeko`, `eroYuri`, `feet`, `feetGif`, `femdom`, `futanari`, `girlSolo`, `girlSoloGif`, `hentai`, `holo`, `holoEro`, `kemonomimi`, `keta`, `kitsune`, `kuni`, `lesbian`, `neko`, `nekoGif`, `pussy`, `pussyArt`, `pussyWankGif`, `randomHentaiGif`, `yuri`, `tits`, `trap`',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'NSFW',
    usage: '',
    run: async (client, message, [ type ], container) => {
        if (!message.channel.nsfw) return message.reply('This channel is not NSFW!');
        try {
            if (!type) type = validTypes[Math.floor(Math.random() * (validTypes.length - 1))];

            if (['category','categories','type','types','help'].includes(type.toLowerCase())) {
                const embed2 = new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setAuthor('NSFW Valid Types / Categories list')
                    .setDescription(validTypes.join(', '))
                    .addField('\u200B','*Types and / or Categories are case sensitive.');
                return message.channel.send({ embeds: [embed2] });
            }
        
            if (!validTypes.includes(type)) {
        
                let alt = validTypes.find(m => m.toLowerCase() === type.toLowerCase());
                client.cooldowns.get('nsfw').delete(message.author.id);
                return message.channel.send(`**${type}** category was not found on NSFW categories list. ${alt ? `Did you mean **${alt}**?` : ''}`);
        
            }
        
            const { nsfw } = new nekos();
        
            const { url } = await nsfw[type]().catch(()=>{});
        
            if (!url) return message.channel.send('Could not connect to nekos.life');
            const embed = new container.Discord.MessageEmbed()
                .setAuthor({ name: type, iconURL: null, url: url})
                .setImage(url)
                .setColor('RED');

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
