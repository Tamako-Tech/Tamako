const { join } = require('path');
const _ = require('lodash');
const watching = require('require-text')(join(__dirname, '..', '..', '..', '..', '..', 'assets', 'graphql', 'Watching.graphql'), require);
const list = require(join(__dirname, '..', '..', '..', '..', '..', 'Models', 'GuildWatchlist.js'));
const Page = require(join(__dirname, '..', '..', '..', '..', '..', 'Extensions', 'Paginate.js'));
const text = require(join(__dirname, '..', '..', '..', '..', '..', 'Utils', 'utilities.js'));
module.exports = {
    name: 'watching',
    aliases: [ 'watchlist' ],
    description: 'View list of anime this server is subscribed to.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' ],
    category: 'Anime',
    usage: '',
    run: (client, message, args, container) => list.findById(message.guild.id, async (err, doc) => {

        if (err){
            return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
        } else if (!doc){
            doc = new list({ _id: message.guild.id });
        }
    
        const embed = new container.Discord.MessageEmbed()
            .setColor('RED')
            .setFooter({text: `Anischedule Watchlist | ©️${new Date().getFullYear()} Tamako`});
    
        const anischedch = message.guild.channels.cache.get(doc.channelID);
    
        if (!anischedch){
            return message.channel.send(`\\❌ **${message.member.displayName}**, This server's anischedule feature has been disabled.`);
        } else if (!doc.data.length){
            return message.channel.send({ embeds: [
                embed.setAuthor({name: 'No Subscription', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription(`**${message.member.displayName}**, this server has no anischedule entries yet.`)
            ]});
        } else {
            const entries = [];
            const watched = doc.data;
            let page = 0;
            let hasNextPage = false;
    
            do {
                const res = await client.anischedule.fetch(watching, {watched, page});
    
                if (res.errors){
                    return message.channel.send({ embeds: [
                        embed.setAuthor({name: 'AniList Error', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                            .setDescription('Received error from anilist:\n' + res.errors.map(x => x.message).join('\n'))
                    ]});
                } else if (!entries.length && !res.data.Page.media.length){
                    return message.channel.send({ embeds: [
                        embed.setAuthor({name: 'No Subscription', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                            .setDescription(`**${message.member.displayName}**, this server has no anischedule entries yet.`)
                    ]});
                } else {
                    page = res.data.Page.pageInfo.currentPage + 1;
                    hasNextPage = res.data.Page.pageInfo.hasNextPage;
                    entries.push(...res.data.Page.media.filter(x => 
                        x.status === 'RELEASING' || x.status === 'FINISHED' || x.status === 'NOT_YET_RELEASED'
                    ));  
                }
            } while (hasNextPage);
    
            const chunks = entries.sort((A,B) => A.id - B.id).map(entry => {
                const id = ' '.repeat(6 - String(entry.id).length) + String(entry.id);
                const title = text.truncate(entry.title.romaji, 42, '...');
                return `•\u2000\u2000\`[ ${id} ]\` [**${title}**](${entry.siteUrl})`;
            });
            const descriptions = _.chunk(chunks, 20).map( d => d.join('\n'));
            if (descriptions.length === 1) return message.reply('This server has no anischedule entries yet.');
            const pages = new Page(descriptions.map((d,i) => {
                if (d.length === 0) d = 'Not Found';
                return new container.Discord.MessageEmbed()
                    .setColor('GREY')
                    .setDescription(d)
                    .setTitle(`Current Anischedule Subscription (${entries.length} entries!)`)
                    .setFooter({ text: [
                        'Anischedule Watchlist',
                        `Page ${i + 1} of ${descriptions.length}`,
                        `©️${new Date().getFullYear()} Tamako`
                    ].join('\u2000\u2000•\u2000\u2000')})
                    .addField('Tips', [
                        `- Use [\`${container.Config.prefix[0]}watch\`](https://vigilant-raman-0c38fd.netlify.app/docs/Setup/Anischedule#adding-more-to-the-list) to add subscription`,
                        `- Use [\`${container.Config.prefix[0]}unwatch\`](https://vigilant-raman-0c38fd.netlify.app/docs/Setup/Anischedule#removing-anime-from-the-list) to remove subscription`,
                        `- Use \`${container.Config.prefix[0]}nextep <anime title>\` to check episode countdown`
                    ].join('\n'));
            }));
    
            const msg = await message.channel.send({embeds: [pages.firstPage]});
    
            if (pages.size === 1){
                return;
            }
    
            const prev = '◀';
            const next = '▶';
            const terminate = '❌';
    
            const filter = (reaction, user) => {
                return reaction.emoji.name && user.id === message.author.id;
            };
            const collector = msg.createReactionCollector({ filter, time: 90000 });
            const navigators = [ prev, next, terminate ];
            let timeout = setTimeout(()=> collector.stop(), 90000);
    
            for (let i = 0; i < navigators.length; i++) {
                await msg.react(navigators[i]);
            }
     
            collector.on('collect', async (reaction) => {
                switch(reaction.emoji.name){
                case prev:
                    msg.edit({embeds: [pages.previous()]});
                    break;
                case next:
                    msg.edit({embeds: [pages.next()]});
                    break;
                case terminate:
                    collector.stop();
                    break;
                }
                await reaction.users.remove(message.author.id);
                timeout.refresh();
    
            });
        
            collector.on('end', async () => await msg.reactions.removeAll());
            return; 
        }
    })
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */