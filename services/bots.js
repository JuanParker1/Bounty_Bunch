let errors = require('errors/index');
const randomstring = require('randomstring');
let BotsModel = require('../models/bots/bots')
const {
    createBot,
    createBulkBot,
    getBots
} = require("../mongoDB/bots")

const CreateBot = async (req, res, next) => {
    try {
        console.log(req.body);
        let gender = ['Male', 'Female'];

        let username = randomstring.generate(8);
        const bot = new BotsModel({
            userName: `bb${username}`,
            isBot: true,
            status: 'Active',
            botType: req.body.type || 'MustWin',
            botAvailability: 'Available',
            gender: req.body.gender || gender[Math.floor(Math.random() * gender.length)],
            email: req.body.email || `${randomstring.generate()}@gmail.com`
        });
        console.log(bot);

        await createBot(bot);
        console.log(bot)
        res.json({
            message: 'bots created',
            data: bot
        });


    } catch (err) {
        errors.handleException(err, next);
    }
}
const CreateBulkBot = async (req, res, next) => {
    if (req.body.number) {
        try {
            console.log(req.body.number);
            let gender = ['Male', 'Female'];
            let botType = ['MustWin', 'FairPlay'];
            let bots = [];

            const counter = req.body.number * 30 / 100;


            for (i = 0; i < req.body.number; i++) {
                let username = randomstring.generate(8);
                const type = i > counter ? botType[1] : botType[0];
                const bot = new BotsModel({
                    userName: `bb${username}`,
                    isBot: true,

                    botType: type,
                    botAvailability: 'Available',
                    gender: gender[Math.floor(Math.random() * gender.length)],
                    email: `${randomstring.generate()}@gmail.com`
                });
                console.log(bot);
                const botObject = {
                    insertOne:
                    {
                        "document": bot
                    }
                }
                bots.push(botObject);
            }

            //console.log(bots);
            await createBulkBot(bots);
            console.log(bots)
            res.json({
                message: 'bots created',
                data: bots
            });


        } catch (err) {
            errors.handleException(err, next);
        }
    }
    res.json({ message: "Number of bots is not provided", status: 400 });
}

const GetBots = async (req, res, next) => {
    try {
        res.data = await getBots()
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

module.exports = { CreateBot, CreateBulkBot, GetBots }