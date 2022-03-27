module.exports = {
    name: 'respond',
    aliases: [],
    description: 'Respond to user suggestion',
    ownerOnly: false,
    cooldown: 0,
    userPermissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    clientPermissions: ['SEND_MESSAGES'],
    category: 'Moderation',
    usage: '<user> [time] [reason]',
    run: async (client, message, [id, action = '', ...reason], container) => {
        if (!reason) reason = 'No reason provided';
        
        const channelID = (client.guildProfiles
            .get(message.guild.id) || {})
            .featuredChannels.suggest;
  
        const embed = new container.Discord.MessageEmbed()
            .setColor('RED')
            .setFooter({text: `Respond to Suggestion | ©️${new Date().getFullYear()} Tamako`});
  
        if (!channelID){
            return message.channel.send({ embeds: [
                embed.setAuthor({name: 'Suggest Channel not Set!', iconURL:'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.author.tag}**, the **Suggestion Channel** for this server has not been set!`,
                        'If you are a server administrator, you may set the channel by typing:\n',
                        `\`${container.Config.prefix[0]}setsuggestch <channel ID | channel mention>\``
                    ].join('\n'))
            ]});
        }
  
        const channel = message.guild.channels.cache.get(channelID);
  
        if (!channelID){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'Suggest Channel Invalid!', iconURL:'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription([
                        `**${message.author.tag}**, the **Suggestion Channel** for this server was invalidated.`,
                        'If you are a server administrator, you may set the channel again by typing:\n',
                        `\`${container.Config.prefix[0]}setsuggestch <channel ID | channel mention>\``
                    ].join('\n'))
            ]});
        }
  
        if (!id){
            return message.channel.send({embeds: [
                embed.setDescription('You need to supply the **message ID** of the suggestion')
                    .setAuthor({name: 'Message ID not Found!', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
            ]});
        }
  
        if (!['accept', 'deny'].includes(action.toLowerCase())){
            return message.channel.send({embeds: [
                embed.setDescription('Please specify if you want to `accept` or `deny` the suggestion')
                    .setAuthor({name: 'Response Undefined!', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
            ]});
        }
  
        if (!reason.length || reason.join(' ').length > 1024){
            return message.channel.send({embeds: [
                embed.setDescription('You need to supply a reason not exceeding 1024 characters')
                    .setAuthor({name: 'Could not parse response reason!', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
            ]});
        }
  
        const suggestion = await channel.messages.fetch(id).catch(() => undefined);
  
        if (!suggestion ||
        suggestion.author.id !== client.user.id ||
        !suggestion.embeds.length ||
        !(suggestion.embeds[0].title || '').endsWith('Suggestion')
        ){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'Suggestion not Found', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription(`I can't seem to find the suggestion with the message ID **${id}** in **${channel}**.`)
            ]});
        }
  
        if (suggestion.embeds[0].fields.length > 1){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'Suggestion already responded with', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription(`**${suggestion.embeds[0].fields[0].value.replace('Accepted by','')}** already responded to this suggestion!`)
            ]});
        }
  
        if (!suggestion.editable){
            return message.channel.send({embeds: [
                embed.setAuthor({name: 'Suggestion can\'t be edited.', iconURL: 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'})
                    .setDescription('The suggestion has somehow been invalidated (cause unknown)')
            ]});
        }
  
        suggestion.embeds[0].fields[0].value = action.toLowerCase() === 'accept'
            ? `Accepted by **${message.author.tag}**`
            : `Denied by **${message.author.tag}**`;
  
        return suggestion.edit({embeds: [
            new container.Discord.MessageEmbed(suggestion.embeds[0])
                .setColor(action.toLowerCase() === 'accept' ? 'GREEN' : 'RED')
                .addField('Reason', reason.join(' '))
        ]}).then(()=> message.react('✅'))
            .catch(()=> embed.setAuthor('Suggestion can\'t be edited.', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
                .setDescription('The suggestion has somehow been invalidated (cause unknown)'));
    }
};