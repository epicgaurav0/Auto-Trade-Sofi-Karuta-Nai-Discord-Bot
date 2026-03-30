const fs = require("fs");
const { Client } = require("discord.js-selfbot-v13");
const chalk = require("chalk");

const tokens = fs.readFileSync("token.txt", "utf8").trim().split(/\r?\n/);
const channelIds = fs.readFileSync("channel.txt", "utf8").trim().split(/\r?\n/);

const clientMain = new Client({ checkUpdate: false });
const clientAlt = new Client({ checkUpdate: false });
const Bot_Id = "853629533855809596"; // Sofi Bot ID

let mainReady = false;
let altReady = false;

const delay = ms => new Promise(res => setTimeout(res, ms));

clientMain.on("ready", async() => {
    console.log(chalk.green(`Logged in as ${clientMain.user.tag}`));
    mainReady = true;
    if (mainReady && altReady) await sendMessage();
});

clientAlt.on("ready", async() => {
    console.log(chalk.bold.blue(`Logged in as ${clientAlt.user.tag}`));
    altReady = true;
    if (mainReady && altReady) {
        await sendMessage();
        setInterval(sendMessage, 60000);
    }
});

async function start() {
    await clientMain.login(tokens[1]);
    await clientAlt.login(tokens[0]);
}

async function sendMessage() {
    const ch = await clientMain.channels.fetch(channelIds[0]);
    await ch.send(`nmt <@${clientAlt.user.id}>`);
    console.log(chalk.green(`Trade Message Sent to ${ch.name}`));
}

clientMain.on("messageUpdate", async(oldMessage, message) => {
    if (message.author.id !== Bot_Id) return;

    const ch = await clientMain.channels.fetch(channelIds[0]);
    if (message.channel.id !== ch.id) return;

    const oldEmbed = oldMessage.embeds[0];
    const newEmbed = message.embeds[0];
    if (!newEmbed) return;
    if (newEmbed.title === "TRADE SUCCESSFUL") return console.log(chalk.green(`Trade Complete!`));

    const oldDescription = oldEmbed ? oldEmbed.description : "";
    const newDescription = newEmbed.description ? newEmbed.description : "";

    // ✅ description changed AND both silver visible (2 times silver in description)
    const descriptionChanged = oldDescription !== newDescription;
    const silverCount = newDescription.split("silver").length - 1;
    const coinsVisible = silverCount >= 2;

    if (!descriptionChanged || !coinsVisible) return;

    setTimeout(async() => {
        try {
            const button = message.components[0].components;
            if (!button || button.length === 0) {
                console.log(chalk.green(`No button found — Trade Complete!`));
                return;
            }
            await message.clickButton(button[0].customId);
            console.log(chalk.blue(`MAIN ACC CLICKED BUTTON`));
        } catch (err) {
            console.error(chalk.red(`Error clicking button (Main): ${err.message}`));
        }
    }, 1500);
});

clientAlt.on("messageCreate", async(message) => {
    const chA = await clientAlt.channels.fetch(channelIds[0]);
    const chM = await clientMain.channels.fetch(channelIds[0]);

    if (message.channel.id !== chA.id) return;
    if (message.author.id !== Bot_Id) return;

    const embed = message.embeds[0];
    if (!embed) return;
    if (embed.title !== "TRADE REQUEST") return;
    if (!embed.description.includes(`has requested to trade with <@${clientAlt.user.id}>`)) return;

    console.log(chalk.yellow(`Trade Request Received`));

    const button = message.components[0].components;
    if (!button || button.length === 0) return;

    try {
        await message.clickButton(button[0].customId);
        console.log(chalk.blue(`Button Clicked — Trade Accepted`));

        await delay(100);

        const randomCoinMain = Math.floor(Math.random() * 1500);
        const randomCoinAlt = Math.floor(Math.random() * 1500);

        await chA.send(`${randomCoinAlt} silver`);
        console.log(chalk.green(`${randomCoinAlt} Silver Sent from Alt`));

        await delay(3500);

        await chM.send(`${randomCoinMain} silver`);
        console.log(chalk.green(`${randomCoinMain} Silver Sent from Main`));

    } catch (err) {
        console.error(chalk.red(`Error Clicking Button: ${err.message}`));
    }
});

clientAlt.on("messageUpdate", async(oldMessage, message) => {
    if (message.author.id !== Bot_Id) return;

    const chA = await clientAlt.channels.fetch(channelIds[0]);
    if (message.channel.id !== chA.id) return;

    const oldEmbed = oldMessage.embeds[0];
    const newEmbed = message.embeds[0];
    if (!newEmbed) return;
    if (newEmbed.title === "TRADE SUCCESSFUL") return console.log(chalk.green(`Trade Complete!`));

    const oldDescription = oldEmbed ? oldEmbed.description : "";
    const newDescription = newEmbed.description ? newEmbed.description : "";

    // ✅ description changed AND both silver visible (2 times silver in description)
    const descriptionChanged = oldDescription !== newDescription;
    const silverCount = newDescription.split("silver").length - 1;
    const coinsVisible = silverCount >= 2;

    if (!descriptionChanged || !coinsVisible) return;

    setTimeout(async() => {
        try {
            const freshMessage = await chA.messages.fetch(message.id);
            const freshEmbed = freshMessage.embeds[0];

            if (freshEmbed.title === "TRADE SUCCESSFUL") return console.log(chalk.green(`Trade Complete!`));

            const newButton = freshMessage.components[0].components;
            if (!newButton || newButton.length === 0) {
                console.log(chalk.green(`No button found — Trade Complete!`));
                return;
            }
            await freshMessage.clickButton(newButton[0].customId);
            console.log(chalk.blue(`ALT ACC CLICKED BUTTON`));
        } catch (err) {
            console.error(chalk.red(`Error Clicking Button: ${err.message}`));
        }
    }, 1500);
});

start().catch(console.error);

process.on("uncaughtException", e => console.log(`${e}`));
process.on("unhandledRejection", e => console.log(`${e}`));