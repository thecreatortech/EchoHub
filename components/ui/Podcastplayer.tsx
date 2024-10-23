'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { formatTime } from '@/lib/formatTime';
import { cn } from '@/lib/utils';
import { useAudio } from '@/providers/AudioProvider';

import { Progress } from '@/components/ui/progress';

const PodcastPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(1); // Default volume set to 1 (max)
	const [currentTime, setCurrentTime] = useState(0);
	const [showVolumeSlider, setShowVolumeSlider] = useState(false); // To control slider visibility
	const { audio } = useAudio();
	let hideSliderTimeout: NodeJS.Timeout;

	const [isShuffle, setIsShuffle] = useState(false); // State for shuffle
	const [isRepeat, setIsRepeat] = useState(false); // State for repeat
	const togglePlayPause = () => {
		if (audioRef.current?.paused) {
			audioRef.current?.play();
			setIsPlaying(true);
		} else {
			audioRef.current?.pause();
			setIsPlaying(false);
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !isMuted;
			setIsMuted((prev) => !prev);
			setVolume(audioRef.current.muted ? 0 : 1); // If muted, set volume to 0, else to 1

			if (audioRef.current.muted) {
				setShowVolumeSlider(false); // Hide slider when muted
			}
		}
	};

	const adjustVolume = (newVolume: number) => {
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
			setVolume(newVolume);
			setIsMuted(newVolume === 0); // If volume is set to 0, consider it muted
			setShowVolumeSlider(true); // Show slider on volume change

			// Set a timeout to hide the slider after a few seconds of inactivity
			clearTimeout(hideSliderTimeout);
			hideSliderTimeout = setTimeout(() => setShowVolumeSlider(false), 3000); // Slider hides after 3 seconds
		}
	};

	const handleMouseEnter = () => {
		if (!isMuted) {
			setShowVolumeSlider(true);
			clearTimeout(hideSliderTimeout); // Stop the slider from hiding while hovered
		}
	};

	const handleMouseLeave = () => {
		if (!isMuted) {
			hideSliderTimeout = setTimeout(() => setShowVolumeSlider(false), 3000); // Hide slider after 3 seconds
		}
	};

	const forward = () => {
		if (
			audioRef.current &&
			audioRef.current.currentTime &&
			audioRef.current.duration &&
			audioRef.current.currentTime + 5 < audioRef.current.duration
		) {
			audioRef.current.currentTime += 5;
		}
	};

	const rewind = () => {
		if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
			audioRef.current.currentTime -= 5;
		} else if (audioRef.current) {
			audioRef.current.currentTime = 0;
		}
	};

	const toggleShuffle = () => {
		setIsShuffle((prev) => !prev); // Toggle shuffle state
	};

	const toggleRepeat = () => {
		setIsRepeat((prev) => !prev); // Toggle repeat state
	};

	useEffect(() => {
		const updateCurrentTime = () => {
			if (audioRef.current) {
				setCurrentTime(audioRef.current.currentTime);
			}
		};

		const audioElement = audioRef.current;
		if (audioElement) {
			audioElement.addEventListener('timeupdate', updateCurrentTime);

			return () => {
				audioElement.removeEventListener('timeupdate', updateCurrentTime);
			};
		}
	}, []);

	useEffect(() => {
		const audioElement = audioRef.current;
		if (audio?.audioUrl) {
			if (audioElement) {
				audioElement.play().then(() => {
					setIsPlaying(true);
				});
			}
		} else {
			audioElement?.pause();
			setIsPlaying(true);
		}
	}, [audio]);

	const handleLoadedMetadata = () => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration);
		}
	};

	const handleAudioEnded = () => {
		if (isRepeat) {
			audioRef.current?.play(); // Repeat playback if isRepeat is true
		} else {
			setIsPlaying(false);
		}
	};

	return (
		<div
			className={cn('sticky bottom-0 left-0 flex size-full flex-col', {
				hidden: !audio?.audioUrl || audio?.audioUrl === '',
			})}
		>
			<Progress value={(currentTime / duration) * 100 || 0} className='w-full' max={100} />

			<section className='glassmorphism-black flex h-[70px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12'>
				<audio
					ref={audioRef}
					src={audio?.audioUrl}
					className='hidden'
					onLoadedMetadata={handleLoadedMetadata}
					onEnded={handleAudioEnded}
				/>
				<div className='flex items-center gap-4 max-md:hidden'>
					<Link href={`/podcasts/${audio?.podcastId}`}>
						<Image
							src={audio?.imageUrl! || '/images/player1.png'}
							width={54}
							height={54}
							alt='player1'
							className='aspect-square rounded-xl'
						/>
					</Link>
					<div className='flex w-[160px] flex-col'>
						<h2 className='text-14 truncate font-semibold text-white-1'>
							{audio?.title}
						</h2>
						<p className='text-12 font-normal text-white-2'>{audio?.author}</p>
					</div>
				</div>
				<div className='flex-center cursor-pointer gap-3 md:gap-6'>
					<Image
						src={'/icons/reverse.svg'} // Add your shuffle icon path
						width={24}
						height={24}
						alt='shuffle'
						onClick={toggleShuffle}
					/>
					<div className='flex items-center gap-1.5'>
						<Image
							src={'/icons/forward.svg'}
							width={24}
							height={24}
							alt='rewind'
							onClick={rewind}
						/>
						<h2 className='text-12 font-bold text-white-4'>-5</h2>
					</div>
					<Image
						src={isPlaying ? '/icons/Pause.svg' : '/icons/Play.svg'}
						width={30}
						height={30}
						alt='play'
						onClick={togglePlayPause}
					/>
					<div className='flex items-center gap-1.5'>
						<h2 className='text-12 font-bold text-white-4'>+5</h2>
						<Image
							src={'/icons/forward.svg'}
							width={24}
							height={24}
							alt='forward'
							onClick={forward}
						/>
					</div>
					<Image
						src={isRepeat ? '/icons/forward.svg' : '/icons/reverse.svg'} // Change based on repeat state
						width={24}
						height={24}
						alt='repeat'
						onClick={toggleRepeat}
					/>
				</div>
				<div
					className='flex items-center gap-6 relative'
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<h2 className='text-16 font-normal text-white-2 max-md:hidden'>
						{formatTime(duration)}
					</h2>
					<div className='flex w-full gap-2'>
						<Image
							src={isMuted ? '/icons/unmute.svg' : '/icons/mute.svg'}
							width={24}
							height={24}
							alt='mute unmute'
							onClick={toggleMute}
							className='cursor-pointer'
						/>
						{/* Volume slider - show/hide based on conditions */}
						{!isMuted && showVolumeSlider && (
							<input
								type='range'
								min={0}
								max={1}
								step={0.1}
								value={volume}
								onChange={(e) => adjustVolume(Number(e.target.value))}
								className='cursor-pointer transition-opacity duration-300'
							/>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default PodcastPlayer;
