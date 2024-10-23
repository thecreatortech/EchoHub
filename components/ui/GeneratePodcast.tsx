import { GeneratePodcastProps } from '@/types';
import React, { useState } from 'react';
import { Label } from './label';
import { Textarea } from './textarea';
import { Button } from './button';
import { Loader } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useToast } from '@/hooks/use-toast';

const useGeneratePodcast = ({
	setAudio,
	voicePrompt,
	voiceType,
	setAudioStorageId,
	setVoicePrompt,
}: GeneratePodcastProps & { setVoicePrompt: (prompt: string) => void }) => {
	const [isGenerating, setIsGenerating] = useState(false);
	const [isExpanding, setIsExpanding] = useState(false); // New state for expanding prompt
	const [shortPrompt, setShortPrompt] = useState(''); // New state for the short prompt
	const { toast } = useToast();

	const generateUploadUrl = useMutation(api.files.generateUploadUrl);
	const { startUpload } = useUploadFiles(generateUploadUrl);

	const getAudioUrl = useMutation(api.podcasts.getUrl);

	const getPodcastAudio = useAction(api.openai.generateAudioAction);
	const expandPrompt = useAction(api.openai.expandPrompt); // API to expand the prompt

	// Function to generate the podcast
	const generatePodcast = async () => {
		setIsGenerating(true);
		setAudio('');

		if (!voicePrompt) {
			toast({
				title: 'Please Provide a voiceType to generate a podcast',
			});
			return setIsGenerating(false);
		}
		try {
			const response = await getPodcastAudio({
				voice: voiceType,
				input: voicePrompt,
			});
			const blob = new Blob([response], { type: 'audio/mpeg' });
			const fileName = `podcast-${uuidv4()}.mp3`;
			const file = new File([blob], fileName, { type: 'audio/mpeg' });

			const uploaded = await startUpload([file]);
			const storageId = (uploaded[0].response as any).storageId;

			setAudioStorageId(storageId);
			const audioUrl = await getAudioUrl({ storageId });
			setAudio(audioUrl!);
			setIsGenerating(false);
			toast({
				title: 'Podcast Generated Successfully ',
			});
		} catch (error) {
			console.log('Error Generating Podcast', error);
			toast({
				title: 'Error Creating a Podcast',
				variant: 'destructive',
			});
			setIsGenerating(false);
		}
	};

	// Function to expand the short prompt

	const expandShortPrompt = async () => {
		if (!shortPrompt) {
			toast({
				title: 'Please provide a short prompt to expand',
				variant: 'destructive',
			});
			return;
		}

		setIsExpanding(true);
		try {
			const expandedResponse = await expandPrompt({ shortPrompt });
			// Append the expanded text to the existing voicePrompt
			setVoicePrompt((prev) => `${prev}\n${expandedResponse}`);
			toast({
				title: 'Prompt expanded successfully',
			});
		} catch (error) {
			console.log('Error Expanding Prompt', error);
			toast({
				title: 'Error Expanding Prompt',
				variant: 'destructive',
			});
		}
		setIsExpanding(false);
	};

	return {
		isGenerating,
		generatePodcast,
		isExpanding,
		shortPrompt,
		setShortPrompt,
		expandShortPrompt,
	};
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
	const {
		isGenerating,
		generatePodcast,
		isExpanding,
		shortPrompt,
		setShortPrompt,
		expandShortPrompt,
	} = useGeneratePodcast(props);

	const [showShortPrompt, setShowShortPrompt] = useState(true); // Controls visibility of short prompt

	return (
		<div>
			{/* Button to toggle between user content and AI prompt */}
			<div className='flex gap-2.5 mb-5  border-red-500'>
				<Button
					type='button'
					className={`text-16 py-4 font-bold text-white-1 transition-all duration-500 ${showShortPrompt ? 'bg-black-1' : 'bg-orange-1'}`}
					onClick={() => setShowShortPrompt(false)}
				>
					Let the user give the content
				</Button>
				<Button
					type='button'
					className={`text-16 py-4 font-bold text-white-1 transition-all duration-500 ${showShortPrompt ? 'bg-orange-1' : 'bg-black-1'}`}
					onClick={() => setShowShortPrompt(true)}
				>
					Let AI generate the content
				</Button>
			</div>

			{/* Short Prompt Expansion Section, shown based on state */}
			{showShortPrompt && (
				<div className='flex flex-col gap-2.5 mb-5'>
					<Label className='text-16 font-bold text-white-1'>Short Prompt to Expand</Label>
					<Textarea
						className='input-class focus-visible:ring-orange-1 text-white-1'
						placeholder='Provide a short prompt (e.g., a motivation on gym for the first day)'
						rows={2}
						value={shortPrompt}
						onChange={(e) => setShortPrompt(e.target.value)}
					/>
					<div className='mt-2 w-full max-w-[200px]'>
						<Button
							type='button'
							className='text-16 bg-orange-1 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-1'
							onClick={expandShortPrompt}
						>
							{isExpanding ? (
								<>
									Expanding...
									<Loader size={20} className='animate-spin ml-2' />
								</>
							) : (
								'Expand Prompt'
							)}
						</Button>
					</div>
				</div>
			)}

			{/* AI Prompt to Generate Podcast Section - always visible */}
			<div className='flex flex-col gap-2.5'>
				<Label className='text-16 font-bold text-white-1'>
					AI Prompt to Generate Podcast
				</Label>
				<Textarea
					className='input-class focus-visible:ring-orange-1 text-white-1'
					placeholder='Provide text to Generate Audio'
					rows={5}
					value={props.voicePrompt}
					onChange={(e) => props.setVoicePrompt(e.target.value)}
				/>
			</div>

			<div className='mt-5 w-full max-w-[200px]'>
				<Button
					type='submit'
					className='text-16 bg-orange-1 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-1'
					onClick={generatePodcast}
				>
					{isGenerating ? (
						<>
							Generating...
							<Loader size={20} className='animate-spin ml-2' />
						</>
					) : (
						'Generate'
					)}
				</Button>
			</div>

			{props.audio && (
				<audio
					controls
					src={props.audio}
					autoPlay
					className='mt-5'
					onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
				/>
			)}
		</div>
	);
};

export default GeneratePodcast;
