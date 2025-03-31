const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const token = 'MTM0OTQ5ODc4OTM4MzM3NzA3Nw.Gcebav.vEZBgJJsT1gCLSIa1QL5J0HJjkROKMXX5A4e1c';
const clientId = '1349498789383377077';

const commands = [
    new SlashCommandBuilder()
        .setName('item-info')
        .setDescription('Fetches item info from Roblox Rivals Fandom')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the item')
                .setRequired(true))
]
.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Successfully registered commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'item-info') {
        const itemName = interaction.options.getString('name');
        if (!itemName) return interaction.reply('Please provide an item name.');
        
        try {
            const baseUrl = `https://robloxrivals.fandom.com/wiki/${encodeURIComponent(itemName)}`;
            const imageUrl = `https://cdn.discordapp.com/attachments/1305939773164097699/1356018645377224734/noFilter-3209178461.webp?ex=67eb0a46&is=67e9b8c6&hm=02239e24015b1e41336799280816ccd12f572d5c4adb0c668e48e1093672daab&`;
            
            const embed = new EmbedBuilder()
                .setColor('#36393F')
                .setTitle(itemName)
                .setURL(baseUrl)
                .setThumbnail(imageUrl)
                .setDescription(`[Click here for more info...](${baseUrl})`)
                .setFooter({ text: 'Powered by Roblox Rivals Fandom', iconURL: 'https://cdn.discordapp.com/attachments/1349497072524591146/1356015341846659142/Key2.png?ex=67eb0733&is=67e9b5b3&hm=a1452646e468439d74d71ce1cbc11cedaee3ead930f848f929ea56ba8da2f198&' });
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Error fetching item info.');
        }
    }
});

client.login(token);