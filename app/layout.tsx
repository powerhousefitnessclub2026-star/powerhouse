import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import { GYM_INFO } from '@/lib/constants/gym-data';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://powerhousefitnessclub.vercel.app';
if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
  siteUrl = 'https://' + siteUrl;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${GYM_INFO.name} | ${GYM_INFO.tagline}`,
  description:
    'Power House Fitness Club — luxury unisex gym with biomechanical equipment, CrossFit rigs, HIIT training, master coaching & ₹500 flat admission fee.',
  keywords: [
    'Power House Fitness Club',
    'Luxury Gym',
    'Unisex Gym',
    'CrossFit',
    'HIIT Workouts',
    'Personal Trainer',
    'Master Coach Harish',
    'Strength Training',
    'Body Transformation',
    'Fitness Club',
  ],
  authors: [{ name: 'Power House Fitness Club' }],
  creator: 'Power House Fitness Club',
  verification: {
    google: 'Mokinr5jabLiHRYb8M8reTZ7eRvqPYvrfQMO2ct11VY',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: `${GYM_INFO.name} | Premium Fitness Sanctuary`,
    description:
      'Shaping Athletes. Forging Results. Premium unisex gym equipped with state-of-the-art strength and cardio rigs.',
    siteName: GYM_INFO.name,
    images: [
      {
        url: `${siteUrl}/assets/assets/group-photo.jpg`,
        width: 1200,
        height: 630,
        alt: 'Power House Fitness Club Athletes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${GYM_INFO.name} | Premium Fitness Sanctuary`,
    description: 'Shaping Athletes. Forging Results. Premium unisex gym equipped with state-of-the-art rigs.',
    images: [`${siteUrl}/assets/assets/group-photo.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
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

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD LocalBusiness / Gym Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: GYM_INFO.name,
    image: `${siteUrl}/assets/assets/gym-logo-cropped.png`,
    description:
      'Premier luxury unisex fitness center offering CrossFit, HIIT, strength training, and master coaching.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: GYM_INFO.address,
      addressCountry: 'IN',
    },
    telephone: GYM_INFO.phone,
    email: GYM_INFO.email,
    priceRange: '₹1,999 - ₹14,999',
    openingHoursSpecification: GYM_INFO.workingHours.map((wh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: wh.days.includes('Monday')
        ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        : ['Sunday'],
      opens: wh.time.split(' - ')[0],
      closes: wh.time.split(' - ')[1],
    })),
  };

  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} dark scroll-smooth`}>
      <head>
        <meta name="google-site-verification" content="Mokinr5jabLiHRYb8M8reTZ7eRvqPYvrfQMO2ct11VY" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white font-sans antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
