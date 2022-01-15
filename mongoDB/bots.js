let BotsModel = require('../models/bots/bots')

const createBot = async (botDetails) => {
    const banner = new BotsModel(botDetails);
    return Promise.resolve(await banner.save());
};
const createBulkBot = async (bots) => {
    return Promise.resolve(await BotsModel.bulkWrite(bots));
};

const getBots = async () => {
    const bots = await BotsModel.find({ isBot: true });
    return Promise.resolve(bots);
};

module.exports = {
    createBot,
    createBulkBot,
    getBots
};