const { join } = require('path');
const request = require('node-superfetch');
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'user.js'));

module.exports = {
    name: 'midfing',
    aliases: [],
    description: 'Use this to throw someone off. No seriously, it\'s a joke!',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Roleplay',
    usage: '[user]',
    run: async (client, message, [ user ], container) => {
        if(!user) return message.reply(`${message.author} you need to specify a user to show your mid finger to!`);       
        if (!validate(user, message)) return message.reply('Please provide a valid user.');
        user = parse(user, message);

        try {

            if (user.id === message.author.id) return message.reply(`${message.author}, why are you showing middle finger to yourself? NANI?!`);
            if (user.id === client.user.id) { 
                const data = await request.get(`${process.env.API_URL}/api/roleplay/baka`)
                    .then(res => res.json())
                    .catch(() => {});

                const embed = new container.Discord.MessageEmbed()
                    .setColor('#FFB6C1')
                    .setImage(data.body.url)
                    .setDescription(`${message.author}`)
                    .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
    

                return message.reply({ embeds: [embed] });
            }

            const data = await request.get(`${process.env.API_URL}/api/roleplay/midfing`);
    
            const embed = new container.Discord.MessageEmbed()
                .setColor('#FFB6C1')
                .setImage(data.body.url)
                .setDescription(`${message.author}: "Hey ${user}!"`)
                .setFooter({ text: `Roleplay Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
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
