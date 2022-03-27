require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');

module.exports = async (client) => {
    let retry = true;
    while (retry) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(chalk.bold.greenBright('MongoDB Connected!'));
            client.dbConnected = true;
            retry = false;
        } catch (err) {
            console.log(err);
            console.log(chalk.bold.redBright('MongoDB Connection Failed! Retrying in 10 minutes'));
            client.dbConnected = false;
            await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 10));
        }
    }
};