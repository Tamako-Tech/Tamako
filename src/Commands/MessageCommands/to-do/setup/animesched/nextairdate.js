const { join } = require('path');
const { duration } = require('moment');

const withQuery = require('require-text')(join(__dirname, '..', '..', '..', '..', '..', 'assets', 'graphql', 'AirDateQuery.graphql'), require);
const withoutQuery = require('require-text')(join(__dirname, '..', '..', '..', '..', '..', 'assets', 'graphql', 'AirDateNoQuery.graphql'), require);

module.exports = {
    name: 'nextairdate',
    aliases: [ 'nextairing', 'nextair', 'nextep', 'nextepisode' ],
    description: 'Displays the list of currently airing anime for today\'s date or given weekday.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' , 'ADD_REACTIONS' , 'USE_EXTERNAL_EMOJIS' ],
    category: 'Anime',
    usage: '',
    run: async (client, message, args, container) => {

        const search = args.join(' ') || null;
        const query = search ? withQuery : withoutQuery;
        const variables = search ? { search , status: 'RELEASING'} : {};
    
        const res = await client.anischedule.fetch(query, variables);
    
        const embed = new container.Discord.MessageEmbed()
            .setColor('RED')
            .setThumbnail('https://i.imgur.com/qkBQB8V.png')
            .setFooter({text: `Airdate Query with AL | ©️${new Date().getFullYear()} Tamako`});
    
            
        if (res.errors && res.errors.some(e => e.message !== 'Not Found.')){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'Response Error', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.member.displayName}**, An unexpected error has occured!\n\n`,
                        `${res.errors.map(({ message }) => '• ' + message).join('\n')}`,
                        'Please try again in a few minutes. This is usually caused by a server downtime.'
                    ].join(''))
            ]});
        }
    
        if (res.errors && res.errors.some(e => e.message === 'Not Found.')){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'None Found', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.member.displayName}**, That anime may have already **Finished Airing**, `,
                        'have **unknown next Airdate**, or that anime may have **never existed** at all!'
                    ].join(''))
            ]});
        }
    
        const [ now, next, later ] = [ res.data.Media || res.data.Page.media ].flat().filter(x => x.nextAiringEpisode).sort((A,B) => A.nextAiringEpisode.timeUntilAiring - B.nextAiringEpisode.timeUntilAiring );
    
        if (!now){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'None Found', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.member.displayName}**, That anime may have already **Finished Airing**, `,
                        'have **unknown next Airdate**, or that anime may have **never existed** at all!'
                    ].join(''))
            ]});
        } else if (variables.status){
            return message.channel.send({embeds: [
                embed.setAuthor({name: '', iconURL: null})
                    .setColor(now.coverImage.color)
                    .setThumbnail(now.coverImage.large)
                    .setTitle(now.title.english || now.title.romaji || now.title.native)
                    .setDescription([
                        `${now.title.native || '*'} \n`,
                        `${now.title.romaji || '*'} \n\n`,
                        now.nextAiringEpisode ? [
                            `Episode **${now.episodes === now.nextAiringEpisode.episode ? `${now.nextAiringEpisode.episode} (Final Episode)` : now.nextAiringEpisode.episode}**`,
                            `of [${now.title.english || now.title.romaji || now.title.native}](${now.siteUrl})`,
                            `will air in approximately **${duration(now.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**\n\n`,
                        ].join(' ') : [
                            `Next episode airdate for [${now.title.english || now.title.romaji || now.title.native}](${now.siteUrl})`,
                            'is currently unknown.'
                        ].join(' '),
                        `${now.id}\u2000|\u2000${now.studios.edges.map(x => `[${x.node.name}](${x.node.siteUrl})`).join('\u2000|\u2000')}`
                    ].join(''))
            ]});
        } else {
            return message.channel.send({embeds: [
                embed.setColor(now.coverImage.color || next.coverImage.color || later.coverImage.color )
                    .setThumbnail(now.coverImage.large)
                    .setAuthor({name: `Airs next\u2000|\u2000${now.title.english || now.title.romaji || now.title.native}.`, iconURL: null, url: now.siteUrl})
                    .setDescription([
                        [
                            `[**${now.title.english || now.title.romaji || now.title.native}**](${now.siteUrl})`,
                            `\u2000\u2000*${now.title.english ? now.title.romaji : now.title.native}*`,
                            `\u2000\u2000*${now.title.romaji ? now.title.native : '~'}*`
                        ].join('\n'),
                        now.nextAiringEpisode.timeUntilAiring ? [
                            `Episode **${now.episodes === now.nextAiringEpisode.episode ? `${now.nextAiringEpisode.episode} (Final Episode)` : now.nextAiringEpisode.episode}**`,
                            `airs in **${duration(now.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**.\n\u200b`
                        ].join(' ') : 'Next episode is currently **Unknown**.\n\u200b'
                    ].join('\n'))
                    .addFields([
                        {
                            name: 'Airs Later',
                            value: next ? [
                                [
                                    `[**${next.title.english || next.title.romaji || next.title.native}**](${next.siteUrl})`,
                                    `\u2000\u2000*${next.title.english ? next.title.romaji : next.title.native}*`,
                                    `\u2000\u2000*${next.title.romaji ? next.title.native : '~'}*`
                                ].join('\n'),
                                next.nextAiringEpisode.timeUntilAiring ? [
                                    `Episode **${next.episodes === next.nextAiringEpisode.episode ? `${next.nextAiringEpisode.episode} (Final Episode)` : next.nextAiringEpisode.episode}**`,
                                    `airs in **${duration(next.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**.\n\u200b`
                                ].join(' ') : 'Next episode is currently **Unknown**.\n\u200b'
                            ].join('\n') : 'No Anime were found on the next 7 days.\n\u200b'
                        },{
                            name: 'Airs Later',
                            value: later ? [
                                [
                                    `[**${later.title.english || later.title.romaji || later.title.native}**](${later.siteUrl})`,
                                    `\u2000\u2000*${later.title.english ? later.title.romaji : later.title.native}*`,
                                    `\u2000\u2000*${later.title.romaji ? later.title.native : '~'}*`
                                ].join('\n'),
                                later.nextAiringEpisode.timeUntilAiring ? [
                                    `Episode **${later.episodes === later.nextAiringEpisode.episode ? `${later.nextAiringEpisode.episode} (Final Episode)` : later.nextAiringEpisode.episode}**`,
                                    `airs in **${duration(later.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours and] m [minutes]')}**.`
                                ].join(' ') : 'Next episode is currently **Unknown**.'
                            ].join('\n') : 'No Anime were found on the next 7 days.'
                        }
                    ])
            ]});
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