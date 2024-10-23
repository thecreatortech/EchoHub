import { PodcastCardProps } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface PodcastListProps {
	podcasts: PodcastCardProps[];
}

const PodcastList = ({ podcasts }: PodcastListProps) => {
	const router = useRouter();
	const [selected, setSelected] = useState<string | null>(null);

	const handleViews = (podcastId: string) => {
		router.push(`/podcasts/${podcastId}`);
	};

	const handleMoreOptions = (podcastId: string) => {
		setSelected(selected === podcastId ? null : podcastId);
	};

	// Share the podcast link
	const handleShare = (podcastId: string) => {
		const shareUrl = `${window.location.origin}/podcasts/${podcastId}`;
		navigator.clipboard.writeText(shareUrl);
		alert('Podcast link copied to clipboard!');
	};

	// Download the podcast audio
	// Download the podcast audio
	const handleDownload = async (audioUrl: string) => {
		try {
			// Log the audio URL to ensure it's being passed correctly
			console.log('Downloading podcast from:', audioUrl);

			// Fetch the audio file as a blob
			const response = await fetch(audioUrl, {
				method: 'GET',
				// Add headers if required by the server
				headers: {
					// Example: Add authentication headers if needed
					// 'Authorization': `Bearer ${yourToken}`,
				},
			});

			// Check if the response is OK (status 200)
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			// Convert the response into a Blob (binary data)
			const blob = await response.blob();

			// Create a URL for the blob object
			const url = window.URL.createObjectURL(blob);

			// Create an anchor element to download the file
			const link = document.createElement('a');
			link.href = url;
			link.download = 'podcast.mp3'; // Set the file name
			document.body.appendChild(link);
			link.click();

			// Clean up and remove the anchor
			link.remove();
		} catch (error) {
			console.error('Error downloading podcast:', error);
			alert('Failed to download the podcast.');
		}
	};

	return (
		<div className='w-full'>
			<Table>
				<TableBody>
					{podcasts.map((podcast, index) => (
						<TableRow key={podcast.podcastId} className='border-b border-gray-800'>
							<TableCell>{index + 1}</TableCell>

							<TableCell className='flex items-center gap-4'>
								{/* Apply cursor pointer and onClick for image and title only */}
								<div
									className='flex items-center gap-4 cursor-pointer'
									onClick={() => handleViews(podcast.podcastId)}
								>
									<Image
										src={podcast.imgUrl}
										width={50}
										height={50}
										alt={podcast.title}
										className='rounded-lg'
									/>
									<div>
										<h1 className='text-14 font-bold text-white'>
											{podcast.title}
										</h1>
										<p className='text-12 text-white-4 truncate'>
											{podcast.description}
										</p>
									</div>
								</div>
							</TableCell>

							<TableCell>{podcast.views}</TableCell>
							<TableCell>{podcast.audioDuration} mins</TableCell>

							<TableCell className='relative'>
								{/* Dropdown with share and download options */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button className='focus:outline-none'>
											<FaEllipsisV className='text-white-1' />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className='bg-black-2 border border-orange-500 rounded-md text-white-1 '
										align='end'
									>
										{/* Share Podcast */}
										<DropdownMenuItem
											className='hover:bg-orange-500 text-white-1 cursor-pointer'
											onClick={() => handleShare(podcast.podcastId)}
										>
											Share Podcast
										</DropdownMenuItem>
										{/* Download Podcast */}
										<DropdownMenuItem
											className='hover:bg-orange-500 text-white-1 cursor-pointer'
											onClick={() =>
												handleDownload(podcast.audioUrl, podcast.title)
											}
										>
											Download Podcast
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default PodcastList;
