import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Space Explorer - NASA APOD & Space Data</title>
        <meta name="description" content="Explore the wonders of space through NASA's open APIs. View the Astronomy Picture of the Day, Mars rover photos, and asteroid data." />
        <meta property="og:title" content="Space Explorer - NASA Space Data" />
        <meta property="og:description" content="Discover the cosmos with daily astronomy pictures, Mars rover images, and asteroid tracking." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative flex flex-col min-h-screen overflow-hidden bg-space-black">
        {/* Star field background */}
        <div className="star-field absolute inset-0 -z-10" aria-hidden="true">
          {/* Stars are added via CSS */}
        </div>

        <Navigation />
        
        <main className="flex-grow">
          <HeroSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
