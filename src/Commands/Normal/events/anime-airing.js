const { join } = require('path');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const moment = require('moment-timezone');
const { today, tomorrow } = require(join(__dirname, '../../../Functions/Utils'));
const airingGraphQL = stripIndents`
	query AiringSchedule($greater: Int, $lower: Int) {
		anime: Page {
			results: airingSchedules(airingAt_greater: $greater, airingAt_lesser: $lower) {
				airingAt
				media {
					id
					title {
						english
						romaji
					}
				}
			}
		}
	}
`;

module.exports = {
    name: 'anime-airing',
    aliases: ['anichart', 'airing-anime', 'seasonal-anime', 'anime-seasonal'],
    description: 'Responds with a list of the anime that air today.',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Events',
    usage: '',
    run: async (client, message, args, Discord) => {
        try {
            const anime = await getList();
            if (!anime) return message.reply('No anime air today...');
            const mapped = anime.sort((a, b) => a.airingAt - b.airingAt).map(ani => {
                const title = ani.media.title.english || ani.media.title.romaji;
                const airingAt = moment(ani.airingAt * 1000).tz('Asia/Tokyo').format('h:mm A');
                return `• ${title} (@${airingAt} JST)`;
            });

            const embed = new Discord.MessageEmbed()
                .setColor('#94ebcd')
                .setTitle(`${moment().tz('Asia/Tokyo').format('dddd, MMMM Do, YYYY')}`)
                .setAuthor('Anime Airing')
                .setDescription(`${mapped.join('\n')}`)
                .setFooter({ text: `Event Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            return message.reply({ embeds: [embed] });
        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};

async function getList() {
    const { body } = await request
        .post('https://graphql.anilist.co/')
        .send({
            variables: {
                greater: Number.parseInt(today(9).getTime() / 1000, 10),
                lower: Number.parseInt(tomorrow(9).getTime() / 1000, 10)
            },
            query: airingGraphQL
        });
    if (!body.data.anime.results.length) return null;
    return body.data.anime.results;
}


/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
