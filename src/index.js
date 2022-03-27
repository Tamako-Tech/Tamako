require('dotenv').config();
require('./fonts');
const Cluster = require('discord-hybrid-sharding');
const manager = new Cluster.Manager(`${__dirname}/bot.js`,{
    totalShards: 'auto' , //or 'auto'
    ///See below for more options
    shardsPerClusters: 2, 
    //totalClusters: 7,
    keepAlive: {
        interval: 2000, ///The Interval to send the Heartbeat
        maxMissedHeartbeats: 5, // The maximal Amount of missing Heartbeats until Cluster will be respawned
        maxClusterRestarts: 3 ///The maximal Amount of restarts, which can be done in 1 hour with the HeartbeatSystem
    },
    mode: 'process' ,  
    token: process.env.TOKEN,
});
manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn({timeout: -1});