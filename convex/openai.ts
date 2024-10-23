// import { GenerateThumbnail } from '@/components/ui/GenerateThumbnail';
import { v } from 'convex/values';
import { action } from './_generated/server';
import OpenAI from 'openai';
import { SpeechCreateParams } from 'openai/resources/audio/speech.mjs';
import { act } from 'react';
import { ImageResponse } from 'next/server';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const expandPrompt = action({
	args: { shortPrompt: v.string() },
	handler: async (_, { shortPrompt }) => {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini', // Use the gpt-4o-mini model
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that expands user prompts into more detailed responses.',
				},
				{
					role: 'user',
					content: `Expand this prompt into a detailed 200-300 words: ${shortPrompt}`,
				},
			],
			max_tokens: 300, // Set max tokens for response
			temperature: 0.7, // Set creativity level
		});

		// Check if choices exist and retrieve the expanded text safely
		const expandedText =
			completion.choices && completion.choices.length > 0
				? completion.choices[0]?.message.content.trim()
				: null;

		// If expandedText is null, throw an error
		if (!expandedText) {
			throw new Error('Failed to expand prompt.');
		}

		return expandedText;
	},
});

export const generateAudioAction = action({
	args: { input: v.string(), voice: v.string() },
	handler: async (_, { voice, input }) => {
		const mp3 = await openai.audio.speech.create({
			model: 'tts-1',
			voice: voice as SpeechCreateParams['voice'],
			input,
		});
		const buffer = await mp3.arrayBuffer();

		return buffer;
	},
});

export const GenerateThumbnailAction = action({
	args: { prompt: v.string() },
	handler: async (_, { prompt }) => {
		const response = await openai.images.generate({
			model: 'dall-e-3',
			prompt,
			size: '1024x1024',
			quality: 'standard',
			n: 1,
		});
		const url = response.data[0].url;

		if (!url) {
			throw new Error('Error Generating Thumbnail');
		}

		const imageResponse = await fetch(url);
		const buffer = await imageResponse.arrayBuffer();
		return buffer;
	},
});
