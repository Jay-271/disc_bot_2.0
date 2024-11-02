const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ritos-balls")
    .setDescription(`Let me decide the answer`)
    .addStringOption(option => option.setName(`question`).setDescription(`Question at hand:`).setRequired(true)),
    async execute (interaction) {
        const { options } = interaction;

        const question = options.getString(`question`);
        choice = ["🎱: Ong boss ", "🎱: All fax no printer", "🎱: Yes. Like fr... yes.", "🎱: Man wtf i dont get paid enuf for this shit", "🎱: Depends, if you say it then it gotta be true", "🎱: No.",
        "🎱: Only today.", "🎱: No u", "🎱: Holdup let me cook 🔥🍳", "🎱: Holdup let me cook 🔥🍳", "🎱: Maybe... maybe not.", "🎱: The fuck kinda shit is this 💀", "🎱: Yes."]
        const ball = Math.floor(Math.random() * choice.length);



        const embed  = new EmbedBuilder()
    .setColor('Purple')
    .setTitle(`🎱| ${interaction.user.username}'s balls of truth`)
    .addFields({name: "Question", value: `${question}`, inline: true})
    .addFields({ name: "Answer", value: `${choice[ball]}`, inline: true})

    await interaction.reply({ embeds: [embed] });
        /*

        const embed  = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(`🎱| ${interaction.user.username}'s roll`)
        .addFields({name: "Question", value: `${question}`, inline: true})

        const embed2  = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(`🎱| ${interaction.user.username}'s roll`)
        .addFields({name: "Question", value: `${question}`, inline: true})
        .addFields({ name: "Answer", value: `${choice[ball]}`, inline: true})

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setLabel(`🎱 Roll Deez Nutz`)
            .setStyle(ButtonStyle.Primary)
        )

        const msg = await interaction.reply({ embed: [embed], components: [button]});

        const collector = msg.createMessageComponentCollector()

        function onButtonClick() {
            // Code to execute when the button is clicked
        }

        // Simulate a button click by calling the function directly
        onButtonClick();

        collector.on('collect', async i => {
            if (i.customId === 'button') {  // Use 'customId' instead of 'CustomId'
                await i.update({ embeds: [embed2], components: [] });  // Correct 'embds' to 'embeds'
            }
        });

        */
    }
}