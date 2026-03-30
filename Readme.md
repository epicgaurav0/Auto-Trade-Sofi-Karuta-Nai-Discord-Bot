const fs = require("fs");
const { Client } = require("discord.js-selfbot-v13");
const chalk = require("chalk");

const tokens = fs.readFileSync("token.txt", "utf8").trim().split(/\r?\n/);
const channelIds = fs.readFileSync("channel.txt", "utf8").trim().split(/\r?\n/);

const clientMain = new Client({ checkUpdate: false });
const clientAlt = new Client({ checkUpdate: false });
const Bot_Id = "1312830013573169252";

let mainReady = false;
let altReady = false;
let tradeAccept = false;
let coinSend = false;
let altAccept = false;

//Main account login and ready event
clientMain.on("ready", async () => {
    console.log(chalk.green(`Logged in as ${clientMain.user.tag}`));
    mainReady = true;
    if (mainReady && altReady) {
        await sendMessage();
    }
});

//Alt account login and ready event
clientAlt.on("ready", async () => {
    console.log(chalk.bold.blue(`Logged in as ${clientAlt.user.tag}`));
    altReady = true;
    if (mainReady && altReady) {
        await sendMessage();
    }
});

//Client login Area
async function start() {
    await clientMain.login(tokens[1]);
    await clientAlt.login(tokens[0]);
}

//Trade message function
async function sendMessage() {
    const ch = await clientMain.channels.fetch(channelIds[0]);
    await ch.send(`nmt <@${clientAlt.user.id}>`);
    console.log(chalk.green(`Message Sended ${ch.name}`));
}

clientMain.on("messageCreate", async (message) => {
    if (message.author.id !== Bot_Id) return;
    if (!altAccept) return;
    const freshMessage = await message.channel.messages.fetch(message.id);
    const embed = freshMessage.embeds[0];
    if (!embed) return;

    if (embed.description.includes("are currently trading")) {
        console.log(chalk.cyan("Main Account: Alt finish kar chuka hai. Main ab finalize karega..."));
        setTimeout(async () => {
            const freshMessage = await message.channel.messages.fetch(message.id);
            const freshButton = freshMessage.components[0].components;
            if (!freshButton) return;
            if (freshButton) {
                try {
                    await freshMessage.clickButton(freshButton[0].customId);
                    console.log(chalk.blue(`1. Button Clicked for confarmation `));
                    await freshMessage.clickButton(freshButton[0].customId);
                    console.log(chalk.blue(`2. Button Clicked for confarmation `));

                } catch (error) {
                    console.error(chalk.red(`Error Clicking Button: ${error.message}`));
                }
            }
        }, 20000);
    }
});

//Alt account message event check
clientAlt.on("messageCreate", async (message) => {
    if (message.author.id !== Bot_Id) return;
    const embed = message.embeds[0];
    if (!embed) return;
    if (embed.title !== "TRADE REQUEST") return;
    if (embed.description.includes(`has requested to trade with <@${clientAlt.user.id}>`)) {
        console.log(chalk.yellow(`Trade Request Received`));
        const chA = await clientAlt.channels.fetch(channelIds[0]);
        const chM = await clientMain.channels.fetch(channelIds[0]);
        const button = message.components[0].components;
        if (!button) return;
        try {
            //step 1
            await message.clickButton(button[0].customId);
            console.log(chalk.blue(`Button Clicked `));
            //step 2
            tradeAccept = true;
            setTimeout(async () => {
                console.log(chalk.red(`Trade got Accepted`));
                await chA.send(`20 coins`);
                console.log(chalk.green(`20 Coins Sended`));
                await chM.send(`20 coins`);
                console.log(chalk.green(`20 Coins Sended From Main Account`));
                //step 3
                altAccept = true;
                coinSend = true;
                setTimeout(async () => {
                    const newButton = message.components[0].components;
                    await message.clickButton(newButton[0].customId);
                    console.log(chalk.blue(`1.Trade got Completed`));
                    await message.clickButton(newButton[0].customId);
                    console.log(chalk.blue(`2.Trade got Completed`));
                }, 1000);
            }, 1000);



        } catch (error) {
            console.error(chalk.red(`Error Clicking Button: ${error.message}`));
        }


    }
});
start().catch(console.error);