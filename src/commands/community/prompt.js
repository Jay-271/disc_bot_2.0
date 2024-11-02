const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.GPT_API
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt-gen')
        .setDescription('Creates a prompt using random variables to try and get the best prompt')
        .addStringOption(option => option.setName('prompt').setDescription('Type an initial prompt to amplify')),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        await interaction.deferReply();

const uniqueResponsePrompts = [
    "Challenge Convention: REWORD this prompt in a way that no one would expect.",
    "Unconventional Perspective: REWORD the prompt in an unconventional way.",
    "Out-of-the-Box Thinking: REWORD the prompt in a way that's completely out of the box.",
    "Creative Imagination: Use your wildest imagination to REWORD the prompt.",
    "Challenge Assumptions: Question the assumptions behind the question before you REWORD the prompt.",
    "Role-Play: Imagine you're a different person, like a historical figure or a fictional character, and REWORD the prompt from their perspective.",
    "Use Analogies: Provide an analogy or metaphor to REWORD your prompt.",
    "Absurdity and Humor: Give a comically absurd REWORDING of the prompt.",
    "Mystery Mode: REWORD the prompt as if you're solving a mystery and need to uncover the truth.",
    "Time Traveler's Perspective: REWORD the prompt as if you've traveled back in time and have insights from a different era.",
    "Infinite Wisdom: Imagine you have all the wisdom in the universe at your disposal when you REWORD the prompt.",
    "Futuristic Vision: REWORD the prompt from a futuristic perspective, considering advanced technology and knowledge.",
    "Scientific Exploration: REWORD the prompt as if you're a scientist conducting an experiment.",
    "Nature's Voice: Imagine the prompt from the perspective of nature or an animal.",
    "Musical Interpretation: REWORD the prompt as if it were a musical composition, using metaphors of music.",
    "Cinematic Rewrite: Transform the prompt into a movie script or scene.",
    "Emotional Journey: Describe the prompt using a range of emotions, from joy to sorrow.",
    "Epic Quest: Frame the prompt as if it's the beginning of an epic adventure.",
    "Global Connection: REWORD the prompt with a global or interconnected perspective.",
    "Quantum Reality: Explore the prompt as if it exists in the realm of quantum physics and uncertainty.",
    "Alien Encounter: REWORD the prompt from the viewpoint of an extraterrestrial being.",
    "Underwater World: Imagine the prompt from the depths of the ocean, with aquatic themes."
];

        // Define the number of times to recycle the prompt.
        const recycleCount = 4;
        const responseMessages = [prompt];

        for (let i = 0; i < recycleCount; i++) {
            const randomPrompt = uniqueResponsePrompts[Math.floor(Math.random() * uniqueResponsePrompts.length)];

            const conversation = [
                { role: 'system', content: `You are presented with the following prompt: "${responseMessages[i]}"` },
                { role: 'user', content: responseMessages[i] },
                { role: 'system', content: `Now, assume the personality of: ${randomPrompt}` },
                { role: 'user', content: `As ${randomPrompt}, ${randomPrompt.split(':').slice(1)}` }];

            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: conversation,
                });

                responseMessages.push(response.choices[0].message.content);
            } catch (e) {
                console.error(e);
                console.log(e.data);
                return await interaction.followUp({ content: `Request failed because of this error: ${e}` });
            }
        }

        const chunkSizeLimit = 2000;
        const responseMessage = responseMessages.join("\n```java\nSystem.out.println('New_Prompt');\n```\n\t");

        for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
            const chunk = responseMessage.substring(i, i + chunkSizeLimit);
            await interaction.followUp({ content: chunk});
        }
    }
};