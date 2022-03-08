
function validate(val, arg) {
    if(arg.oneOf && !arg.oneOf.includes(val.toLowerCase())) {
        return `Please enter one of the following options: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
    }
    if(arg.min !== null && typeof arg.min !== 'undefined' && val.length < arg.min) {
        return `Please keep the ${arg.label} above or exactly ${arg.min} characters.`;
    }
    if(arg.max !== null && typeof arg.max !== 'undefined' && val.length > arg.max) {
        return `Please keep the ${arg.label} below or exactly ${arg.max} characters.`;
    }
    return true;
}

function parse(val) {
    return val;
}

module.exports = {
    validate,
    parse
};