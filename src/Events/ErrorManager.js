module.exports = {
    name: 'errorManager',
    customEvent: true,
    run: async() => {
        process.on('unhandledRejection', error => {
            console.log(error);
        });
        process.on('uncaughtException', error => {
            console.log(error);
        });
    }
};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */
