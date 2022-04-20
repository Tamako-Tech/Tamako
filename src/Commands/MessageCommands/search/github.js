const request = require('node-superfetch');
const moment = require('moment');
const { join } = require('path');
const { formatNumber, shorten } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'github',
    aliases: ['repo', 'gh'],
    description: 'Responds with information on a GitHub repository.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '<author> <repo>',
    run: async (client, message, [ author, repository ], container) => {
        if (!author || !repository ) return message.reply('You must provide an author and repository name.');
        try {
            const { body } = await request
                .get(`https://api.github.com/repos/${author}/${repository}`)
                .set({ Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}` });
            const embed = new container.Discord.MessageEmbed()
                .setColor(0xFFFFFF)
                .setAuthor({name: 'GitHub', iconURL: 'https://i.imgur.com/e4HunUm.png', url:'https://github.com/'})
                .setTitle(body.full_name)
                .setURL(body.html_url)
                .setDescription(body.description ? shorten(body.description) : 'No description.')
                .setThumbnail(body.owner.avatar_url)
                .addField('❯ Stars', formatNumber(body.stargazers_count), true)
                .addField('❯ Forks', formatNumber(body.forks), true)
                .addField('❯ Issues', formatNumber(body.open_issues), true)
                .addField('❯ Language', body.language || '???', true)
                .addField('❯ Creation Date', moment.utc(body.created_at).format('MM/DD/YYYY h:mm A'), true)
                .addField('❯ Modification Date', moment.utc(body.updated_at).format('MM/DD/YYYY h:mm A'), true)
                .setFooter({ text: `Search Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.channel.send({ embeds: [embed]});
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
