const { join } = require('path');
const modifier = require(join(__dirname, '..', 'Utils', 'modifier.js'));

module.exports = {
    name: 'guildMemberAdd',
    run: async(member, client, container) => {
        const guildProfile = client.guildProfiles.get(member.guild.id);

        if (!guildProfile.greeter.welcome.isEnabled){
            return;
        } else if (!guildProfile.greeter.welcome.channel){
            return;
        } else if (!member.guild.channels.cache.get(guildProfile.greeter.welcome.channel)){
            return;
        } else {
            // Do nothing..
        }
      
        const welcome = guildProfile.greeter.welcome;
        const type = welcome.type === 'msg' && !welcome.message ? 'default' : welcome.type;
          
        if (type === 'default'){
            return client.channels.cache.get(guildProfile.greeter.welcome.channel).send({ 
                embeds: [new container.Discord.MessageEmbed()
                    .setColor('GREY')
                    .setTitle(`${member.user.tag} has joined our server!`)
                    .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
                    .setDescription(`Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${modifier.ordinalize(member.guild.memberCount)}** member!`)
                    .setFooter({text: `Member Greeter | ©️${new Date().getFullYear()} Tamako`})]
            });
        }
      
        //if message was text, send the text
        if (type === 'msg'){
            const message = await modifier.modify(guildProfile.greeter.welcome.message, member, client);
            return client.channels.cache.get(guildProfile.greeter.welcome.channel).send(message);
        }
      
        //if message was embed
        return client.channels.cache.get(guildProfile.greeter.welcome.channel).send({
            embeds: [new container.Discord.MessageEmbed(
                JSON.parse(
                    await modifier.modify(JSON.stringify(guildProfile.greeter.welcome.embed), member, client)))]
        });
    }
};