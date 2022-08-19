const { EmbedBuilder } = require('discord.js')

class Dispatcher {
  constructor ({ client, guild, channel, player }) {
    this.client = client
    this.guild = guild
    this.channel = channel
    this.player = player
    this.queue = []
    this.repeat = 'off'
    this.current = null
    this.stopped = false

    let _notifiedOnce = false
    const _errorHandler = data => {
      if (data instanceof Error || data instanceof Object) console.log(data)
      this.queue.length = 0
      this.destroy()
    }

    this.player
      .on('start', () => {
        if (this.repeat === 'one') {
          if (_notifiedOnce) return
          else _notifiedOnce = true
        } else if (this.repeat === 'all' || this.repeat === 'off') {
          _notifiedOnce = false
        }
        const embed = new EmbedBuilder()
          .setAuthor({ name: 'Now Playing', iconURL: 'https://i.imgur.com/2UOMwYK.gif' })
          .setTitle(`${this.current.info.title}`)
          .setColor(0xff0000)
          .setURL(this.current.info.uri)
          .addFields(
            {
              name: 'Duration',
              value: `${Dispatcher.humanizeTime(this.current.info.duration)}`
            },
            {
              name: 'Length',
              value: `${Dispatcher.humanizeTime(this.current.info.length)}`
            }
          )
          .setFooter({ text: `Music System | ©️${new Date().getFullYear()} Tamako` })
        this.channel
          .send({ embeds: [embed] })
          .catch(() => null)
      })
      .on('end', () => {
        if (this.repeat === 'one') this.queue.unshift(this.current)
        if (this.repeat === 'all') this.queue.push(this.current)
        this.play()
      })
      .on('stuck', () => {
        if (this.repeat === 'one') this.queue.unshift(this.current)
        if (this.repeat === 'all') this.queue.push(this.current)
        this.play()
      })
      .on('closed', _errorHandler)
      .on('error', _errorHandler)
  }

  static humanizeTime (ms) {
    const seconds = Math.floor(ms / 1000 % 60)
    const minutes = Math.floor(ms / 1000 / 60 % 60)
    return [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':')
  }

  get exists () {
    return this.client.queue.has(this.guild.id)
  }

  play () {
    if (!this.exists || !this.queue.length) return this.destroy()
    this.current = this.queue.shift()
    this.player
      .setVolume(0.3)
      .playTrack({ track: this.current.track })
  }

  destroy (reason) {
    this.queue.length = 0
    this.player.connection.disconnect()
    this.client.queue.delete(this.guild.id)
    console.log(this.player.constructor.name, `Destroyed the player & connection @ guild "${this.guild.id}"\nReason: ${reason || 'No Reason Provided'}`)
    if (this.stopped) return
    this.channel
      .send('No more songs in queue, feel free to create a new player again!')
      .catch(() => null)
  }
}
module.exports = Dispatcher
