import type { Metadata } from 'next';
import NavigationBar from '@/app/NavigationBar';
import { Geist, Geist_Mono } from 'next/font/google';
import './styles/global/globals.scss';
import './styles/global/layout.scss';
import './styles/global/misc.scss';
import RoomProvider from '@/providers/roomProvider/roomProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Debate Versus Me | Sharpen Your Arguments',
    description:
        'Engage in live debates, challenge opponents, and improve your critical thinking skills on Debate Versus Me.',
    keywords: ['debate', 'argument', 'online debate', 'critical thinking', 'discussion forum', 'live debate'],
    openGraph: {
        title: 'Debate Versus Me | Sharpen Your Arguments',
        description:
            'Engage in live debates, challenge opponents, and improve your critical thinking skills on Debate Versus Me.',
        url: 'https://debatevs.me',
        siteName: 'Debate Versus Me',
        images: [
            {
                url: 'https://debatevs.me/og-image.png', // Replace with your actual OG image
                width: 1200,
                height: 630,
                alt: 'Debate Versus Me: Engage in Live Debates',
            },
        ],
        type: 'website',
    },
    // twitter: {
    //   card: 'summary_large_image',
    //   title: 'Debate Versus Me | Sharpen Your Arguments',
    //   description: 'Engage in live debates, challenge opponents, and improve your critical thinking skills on Debate Versus Me.',
    //   images: ['https://debatevs.me/twitter-image.png'], //Replace with your actual Twitter image
    //   creator: '@YourTwitterHandle', // Replace with your Twitter handle
    // },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RoomProvider>
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
                    <NavigationBar />

                    {children}

                    <footer className="w-full py-4 text-center text-gray-600">
                        <p>© {new Date().getFullYear()} Debate Versus Me</p>
                    </footer>
                </body>
            </html>
        </RoomProvider>
    );
}
