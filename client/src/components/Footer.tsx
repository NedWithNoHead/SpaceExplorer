import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-space-black bg-opacity-80 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side with logo and description */}
          <div className="w-full md:w-auto mb-6 md:mb-0">
            <Link href="/" className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="21.17" y1="8" x2="12" y2="8"></line>
                <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
              </svg>
              <h2 className="text-lg font-bold tracking-wider text-white">
                SPACE<span className="text-primary">EXPLORER</span>
              </h2>
            </Link>
            
            <p className="text-muted-foreground text-sm mb-2 max-w-md">
              Explore the wonders of space through NASA's open APIs. Discover daily astronomy pictures, Mars rover photos, and asteroid data.
            </p>
            
            {/* Hidden on larger screens, mobile only */}
            <div className="md:hidden mt-4">
              <div className="flex items-center mb-2 justify-center">
                <span className="text-white text-sm mr-2">Developed by:</span>
                <a href="https://tinle.xyz/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-blue-400 font-medium text-sm transition-colors">
                  Tin Le
                </a>
              </div>
              
              <div className="flex justify-center space-x-4">
                <a href="https://www.linkedin.com/in/tintrungle/" target="_blank" rel="noopener noreferrer" 
                   className="text-muted-foreground hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                
                <a href="https://github.com/NedWithNoHead/SpaceExplorer" target="_blank" rel="noopener noreferrer" 
                   className="text-muted-foreground hover:text-gray-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Right side with developer information */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-2">
              <span className="text-white text-sm mr-2">Developed by:</span>
              <span className="text-primary font-medium text-sm">Tin Le</span>
            </div>
            
            <div className="hidden md:flex space-x-3 mb-3">
              <a href="https://tinle.xyz/" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </a>
              
              <a href="https://www.linkedin.com/in/tintrungle/" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              
              <a href="https://github.com/NedWithNoHead" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-gray-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              
              <a href="https://github.com/NedWithNoHead/SpaceExplorer" target="_blank" rel="noopener noreferrer" 
                 className="text-muted-foreground hover:text-green-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </a>
            </div>
            
            <p className="text-muted-foreground text-sm text-center md:text-right">
              Powered by <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NASA Open APIs</a>
            </p>
            
            <p className="text-muted-foreground text-sm text-center md:text-right mt-1">
              © {new Date().getFullYear()} Space Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
