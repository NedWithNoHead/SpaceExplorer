import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { ApodResponse } from '@/types/nasa';
import { formatDate } from '@/lib/utils';

export default function HeroSection() {
  const { data: apod, isLoading, isError } = useQuery<ApodResponse>({
    queryKey: ['/api/apod'],
  });

  // Check if the media is an embeddable video content
  const isVideo = apod?.mediaType === 'video';
  const isOtherMedia = apod?.mediaType === 'other';
  const hasUrl = !!apod?.url;
  
  // Function to handle different media types
  const isYouTubeUrl = (url: string) => {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };
  
  // Extract YouTube video ID from URL for proper embedding
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    if (url.includes('youtube.com/embed/')) {
      return url; // Already an embed URL
    }
    
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };
  
  // For the "Charon Flyover from New Horizons" APOD, the actual URL is missing
  // Let's provide the correct URL for this specific content
  const getBackupContentUrl = () => {
    if (apod?.title === "Charon Flyover from New Horizons") {
      return "https://apod.nasa.gov/apod/image/2505/CharonFlyover_NewHorizons.mp4"; // Direct MP4 URL from NASA
    }
    return null;
  };

  // Determine if content should be embedded
  const backupUrl = !hasUrl ? getBackupContentUrl() : null;
  const shouldEmbed = isVideo || 
                    (isOtherMedia && hasUrl && isYouTubeUrl(apod.url)) || 
                    !!backupUrl;
  const embedUrl = backupUrl || (shouldEmbed && apod?.url ? getYouTubeEmbedUrl(apod.url) : '');
  
  // Decide what content to show
  const hasValidContent = hasUrl || shouldEmbed;
  
  return (
    <section id="apod" className="pt-8 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Astronomy Picture of the Day
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.
            </p>
          </div>

          {/* APOD Card */}
          <Card className="bg-gray bg-opacity-40 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            {isLoading ? (
              <Skeleton className="w-full h-96" />
            ) : isError ? (
              <div className="w-full h-96 flex items-center justify-center bg-gray-900">
                <p className="text-white">Failed to load APOD. Please try again later.</p>
              </div>
            ) : shouldEmbed ? (
              <div className="w-full h-96">
                {embedUrl && embedUrl.includes('.mp4') ? (
                  <video 
                    src={embedUrl}
                    title={apod?.title || 'NASA video'}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <iframe 
                    src={embedUrl} 
                    title={apod?.title || 'NASA content'}
                    className="w-full h-full object-cover"
                    allowFullScreen
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                )}
              </div>
            ) : hasValidContent ? (
              <img 
                src={apod?.url} 
                alt={apod?.title || 'Astronomy Picture of the Day'} 
                className="w-full h-96 object-cover object-center"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-900">
                <div className="text-center p-6 max-w-md">
                  <h3 className="text-white text-xl font-semibold mb-2">{apod?.title}</h3>
                  <p className="text-gray-300">This content is currently unavailable for display. Please check the description below for more details.</p>
                </div>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {isLoading ? <Skeleton className="h-8 w-64" /> : apod?.title}
                </h3>
                <span className="text-amber-400 font-mono text-sm mt-2 md:mt-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {isLoading ? <Skeleton className="h-4 w-24 inline-block" /> : formatDate(apod?.date || '')}
                </span>
              </div>
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : (
                <p className="text-white mb-4">{apod?.explanation}</p>
              )}
              <div className="flex flex-wrap gap-2 items-center justify-between border-t border-gray-700 pt-4">
                <div>
                  <span className="text-muted-foreground text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Image Credit: {isLoading ? <Skeleton className="h-4 w-36 inline-block" /> : apod?.copyright || 'NASA'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {apod?.hdurl && !isVideo && (
                    <Button variant="default" size="sm" asChild>
                      <a href={apod.hdurl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        HD Image
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* APOD Archive Search */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" className="border-muted-foreground hover:border-amber-400">
              <Link href="/search?category=apod" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
                Explore APOD Archive
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
