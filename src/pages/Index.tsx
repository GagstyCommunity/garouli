
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedCourses from '@/components/FeaturedCourses';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedCourses />
      <HowItWorks />
      <Testimonials />
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Minutely</span>
                  <span className="text-xs text-muted-foreground -mt-1">Tech AI Labs</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                Empowering the next generation of tech professionals with AI-powered education. 
                100% free, forever.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/courses" className="hover:text-primary transition-colors">Courses</a></li>
                <li><a href="/community" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="/jobs" className="hover:text-primary transition-colors">Jobs</a></li>
                <li><a href="/companies" className="hover:text-primary transition-colors">For Companies</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Minutely by Tech AI Labs. All rights reserved. Built with 💙 by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
