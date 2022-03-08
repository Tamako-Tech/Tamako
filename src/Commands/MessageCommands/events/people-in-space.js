const request = require('node-superfetch');

module.exports = {
    name: 'people-in-space',
    aliases: [],
    description: 'Responds with the people currently in space.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '',
    run: async (client, message, args, container) => {
        try {
            const { body } = await request.get('http://api.open-notify.org/astros.json');
            const crafts = {};
            for (const person of body.people) {
                if (crafts[person.craft]) crafts[person.craft].push(person.name);
                else crafts[person.craft] = [person.name];
            }
            const embed = new container.Discord.MessageEmbed()
                .setColor(0x2E528E)
                .setImage('https://i.imgur.com/m3ooNfl.jpg')
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            for (const [craft, people] of Object.entries(crafts)) {
                embed.addField(`❯ ${craft} (${people.length})`, people.join('\n'), true);
            }
            return message.reply({ content: `Oooh!Currently **${body.number}** people in space!`, embeds: [embed] });
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
