const { join } = require('path');

module.exports = {
    name: 'interactionCreate',
    run: async(interaction, client) => {
        const loadCommandOptions = require(join(__dirname, '..', 'Structures', 'CommandOptions', 'loadCommandOptions'));
        if (interaction.isButton()) loadCommandOptions(client, interaction, client.commands.buttonCommands.get(interaction.customId), true, 'Button');
        else if (interaction.isSelectMenu()) loadCommandOptions(client, interaction, client.commands.selectMenus.get(interaction.values[0] ?? interaction.customId), true, 'SelectMenus');
        else if (interaction.isCommand()) loadCommandOptions(client, interaction, client.commands.slashCommands.get(interaction.commandName), true, 'SlashCommand');
        else if (interaction.isContextMenu()) loadCommandOptions(client, interaction, client.commands.contextMenus.get(interaction.commandName), true, 'ContextMenus');
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
