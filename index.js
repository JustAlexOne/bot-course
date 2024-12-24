const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, newGameOptions } = require('./options')
const token = ""

const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10).toString();
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'I thought of a number from 0 to 9, try to guess it.', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start the bot and welcome the user'},
        {command: '/info', description: 'Get info about the user'},
        {command: '/game', description: 'Start a Guessing game'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            // await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/232/efc/232efc5a-b6eb-4d09-abf4-4252d60747f5/1.jpg')
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b74/b7d/b74b7dc0-a1b6-38df-bd65-9134ae66479c/1.jpg')
            return await bot.sendMessage(chatId, 'Welcome! The bot has started successfully. How can I assist you today?');
        }
        if (text === '/info') {
            return await bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
        }
        if (text === '/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Sorry, I did not understand your command. Please try again.');
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/newGame') {
            return startGame(chatId);
        }
        await bot.sendMessage(chatId, `You've entered ${data}`)
        if (data === chats[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b74/b7d/b74b7dc0-a1b6-38df-bd65-9134ae66479c/5.webp');
            await bot.sendMessage(chatId, 'You guessed it right!', newGameOptions);
            delete chats[chatId];
            return;
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b74/b7d/b74b7dc0-a1b6-38df-bd65-9134ae66479c/4.webp');
            await bot.sendMessage(chatId, `You guessed it wrong! The number was - ${chats[chatId]}`, newGameOptions);
        }
        console.log(msg)
    })
}

start()