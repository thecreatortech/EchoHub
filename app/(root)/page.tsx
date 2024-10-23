'use client';
import { Button } from '@/components/ui/button';
import PodcastCard from '@/components/ui/PodcastCard';
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import PodcastList from '@/components/ui/PodcastList';

const home = () => {
	const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
	const latestPodcasts = useQuery(api.podcasts.getLatestPodcasts);
	return (
		<div className='mt-9 flex flex-col gap-9 md:overflow-hidden'>
			<section className='flex flex-col gap-5'>
				<h1 className='text-20 font-bold text-white-1'>Trending Podcast</h1>

				<div className='podcast_grid'>
					{trendingPodcasts?.map(
						({ _id, podcastTitle, imageUrl, podcastDescription }) => (
							<PodcastCard
								key={_id}
								imgUrl={imageUrl}
								title={podcastTitle}
								description={podcastDescription}
								podcastId={_id}
							/>
						),
					)}
				</div>

				{/* Latest Podcasts Section */}
				<div className='font-16 text-white-1'>
					<h2 className='text-20 font-bold text-white-1 mt-5'>Latest Podcasts</h2>
					{latestPodcasts ? (
						<PodcastList
							podcasts={latestPodcasts.map((podcast) => ({
								podcastId: podcast._id,
								imgUrl: podcast.imageUrl,
								title: podcast.podcastTitle,
								description: podcast.podcastDescription,
								views: podcast.views,
								audioDuration: podcast.audioDuration,
							}))}
						/>
					) : (
						<p>Loading latest podcasts...</p>
					)}
				</div>
			</section>
		</div>
	);
};

export default home;
