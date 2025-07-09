
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Check, 
  CreditCard, 
  Users, 
  BarChart, 
  Briefcase,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AgencySignup = () => {
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    workEmail: '',
    password: '',
    contactName: '',
    phone: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: signup, 2: verification, 3: payment

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Unlimited Team Members",
      description: "Add unlimited instructors and managers to your agency account"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Track student progress, completion rates, and engagement metrics"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Job Board Access",
      description: "Post unlimited job openings and access our talent pool"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Brand Customization",
      description: "Customize your agency profile and course branding"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Tools",
      description: "Access AI course generation and content optimization tools"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Reach",
      description: "Distribute courses worldwide through our platform"
    }
  ];

  const pricingFeatures = [
    "3-month free trial",
    "No setup fees",
    "Cancel anytime",
    "24/7 support",
    "Custom integrations",
    "White-label options"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateWorkEmail = (email: string) => {
    // Basic work email validation - should not be from common free providers
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !freeProviders.includes(domain);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate work email
      if (!validateWorkEmail(formData.workEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please use your work email address, not a personal email.",
          variant: "destructive"
        });
        return;
      }

      // Sign up the user
      const { error } = await signUp(formData.workEmail, formData.password, {
        fullName: formData.contactName,
        role: 'enterprise',
        companyName: formData.companyName,
        phone: formData.phone
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setStep(2);
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account."
      });

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    
    try {
      // In production, integrate with Stripe Checkout
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create subscription record
      if (user) {
        await supabase.from('agency_subscriptions').insert({
          user_id: user.id,
          status: 'trial',
          trial_end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months
          annual_fee: 2000.00
        });
      }

      toast({
        title: "Welcome to Garouli!",
        description: "Your 3-month free trial has started. No charges until the trial ends."
      });

      // Redirect to agency dashboard
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Stripe error:', error);
      toast({
        title: "Payment Setup Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Launch Your Agency on Garouli
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Create courses, manage students, and grow your business with our enterprise platform
            </p>
            <div className="flex justify-center items-center gap-4">
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                3-Month Free Trial
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                $2,000/year after trial
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side - Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Everything you need to succeed
                </h2>
                <div className="grid gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Transparent Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pricingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Signup Form */}
            <div>
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-6 w-6" />
                      Get Started Today
                    </CardTitle>
                    <CardDescription>
                      Create your agency account and start your free trial
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Your Agency Name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="workEmail">Work Email</Label>
                        <Input
                          id="workEmail"
                          name="workEmail"
                          type="email"
                          value={formData.workEmail}
                          onChange={handleInputChange}
                          placeholder="you@company.com"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Must be a business email (not Gmail, Yahoo, etc.)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Your Full Name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Choose a strong password"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))
                          }
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the Terms of Service and Privacy Policy
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !formData.agreeToTerms}
                      >
                        {loading ? 'Creating Account...' : 'Start Free Trial'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                      We've sent a verification link to {formData.workEmail}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Please check your email and click the verification link to continue.
                      Once verified, you can proceed to set up billing.
                    </p>
                    <Button onClick={() => setStep(3)} className="w-full">
                      I've Verified My Email
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Setup Payment Method</CardTitle>
                    <CardDescription>
                      Add a payment method to start your 3-month free trial
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Free Trial Details</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• 3 months completely free</li>
                        <li>• No charges until trial expires</li>
                        <li>• Cancel anytime during trial</li>
                        <li>• Full access to all features</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Payment Information</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        We'll securely store your payment method but won't charge until your trial ends.
                      </p>
                      
                      {/* Stripe Elements would go here */}
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Stripe payment form would appear here</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Secure payment processing by Stripe
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleStripeCheckout}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Complete Setup & Start Trial'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By continuing, you agree to our Terms of Service and Privacy Policy.
                      You can cancel anytime during your free trial.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgencySignup;
