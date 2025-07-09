
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Gift, Star, Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Welcome to Garouli!",
        description: "You'll receive our weekly newsletter with the latest courses and tech insights.",
      });
    }, 1000);
  };

  const benefits = [
    "🎯 Weekly curated course recommendations",
    "🔥 Early access to new expert-led courses", 
    "💡 AI and tech industry insights",
    "🎁 Exclusive free resources and templates",
    "📊 Monthly skills trend reports"
  ];

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You're All Set! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                Welcome to the Garouli community! Check your inbox for a confirmation email.
              </p>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                <Gift className="h-4 w-4 mr-2" />
                Free AI Tools Cheatsheet Coming Your Way!
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Content */}
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Free Weekly Newsletter
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Stay Ahead of the Curve
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Join 57,000+ learners who get our weekly insights on AI, tech trends, 
                  and exclusive course recommendations delivered to their inbox.
                </p>
                
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Form */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Get Started Free
                  </h4>
                  <p className="text-gray-600 text-sm">
                    No spam, unsubscribe anytime
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base border-2 focus:border-blue-500"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Star className="h-5 w-5 mr-2" />
                        Get Free Weekly Insights
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSignup;
