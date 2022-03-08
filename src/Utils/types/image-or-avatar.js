const image = require('./image');
const user = require('./user');

async function validate(value, msg, arg, currentMsg) {
    const isimage = await image.validate(value, msg, arg, currentMsg);
    if (isimage) return isimage;
    return user.validate(value, msg, arg, currentMsg);
}

async function parse(value, msg, arg, currentMsg) {
    const isimage = image.parse(value, msg, arg, currentMsg);
    if (isimage) return isimage;
    const isuser = await user.parse(value, msg, arg, currentMsg);
    return isuser.displayAvatarURL({ format: 'png', size: 512 });
}

function isEmpty(value, msg, arg, currentMsg) {
    return image.isEmpty(value, msg, arg, currentMsg)
        && user.isEmpty(value, msg, arg, currentMsg);
}

module.exports = {
    validate,
    parse,
    isEmpty
};