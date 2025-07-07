
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'AI Engineer at Google',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'Minutely transformed my career. The AI-generated content was incredibly comprehensive, and the hands-on projects prepared me perfectly for my role at Google.',
    rating: 5,
    course: 'AI Engineering Bootcamp'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'DevOps Lead at Microsoft',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'The DevOps course was exactly what I needed. The AI teachers provided personalized feedback that helped me land my dream job in just 3 months.',
    rating: 5,
    course: 'DevOps Master Class'
  },
  {
    name: 'Priya Patel',
    role: 'Full-Stack Developer at Stripe',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'Learning full-stack development with AI integration was game-changing. The platform made complex concepts easy to understand and apply.',
    rating: 5,
    course: 'Full-Stack Development with AI'
  },
  {
    name: 'David Kim',
    role: 'ML Engineer at OpenAI',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'The quality of AI-generated content rivals traditional courses. The interactive nature and real-world projects made all the difference.',
    rating: 5,
    course: 'AI Engineering Bootcamp'
  },
  {
    name: 'Emily Johnson',
    role: 'Cloud Architect at AWS',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'Minutely\'s approach to learning is revolutionary. I went from beginner to cloud architect in 6 months. The community support was incredible.',
    rating: 5,
    course: 'DevOps Master Class'
  },
  {
    name: 'Alex Thompson',
    role: 'Startup CTO',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'As a founder, I needed to understand modern tech stacks quickly. Minutely\'s AI-powered courses gave me the knowledge to build and scale my startup.',
    rating: 5,
    course: 'Full-Stack Development with AI'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-gradient">Learners Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful learners who've transformed their careers with Minutely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover-scale">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>

                {/* Course */}
                <div className="text-xs text-primary mb-4 font-medium">
                  {testimonial.course}
                </div>

                {/* Profile */}
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-3">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-muted/30 rounded-full px-8 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Learners</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">95%</div>
              <div className="text-sm text-muted-foreground">Job Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
