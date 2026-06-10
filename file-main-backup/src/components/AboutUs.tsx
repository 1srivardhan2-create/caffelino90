import { ArrowLeft, Heart, TrendingUp, Users, BarChart3, Target, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

export default function AboutUs({ onNavigate }: AboutUsProps) {
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
          
          <h1 className="text-3xl md:text-4xl mb-4">About Caffélino</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            The Café Growth Partner
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-[#be9d80] rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-3">Welcome to Caffélino</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We are a digital platform created to help cafés attract more customers, increase repeat visits, and understand their business better through simple technology.
              </p>
              <p className="text-slate-700 leading-relaxed">
                At Caffélino, we believe <strong>every café deserves the power of data.</strong> Our mission is to make customer loyalty easy, affordable, and effective for cafés of all sizes.
              </p>
            </div>
          </div>
        </Card>

        {/* What We Do Section */}
        <div className="mb-8">
          <h2 className="text-2xl mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#be9d80]" />
            What We Do
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                title: "Help cafés get more loyal customers",
                color: "bg-blue-500"
              },
              {
                icon: BarChart3,
                title: "Provide clear monthly analytics",
                color: "bg-green-500"
              },
              {
                icon: Sparkles,
                title: "Offer digital loyalty points",
                color: "bg-purple-500"
              },
              {
                icon: Heart,
                title: "Enable smart customer engagement",
                color: "bg-pink-500"
              },
              {
                icon: Target,
                title: "Give owners full control over growth",
                color: "bg-orange-500"
              },
              {
                icon: TrendingUp,
                title: "Deliver insights that improve business",
                color: "bg-indigo-500"
              }
            ].map((item, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-slate-700 pt-2">{item.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <h3 className="text-xl mb-3">Who We Serve</h3>
          <p className="text-slate-700 leading-relaxed">
            Caffélino is built for <strong>cafés, tea shops, bakeries, and cloud kitchens</strong> who want to grow without spending big on marketing.
          </p>
        </Card>

        {/* Vision Section */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-[#be9d80] to-[#a88968] text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-3">Our Vision</h2>
              <p className="text-white/95 leading-relaxed text-lg">
                To become India's most trusted café-tech platform empowering small food outlets to scale with digital tools.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-6">
            Ready to grow your café business?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => onNavigate('partner-registration')}
              size="lg"
              className="bg-[#be9d80] hover:bg-[#a88968]"
            >
              Partner with Us
            </Button>
            <Button 
              onClick={() => onNavigate('home')}
              variant="outline"
              size="lg"
            >
              Explore Platform
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
