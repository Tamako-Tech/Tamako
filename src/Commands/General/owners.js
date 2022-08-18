const { EmbedBuilder } = require('discord.js')

module.exports = {
  config: {
    name: 'owners',
    description: 'Replies with the registered owners only.'
  },
  permissions: ['SendMessages'], // Since the "owner" is TRUE, then we can set the permissions to 'sendMessages'.
  owner: true,
  run: async (client, message, args, prefix, config) => {
    const ownersID = config.Users.OWNERS
    if (!ownersID) return

    const ownersARRAY = []

    ownersID.forEach(Owner => {
      const fetchedOWNER = message.guild.members.cache.get(Owner)
      if (!fetchedOWNER) ownersARRAY.push('*Bear#3437*')
      ownersARRAY.push(`${fetchedOWNER.user.tag}`)
    })

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Yellow')
          .setDescription(`Only owners command! \nOwners: **${ownersARRAY.join(', ')}**`)
          .setFooter({ text: `©️ ${new Date().getFullYear()} Tamako Tech`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      ]
    })
  }
}
