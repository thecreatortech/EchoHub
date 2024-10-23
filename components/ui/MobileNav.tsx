'use client';
import React from 'react';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MobileNav = () => {
	const pathname = usePathname();
	const sidebarLinks = SidebarLinks(); // Call SidebarLinks to get the array

	return (
		<Sheet>
			<SheetTrigger>
				<Image
					src='/icons/hamburger.svg'
					width={30}
					height={30}
					alt='menu'
					className='cursor-pointer'
				/>
			</SheetTrigger>
			<SheetContent side='left' className='border-none bg-black-1'>
				<Link href={'/'} className='flex cursor-pointer items-center gap-1 pb-10 pl-4'>
					<Image src='/icons/logo.svg' alt='logo' width={50} height={50} />
					<h1 className='text-24 font-extrabold text-white-1 ml-2'>EchoHub</h1>
				</Link>
				<div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
					<SheetClose asChild>
						<nav className='flex h-full flex-col gap-6 text-white-1'>
							{sidebarLinks.map(({ route, label, imgURL }) => {
								const isActive =
									pathname === route || pathname.startsWith(`${route}/`);
								return (
									<SheetClose asChild key={route}>
										<Link
											href={route}
											key={label}
											className={cn(
												'flex gap-3 items-center py-4 max-lg:px-4 justify-start',
												{
													'bg-nav-focus border-r-4 border-orange-1':
														isActive,
												},
											)}
										>
											<Image
												src={imgURL}
												alt='label'
												width={24}
												height={24}
											/>
											<p>{label}</p>
										</Link>
									</SheetClose>
								);
							})}
						</nav>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
