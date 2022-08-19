const fileTypeRe = /\.(jpe?g|png|gif|jfif|bmp)(\?.+)?$/i
const request = require('node-superfetch')
const validURL = require('valid-url')

async function validate (value, message) {
  const attachment = message.attachments.first()
  if (attachment) {
    if (attachment.size > 8e+6) return 'Please provide an image under 8 MB.'
    if (!fileTypeRe.test(attachment.name)) return 'Please only send PNG, JPG, BMP, or GIF format images.'
    return true
  }
  if (fileTypeRe.test(value.toLowerCase())) {
    if (!validURL.isWebUri(value)) return false
    try {
      await request.get(value)
      return true
    } catch {
      return false
    }
  }
  return false
}
function parse (value, message) {
  const attachment = message.attachments.first()
  if (attachment) return attachment.url
  if (fileTypeRe.test(value.toLowerCase())) return value
  return null
}

module.exports = {
  validate,
  parse
}
