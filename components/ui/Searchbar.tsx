import React, { useEffect, useState } from 'react';
import { Input } from './input';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/useDebounce';

const Searchbar = () => {
	const [search, setSearch] = useState();
	const pathname = usePathname();

	const debouncedValue = useDebounce(search, 500);

	const router = useRouter();
	useEffect(() => {
		if (debouncedValue) {
			debouncedValue;
			router.push(`/discover?search=${debouncedValue}`);
		} else if (!debouncedValue && pathname === '/discover') router.push('/discover');
	}, [router, pathname, debouncedValue]);

	return (
		<div className='relative mt-8 block transition-all duration-500'>
			<Input
				className='input-class py-6 pl-12 focus-visible:ring-orange-1'
				placeholder='Search for Podcasts'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onLoad={() => setSearch('')}
			/>

			<div className='absolute inset-y-0 left-4 flex items-center'>
				<Image
					src='/icons/search.svg'
					alt='search'
					height={20}
					width={20}
					className='center'
				/>
			</div>
		</div>
	);
};

export default Searchbar;
