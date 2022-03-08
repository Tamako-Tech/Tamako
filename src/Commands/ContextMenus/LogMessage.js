module.exports = {
    name: 'log',
    type: 'MESSAGE',
    run: async(client, interaction) => {
        console.log(interaction.channel.messages.cache.get(interaction.targetId) ?? await interaction.channel.messages.fetch(interaction.targetId));
        interaction.reply({
            content: 'Logged message to console.',
            ephemeral: true
        });
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */