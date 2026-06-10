import { ArrowLeft, Users, Calendar, Receipt, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  const steps = [
    {
      number: 1,
      icon: Users,
      title: "Sign Up & Create Profile",
      description: "Join Caffélino and set up your personal profile to start connecting with friends and family.",
      color: "bg-[#8b5943]",
      details: [
        "Quick and easy registration",
        "Personalize your profile",
        "Connect with loved ones",
        "Secure and private"
      ]
    },
    {
      number: 2,
      icon: Calendar,
      title: "Create Group",
      description: "Invite friends or family to your meetup and choose from your favorite cafés.",
      color: "bg-[#8b5943]",
      details: [
        "Create private meetup groups",
        "Invite friends & family",
        "Vote on café selection together",
        "Choose from up to 3 cafés"
      ]
    },
    {
      number: 3,
      icon: Receipt,
      title: "Split Bills Easily",
      description: "Order together and split the bill equally among all group members.",
      color: "bg-[#8b5943]",
      details: [
        "Automatic bill splitting",
        "Equal distribution among members",
        "Multiple payment options",
        "Transparent and fair"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#be9d80] to-[#8b5943] text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>
          
          <h1 className="text-3xl md:text-4xl mb-4">How It Works</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Plan meetups with friends and family in just 3 simple steps
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Process Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center md:items-start gap-3 flex-shrink-0">
                  <Badge className={`${step.color} text-white border-0 text-lg px-4 py-2`}>
                    Step {step.number}
                  </Badge>
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-2xl mb-3">{step.title}</h2>
                  <p className="text-slate-700 leading-relaxed mb-4 text-lg">
                    {step.description}
                  </p>
                  
                  {/* Details List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="flex md:hidden justify-center mt-6">
                  <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-[rgba(139,89,67,0.1)] to-[rgba(217,191,157,0.2)] border-[#8b5943]/20 mb-8">
          <h2 className="text-2xl mb-4 text-[#0a0a0a]">Perfect for Gatherings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Friends & Family meetups",
              "Vote on café together",
              "Equal bill splitting",
              "Group chat & menu sharing",
              "Real-time order tracking",
              "Multiple payment options",
              "Private and secure",
              "Easy to use interface"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8b5943] rounded-full"></div>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-slate-600 mb-6 text-lg">
            Ready to plan your next meetup?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => onNavigate('home')}
              size="lg"
              className="bg-[#8b5943] hover:bg-[#7a4a35] text-white"
            >
              Get Started Now
            </Button>
            <Button 
              onClick={() => onNavigate('about-us')}
              variant="outline"
              size="lg"
              className="border-[#8b5943] text-[#8b5943] hover:bg-[#8b5943]/10"
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}