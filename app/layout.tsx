import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import ConvexClerkProvider from '../providers/ConvexClerkProvider';
import AudioProvider from '@/providers/AudioProvider';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

const manrope = Manrope({ subsets: ['latin'] });
export const metadata: Metadata = {
	title: 'EchoHub',
	description: 'Saas podcaster called EchoHub',
	icons: {
		icon: '/icons/logo.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConvexClerkProvider>
			<html lang='en'>
				<AudioProvider>
					<body className={manrope.className}>{children}</body>
				</AudioProvider>
			</html>
		</ConvexClerkProvider>
	);
}
