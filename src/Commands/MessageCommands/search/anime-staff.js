const { join } = require('path');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { embedURL, cleanAnilistHTML, trimArray} = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));
const searchGraphQL = stripIndents`
	query ($search: String) {
		staff: Page (perPage: 1) {
			results: staff (search: $search) { id }
		}
	}
`;
const resultGraphQL = stripIndents`
query ($id: Int!) {
    Staff (id: $id) {
        id
        name {
            first
            last
        }
        image {
            large
            medium
        }
        description(asHtml: false)
        siteUrl
        characterMedia(page: 1, perPage: 25) {
            edges {
                node {
                    title {
                        english
                        romaji
                    }
                    type
                    siteUrl
                }
                characterRole
                staffRole
            }
        }
        staffMedia(page: 1, perPage: 25) {
            edges {
                node {
                    title {
                        english
                        romaji
                    }
                    type
                    siteUrl
                }
                staffRole
            }
        }
    }
}
`;
const types = {
    ANIME: 'Anime',
    MANGA: 'Manga'
};
const roles = {
    MAIN: 'Main',
    SUPPORTING: 'Supporting',
    BACKGROUND: 'Background'
};

module.exports = {
    name: 'anime-staff',
    aliases: ['anilist-staff', 'manga-staff', 'ani-staff'],
    description: 'Searches AniList for your query, getting staff results.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Search',
    usage: '[name]',
    run: async (client, message, [ ...query ], container) => {
        if (!query) return message.reply('What staff member would you like to search for?');
        try {
            const id = await search(query.join(' '));
            if (!id) return message.reply('Could not find any results.');
            const staff = await fetchStaff(id);
            const embed = new container.Discord.MessageEmbed()
                .setColor(0x02A9FF)
                .setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
                .setURL(staff.siteUrl)
                .setThumbnail(staff.image.large || staff.image.medium || null)
                .setTitle(`${staff.name.first || ''}${staff.name.last ? ` ${staff.name.last}` : ''}`)
                .setDescription(staff.description ? cleanAnilistHTML(staff.description, false) : 'No description.')
                .addField('❯ Voice Roles',
                    staff.characterMedia.edges.length ? trimArray(staff.characterMedia.edges.map(edge => {
                        const title = edge.node.title.english || edge.node.title.romaji;
                        return embedURL(`${title} (${roles[edge.characterRole]})`, edge.node.siteUrl);
                    }), 5).join(', ') : 'None')
                .addField('❯ Production Roles',
                    staff.staffMedia.edges.length ? trimArray(staff.staffMedia.edges.map(edge => {
                        const title = edge.node.title.english || edge.node.title.romaji;
                        return embedURL(`${title} (${types[edge.node.type]})`, edge.node.siteUrl);
                    }), 5).join(', ') : 'None')
                .setFooter({ text: `Search Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
            
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

async function search(query) {
    const { body } = await request
        .post('https://graphql.anilist.co/')
        .send({
            variables: { search: query },
            query: searchGraphQL
        });
    if (!body.data.staff.results.length) return null;
    return body.data.staff.results[0].id;
}

async function fetchStaff(id) {
    const { body } = await request
        .post('https://graphql.anilist.co/')
        .send({
            variables: { id },
            query: resultGraphQL
        });
    return body.data.Staff;
}


/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
