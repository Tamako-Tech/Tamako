const { join } = require('path');
const fetch = require('node-fetch');
const moment = require('moment');
const Paginate = require(join(__dirname, '..', '..', '..', '..', '..', 'Extensions', 'Paginate.js'));
const text = require(join(__dirname, '..', '..', '..', '..', '..', 'Utils', 'utilities.js'));
const weekdays = require(join(__dirname, '..', '..', '..', '..', '..', 'Utils', 'constants.js')).weeks;

module.exports = {
    name: 'schedule',
    aliases: [ 'anitoday' , 'airinglist' , 'airing' ],
    description: 'Displays the list of currently airing anime for today\'s date or given weekday.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: [ 'EMBED_LINKS' , 'ADD_REACTIONS' , 'USE_EXTERNAL_EMOJIS' ],
    category: 'Anime',
    usage: '',
    run: async (client, message, [ day ], container) => {

        if (!day || !weekdays.includes(day.toLowerCase())){
            day = weekdays[new Date().getDay()];
        }
  
        const embed = new container.Discord.MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
            .setDescription(`\u200B\n Fetching **${day}** anime schedules from <:mal:788322742058483734> [MyAnimeList](https://myanimelist.net 'MyAnimeList Homepage').\n\u200B`)
            .setFooter({text: `Schedule Query with MAL | ©️${new Date().getFullYear()} Tamako`});
  
        let msg = await message.channel.send({embeds: [embed]});
  
        let res = await fetch(`https://api.jikan.moe/v3/schedule/${day}`).then(res => res.json());
  
        if (!res || res.error){
            res = res ? res : {};
  
            embed.setColor('RED')
                .setAuthor({name: res.error === 'Bad Request' ? 'Unknown day' : 'Response Error', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                .setDescription([
                    `**${message.member.displayName}**, ${res.error === 'Bad Request' ? 'Could not recognize input' : 'An unexpected error occured!'}\n\n`,
                    `${res.error === 'Bad Request' ? `**${day}** seems to be an invalid day, please select from Monday - Sunday.` : (res.status)}`
                ].join(''))
                .setThumbnail('https://i.imgur.com/qkBQB8V.png');
  
            return await msg.edit(embed).catch(()=>null) || await message.channel.send(embed);
        }
  
        const elapsed = Date.now() - message.createdTimestamp;
        const pages = new Paginate();
  
        for ( const info of res[day] ){
            pages.add(
                new container.Discord.MessageEmbed()
                    .setColor('GREY')
                    .setThumbnail(info.image_url)
                    .setDescription([
                        `${info.score ? `**Score**:\u2000${info.score}\n`: ''}`,
                        `${info.genres.map(x => `[${x.name}](${x.url})`).join(' • ')}\n\n`,
                        `${text.truncate(info.synopsis,300,`...[Read More](${info.url})`)}`
                    ].join(''))
                    .setAuthor({name: info.title, iconURL: null, url: info.url})
                    .setFooter({text: [
                        `Search duration: ${Math.abs(elapsed / 1000).toFixed(2)} seconds`,
                        `Page ${pages.size === null ? 1 : pages.size + 1} of ${res[day].length}`,
                        `Schedule Query with MAL | ©️${new Date().getFullYear()} Tamako`
                    ].join('\u2000\u2000•\u2000\u2000')})
                    .addFields([
                        { name: 'Type',      value: info.type || 'Unknown', inline: true },
                        { name: 'Started',   value: moment(info.airing_start).format('dddd, do MMMM YYYY'), inline: true },
                        { name: 'Source',    value: info.source || 'Unknown' , inline: true },
                        { name: 'Producers', value: info.producers.map(x => `[${x.name}](${x.url})`).join(' • ') || 'None', inline: true },
                        { name: 'Licensors', value: info.licensors.join(' • ') || 'None', inline: true },
                        { name: '\u200b',    value: '\u200b',   inline: true }
                    ])
            );
        }
  
        msg = await msg.edit({embeds: [pages.currentPage]}).catch(()=>null) || await message.channel.send({embeds: [pages.currentPage]});
    
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
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */