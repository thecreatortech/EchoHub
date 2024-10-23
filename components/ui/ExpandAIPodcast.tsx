// ExpandAIPodcast.tsx
import React, { useState } from 'react';
import { Label } from './label';
import { Textarea } from './textarea';
import { Button } from './button';
import { Loader } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from '@/hooks/use-toast';

interface ExpandAIPodcastProps {
	setVoicePrompt: (prompt: string) => void;
	voicePrompt: string;
}

const ExpandAIPodcast: React.FC<ExpandAIPodcastProps> = ({ setVoicePrompt, voicePrompt }) => {
	const [isExpanding, setIsExpanding] = useState(false);
	const [shortPrompt, setShortPrompt] = useState('');
	const expandPrompt = useAction(api.openai.expandPrompt);
	const { toast } = useToast();

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

	return (
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
	);
};

export default ExpandAIPodcast;
