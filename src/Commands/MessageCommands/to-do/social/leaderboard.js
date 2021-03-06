const { join } = require('path');
const profile = require(join(__dirname, '..', '..', '..', '..', 'Models', 'Profile.js'));
const text = require(join(__dirname, '..', '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'leaderboard',
    aliases: [ 'lb', 'topxp' ],
    description: 'Shows the top xp earners for this server',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Social',
    usage: '',
    run: async (client, message, args, container) => {
        try {
            
            const { exceptions, isActive } = client.guildProfiles.get(message.guild.id).xp;
            const embed = new container.Discord.MessageEmbed()
                .setFooter({text: `XP Leaderboard | ©️${new Date().getFullYear()} Tamako`})
                .setThumbnail('https://i.imgur.com/qkBQB8V.png')
                .setColor('RED');

            if (!isActive){
                return message.channel.send({
                    embeds: [
                        embed.setDescription([
                            `**${message.member.displayName}**, XP is currently disabled in this server.\n`,
                            `If you are the server Administrator, you may enable it by typing \`${container.Config.prefix[0]}xptoggle\`.`,
                            '[Learn More](https://tamako.tech/docs/Setup/XP_System) about Tamako\'s XP System.'
                        ].join('\n'))
                            .setAuthor({name: 'XP Systems Disabled', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    ]});
            }

            if (exceptions.includes(message.channel.id)){
                return message.channel.send({
                    embeds: [
                        embed.setDescription([
                            `**${message.member.displayName}**, XP is currently disabled in this channel.\n`,
                            `To see which channels are xp-disabled, use the command \`${container.Config.prefix[0]}nonxpchannels\``,
                            `If you are the server Administrator, you may reenable it here by typing \`${container.Config.prefix[0]}xpenable #${message.channel.name}\``,
                            '[Learn More](https://tamako.tech/docs/Setup/XP_System) about Tamako\'s XP System.'
                        ].join('\n'))
                            .setAuthor({name: 'Channel Blacklisted', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    ]});
            }

            return profile.find({ 'data.xp.id': message.guild.id }, async (err, docs) => {
                if (err) {
                    return message.channel.send({ embeds: [
                        embed.setAuthor({name: 'Database Error', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                            .setDescription('Tamako\'s Database Provider responded with an error: ' + err.name)
                    ]});
                }

                docs = docs.map(x => { return { id: x._id, data: x.data.xp.find(x => x.id === message.guild.id)};})
                    .sort((A,B) => B.data.xp - A.data.xp) // Arrange by points, descending.
                    .filter(x => x.data.xp); // Remove document where xp is 0.

                if (!docs.length){
                    return message.channel.send({ embeds: [
                        embed.setDescription([
                            `**${message.member.displayName}**, No XP found.\n\n`,
                            'Users in this server have not started earning XP yet!\n',
                            '[Learn More](https://tamako.tech/docs/Setup/XP_System) about Tamako\'s XP System.'
                        ].join('\n'))
                            .setAuthor({name: 'No XP', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    ]});
                }

                const members = await message.guild.members
                    .fetch({ user: docs.slice(0,10).map(x => x.id) })
                    .catch(() => null);

                return message.channel.send({ embeds: [
                    new container.Discord.MessageEmbed()
                        .setColor('GREY')
                        .setFooter({text: `XP Leaderboard | ©️${new Date().getFullYear()} Tamako`})
                        .setAuthor({name: `🏆 ${message.guild.name} Leaderboard`, iconURL: message.guild.iconURL({format: 'png', dynamic: true }) || null})
                        .addField(`**${members.get(docs[0].id)?.displayName || '<Unknown User>'}** ranked the highest with **${text.commatize(docs[0].data.xp)}**XP!`,
                            [
                                '```properties',
                                '╭═══════╤═══════╤════════╤════════════════════════════╮',
                                '┃  Rank ┃ Level ┃     XP ┃ User                       ┃',
                                '╞═══════╪═══════╪════════╪════════════════════════════╡',
                                docs.slice(0,10).map((u,i) => {
                                    const rank = String(i+1);
                                    return [
                                        '┃' + ' '.repeat(6-rank.length) + rank,
                                        ' '.repeat(5-String(u.data.level).length) + u.data.level,
                                        ' '.repeat(6-text.compactNum(u.data.xp).length) + text.compactNum(u.data.xp),
                                        members.get(u.id)?.user.tag || '<Unknown User>'
                                    ].join(' ┃ ');
                                }).join('\n'),
                                '╞═══════╪═══════╪════════╪════════════════════════════╡',
                                docs.filter(x => x.id === message.author.id).map((u,i,a) => {
                                    const user = a.find(x => x.id === message.author.id);
                                    const rank = docs.findIndex(x => x.id === message.author.id) + 1;
                                    return [
                                        '┃' + ' '.repeat(6-text.ordinalize(rank).length) + text.ordinalize(rank),
                                        ' '.repeat(5-String(u.data.level).length) + u.data.level,
                                        ' '.repeat(6-text.compactNum(u.data.xp).length) + text.compactNum(u.data.xp),
                                        text.truncate('You (' + message.author.tag + ')', 26) + ' '.repeat(27-text.truncate('You (' + message.author.tag + ')', 26).length) + '┃'
                                    ].join(' ┃ ');
                                }).join(''),
                                '╰═══════╧═══════╧════════╧════════════════════════════╯',
                                '```'
                            ].join('\n'))
                ]});
            });
        
        } catch (err) {
            return message.channel.send(`Error: ${err.message}`);
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