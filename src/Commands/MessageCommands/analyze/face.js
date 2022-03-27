const { join } = require('path');
const request = require('node-superfetch');
const emotions = ['anger', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise'];
const emotionResponse = ['angry', 'disgusted', 'afraid', 'happy', 'uncaring', 'sad', 'surprised'];
const { validate, parse } = require(join(__dirname, '..', '..', '..', 'Utils', 'types', 'image.js'));
const { base64 } = require(join(__dirname, '..', '..', '..', 'Utils', 'utilities.js'));

module.exports = {
    name: 'face',
    aliases: [],
    description: 'Determines the race, gender, and age of a face.',
    ownerOnly: false,
    cooldown: 5000,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Analyzers',
    usage: '[image]',
    run: async (client, message, [ image ], container) => {   

        if (!validate(image, message)) return message.reply('Please provide an image.');
        image = parse(image, message);
        try {
            const face = await detect(image);
            if (!face) return message.reply('There are no faces in this image.');
            if (face === 'size') return message.reply('This image is too large.');
            const pronoun = face.gender.value === 'Male' ? 'He' : 'She';
            const emotion = emotionResponse[emotions.indexOf(
                emotions.slice(0).sort((a, b) => face.emotion[b] - face.emotion[a])[0],
            )];
            const smile = face.smile.value > face.smile.threshold;
            const beautyScore = face.gender.value === 'Male' ? face.beauty.female_score : face.beauty.male_score;
      
            const embed = new container.Discord.MessageEmbed()
                .setColor('GREY')
                .setDescription(`I think this is a photo of a ${face.age.value} year old ${face.gender.value.toLowerCase()}.\n${pronoun} appears to be ${emotion}, and is ${smile ? 'smiling' : 'not smiling'}. I give this\nface a ${Math.round(beautyScore)} on the 1-100 beauty scale.\n${beautyScore > 50 ? beautyScore > 70 ? beautyScore > 90 ? 'Hot!' : 'Not bad.' : 'Not _too_ ugly.' : 'Uggggly!'}`)
                .setFooter({ text: `Analyze Commands | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });

        } catch(err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${container.Config.prefix[0]}feedback\` command`, embeds: [ 
                new container.Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }   
};

async function detect(image) {
    const imgData = await request.get(image);
    if (Buffer.byteLength(imgData.body) >= 2e+6) return 'size';
    const { body } = await request
        .post('https://api-us.faceplusplus.com/facepp/v3/detect')
        .attach('image_base64', base64(imgData.body))
        .query({
            api_key: process.env.FACEPLUSPLUS_KEY,
            api_secret: process.env.FACEPLUSPLUS_SECRET,
            return_attributes: 'gender,age,smiling,emotion,ethnicity,beauty',
        });
    if (!body.faces || !body.faces.length) return null;
    return body.faces[0].attributes;
}

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
