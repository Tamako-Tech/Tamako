require('dotenv').config()
const { join } = require('path')
const Cluster = require('discord-hybrid-sharding')
const manager = new Cluster.Manager(join(__dirname, 'bot.js'), {
  totalShards: 'auto', // or 'auto'
  /// See below for more options
  shardsPerClusters: 2,
  // totalClusters: 7,
  mode: 'process',
  token: process.env.TOKEN
})
manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`))
manager.spawn({ timeout: -1 })
