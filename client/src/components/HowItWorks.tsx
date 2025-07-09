
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Code, 
  Users, 
  Briefcase,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    icon: BookOpen,
    title: 'Choose Your Path',
    description: 'Browse AI-generated courses in AI, DevOps, and tech skills. Each course is tailored to industry demands.',
    step: '01'
  },
  {
    icon: Code,
    title: 'Learn by Doing',
    description: 'Engage with interactive content, code directly in the browser, and build real projects with AI assistance.',
    step: '02'
  },
  {
    icon: Users,
    title: 'Join the Community',
    description: 'Connect with fellow learners, get help from AI mentors, and collaborate on exciting projects.',
    step: '03'
  },
  {
    icon: Briefcase,
    title: 'Get Hired',
    description: 'Showcase your projects, apply to partner companies, and land your dream job with our placement support.',
    step: '04'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient">Minutely</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform makes learning tech skills simple, engaging, and effective.
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines - Hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center h-full bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover-scale">
                  <CardHeader className="pb-4">
                    {/* Step Number */}
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <step.icon size={32} className="text-primary" />
                    </div>
                    
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary/50">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-sm text-muted-foreground">
              Personalized curriculum adapted to your learning style and pace.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold mb-2">Interactive Projects</h3>
            <p className="text-sm text-muted-foreground">
              Build real-world applications that showcase your skills to employers.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold mb-2">Industry Recognition</h3>
            <p className="text-sm text-muted-foreground">
              Earn certificates recognized by top tech companies worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
