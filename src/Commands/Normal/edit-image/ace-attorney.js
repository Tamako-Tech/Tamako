const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const { validate } = require(join(__dirname, '../../../Functions/types/string'));
const { list, firstUpperCase } = require(join(__dirname, '../../../Functions/Utils'));
const { wrapText } = require(join(__dirname, '../../../Functions/Canvas'));
const characters = {
    phoenix: ['phoenix', 'wright', 'naruhodo', 'ryuuichi', 'ryu', 'nick'],
    edgeworth: ['miles', 'edgeworth', 'mitsurugi', 'reiji', 'edgey'],
    godot: ['godot', 'diego', 'armando', 'souryuu', 'soryu', 'kaminogi'],
    apollo: ['apollo', 'justice', 'odoroki', 'housuke', 'hosuke']
};

module.exports = {
    name: 'ace-attorney',
    aliases: [
        'ace-attorney-dialogue',
        'aa-dialogue',
        'ace-attorney-dialog',
        'aa-dialog',
        'ace-attorney-quote',
        'aa-quote'
    ], 
    description: 'Sends a text box from Ace Attorney with the quote and character of your choice.',
    ownerOnly: false,
    cooldown: 3000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Edit-Image',
    usage: '[character] [quote]',
    run: async (client, message, [ character, ...quote ], Discord) => {
        if (!character) return message.reply(`What character do you want to use? Either ${list(Object.keys(characters), 'or')}.`);
        character = character.toLowerCase();
        if (quote > 250 || !quote) return message.reply('Specify a quote below or exactly 250 characters. Correct Usage: `ace-attorney [character] [quote]`');
        if (!validate(character, Object.values(characters).reduce((a, b) => a.concat(b)))) return message.reply(`Not a valid character. Either ${list(Object.keys(characters), 'or')}.`);
        let file;
        for (const [id, arr] of Object.entries(characters)) {
            if (!arr.includes(character.toLowerCase())) continue;
            file = id;
            break;
        }
        try {
            const base = await loadImage(
                join(__dirname, '../../../assets/images/ace-attorney', `${file}.png`)
            );
             
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '14px Ace Attorney';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'top';
            ctx.fillText(firstUpperCase(character), 6, 176);
            let text = await wrapText(ctx, quote, 242);
            text = text.length > 5 ? `${text.slice(0, 5).join('\n')}...` : text.join('\n');
            ctx.fillText(text, 7, 199);
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setImage(`attachment://ace-attorney-${character}.png`)
                .setFooter({ text: `Image Manipulation | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed], files: [{ attachment: canvas.toBuffer(), name: `ace-attorney-${character}.png` }] });
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

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
