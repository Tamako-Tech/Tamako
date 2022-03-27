const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'suggest',
    aliases: [],
    description: 'Suggest something for the server. If you have suggestion for the bot instead please use the feedback command or join our support server',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Core',
    usage: '',
    run: async (client, message, args) => {

        const embed = new MessageEmbed()
            .setFooter({text: `Suggest | ©️${new Date().getFullYear()} Tamako`})
            .setColor('RED');

        if (!args.length){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'No Message', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription(`**${message.member.displayName}**, Please include your **suggestion message**!`)
                    .addField('Example', '```t!suggest Please remove some inactive members...```')
            ]});
        }

        const id = client.guildProfiles.get(message.guild.id).suggestChannel;
        const channel = message.guild.channels.cache.get(id);

        if (!channel){
            return message.channel.send({ embeds: [
                embed.setAuthor({name: 'Channel Not Found!', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.member.displayName}**, could not find **Suggestion Channel** for this server!\n`,
                        'If you are a server administrator, you may set the channel by typing:',
                        `\`${client.config.prefix}setsuggestch <channel ID | channel mention>\``
                    ].join('\n'))
            ]});
        }

        if (!channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS')){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'Missing Permissions', iconURL:'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.member.displayName}**, The channel ${channel} does not allow me to post your suggestion there!`,
                        'I need to have the following permissions: `View Channel`, `Send Messages`, and `Embed Links`\n\n',
                        'If you are a server administrator/moderator, please change my permission overwrites on the aformentioned channel.'
                    ].join(''))
            ]});
        }

        return channel.send({embeds: [
            embed.setTitle(`${message.member.displayName}'s Suggestion`)
                .setColor('YELLOW')
                .setDescription(args.join(' '))
                .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true}))
                .addField('Status', 'Under Review', true)
        ]}).then(async suggestion => {
            await message.react('✅').catch(() => {});
            await suggestion.react('⬆️').catch(() => {});
            await suggestion.react('⬇️').catch(() => {});
            return;
        });
    }
};