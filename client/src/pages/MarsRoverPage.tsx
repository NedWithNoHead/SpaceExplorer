import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MarsGallery from '@/components/mars/MarsGallery';

export default function MarsRoverPage() {
  return (
    <>
      <Helmet>
        <title>Mars Rover Photos - Space Explorer</title>
        <meta name="description" content="Explore photos taken by the Mars Curiosity rover. Filter by camera type and date to see high-resolution images of the Martian surface." />
        <meta property="og:title" content="Mars Rover Gallery - Space Explorer" />
        <meta property="og:description" content="Browse through NASA's Curiosity rover photos with filters for camera types and dates." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative flex flex-col min-h-screen overflow-hidden bg-space-black">
        {/* Star field background */}
        <div className="star-field absolute inset-0 -z-10" aria-hidden="true">
          {/* Stars are added via CSS */}
        </div>

        <Navigation />
        
        <main className="flex-grow">
          <MarsGallery />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
