const { join } = require('path');
const modifier = require(join(__dirname, '..', 'Utils', 'modifier.js'));

module.exports = {
    name: 'guildMemberRemove',
    run: async(member, client, container) => {
        const guildProfile = client.guildProfiles.get(member.guild.id);

        if (!guildProfile.greeter.leaving.isEnabled){
            return;
        } else if (!guildProfile.greeter.leaving.channel) {
            return;
        } else if (!member.guild.channels.cache.get(guildProfile.greeter.leaving.channel)){
            return;
        } else {
            // Do nothing..
        }
      
        const leaving = guildProfile.greeter.leaving;
        const type = leaving.type === 'msg' && !leaving.message ? 'default' : leaving.type;
      
        if (type === 'default'){
            return client.channels.cache.get(guildProfile.greeter.leaving.channel).send(
                {embeds: [
                    new container.Discord.MessageEmbed()
                        .setColor('GREY')
                        .setTitle(`${member.user.tag} has left our server!`)
                        .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
                        .setDescription(`Byebye ${member}!! Sad to see you go!\n\nWe are back to **${member.guild.memberCount}** members!`)
                        .setFooter({text: `Leaving Member Announcer | ©️${new Date().getFullYear()} Tamako`})
                ]}
            );
        }
      
        if (type === 'msg'){
            const message = await modifier.modify(guildProfile.greeter.leaving.message, member, client);
            return client.channels.cache.get(guildProfile.greeter.leaving.channel).send(message);
        }
      
        return client.channels.cache.get(guildProfile.greeter.leaving.channel).send({
            embeds: [new container.Discord.MessageEmbed(
                JSON.parse(
                    await modifier.modify(JSON.stringify(guildProfile.greeter.leaving.embed), member, client)))]
        });
    }
};