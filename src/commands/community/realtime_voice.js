const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, EndBehaviorType, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const WebSocket = require('ws');
const prism = require('prism-media');
const { pipeline } = require('stream');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-chat')
        .setDescription('Bot joins voice channel and starts a conversation'),

    async execute(interaction) {
        console.log('Interaction received:', interaction);

        const voiceChannel = interaction.member.voice?.channel;
        if (!voiceChannel) {
            return await interaction.reply('You need to be in a voice channel to use this command!');
        }

        await interaction.deferReply();

        let connection;
        let ws;
        let inactivityTimeout;

        // Function to clean up resources
        function cleanup() {
            clearTimeout(inactivityTimeout);
            if (connection) connection.destroy();
            if (ws && ws.readyState === WebSocket.OPEN) ws.close();
            console.log('Cleaned up resources.');
        }

        // Ensure API Key is valid
        const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';
        ws = new WebSocket(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GPT_API}`,
                'OpenAI-Beta': 'realtime=v1',
            }
        });

        // Managing the WebSocket connection events
        ws.on('open', () => {
            console.log('Connected to OpenAI real-time API.');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed.');
        });

        ws.on('message', (message) => {
            const data = JSON.parse(message.toString());
            console.log('Received from OpenAI:', data);
            // TODO: Handle audio playback from OpenAI response
        });

        // Setup the Discord voice connection
        connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('Bot connected to the voice channel!');
            setupListening();
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            cleanup();
        });

        const receiver = connection.receiver;

        // Function to set up the audio listening
        function setupListening() {
            voiceChannel.members.forEach(member => {
                if (member.user.bot) return; // Ignore bots

                const audioStream = receiver.subscribe(member.user.id, {
                    end: {
                        behavior: EndBehaviorType.AfterSilence,
                        duration: 1000
                    }
                });

                const decoder = new prism.opus.Decoder({ frameSize: 960, channels: 1, rate: 48000 });

                pipeline(audioStream, decoder, (err) => {
                    if (err) console.error('Pipeline failed:', err);
                });

                decoder.on('data', (chunk) => {
                    // Convert to 16-bit PCM
                    const pcmAudio = Buffer.from(chunk);
                    const base64Audio = pcmAudio.toString('base64');

                    const event = {
                        type: 'input_audio.buffer',
                        audio: base64Audio,
                        sessionId: member.voice.sessionId
                    };

                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(event));
                    }
                });
            });

            interaction.editReply('Bot is now listening in the voice channel.');

            inactivityTimeout = setTimeout(() => {
                cleanup();
                interaction.followUp('Left the voice channel due to inactivity.');
            }, 5 * 60 * 1000); // 5 minutes
        }
    }
};