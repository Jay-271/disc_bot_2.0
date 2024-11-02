const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.GPT_API
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img-generation')
        .setDescription('generates an img duh')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('describe what img u want')
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const prompt = interaction.options.getString('prompt');

        try {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: `1024x1024`
            });

            const image = response.data[0].url;

            // Truncate the prompt to ensure it fits within Discord's title limit
            if (prompt.length > 100) {
                title = `Here's your img of \`\`\`${prompt.slice(0, 75)} [truncated]\`\`\``; // Limiting to 250 chars to fit
            }
            else {
                title = `Here's your img of \`\`\`${prompt}\`\`\``; // Limiting to 250 chars to fit
            }

            if (!title) {
                title = `Here's your img of \`\`\`${prompt}\`\`\``; // Limiting to 250 chars to fit
            }

            
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(title)
                .setImage(image)
                .setTimestamp()
                .setFooter({ text: `DALLE-3 Image Generator` });

            await interaction.followUp({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            if (e.response) {
                if (e.response.status == 400) {
                    console.log(e.response.data.error);
                    return await interaction.followUp({ content: `I can't generate that bro (err 400) aka no explicit stuff prolly` });
                } else {
                    return await interaction.followUp({ content: `Request failed because of this error: ${e.response.status}` });
                }
            } else {
                return await interaction.followUp({ content: `An unexpected error occurred: ${e.message}` });
            }
        }
    }
};
