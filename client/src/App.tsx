import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import MarsRoverPage from "@/pages/MarsRoverPage";
import AsteroidsPage from "@/pages/AsteroidsPage";
import SearchPage from "@/pages/SearchPage";
import { ThemeProvider } from "next-themes";
import { Helmet } from "react-helmet";
import StarField from "@/components/StarField";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/mars" component={MarsRoverPage} />
      <Route path="/asteroids" component={AsteroidsPage} />
      <Route path="/search" component={SearchPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Helmet>
            <title>Space Explorer</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet" />
          </Helmet>
          <StarField />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
