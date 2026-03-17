import { ArrowLeft, Shield, Lock, CreditCard, BadgeCheck, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface SafetyGuidelinesProps {
  onNavigate: (page: string) => void;
}

export default function SafetyGuidelines({ onNavigate }: SafetyGuidelinesProps) {
  const guidelines = [
    {
      icon: Lock,
      title: "Data Privacy Protection",
      color: "bg-blue-500",
      points: [
        "We never share personal data with third parties",
        "All café and customer information is encrypted and securely stored",
        "Your data is protected with industry-standard security protocols",
        "Regular security audits ensure maximum protection"
      ]
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      color: "bg-green-500",
      points: [
        "Transactions handled through trusted partners like Razorpay/Paytm",
        "100% safety compliance with payment regulations",
        "No storage of sensitive payment information",
        "SSL encryption for all financial transactions"
      ]
    },
    {
      icon: BadgeCheck,
      title: "Verified Cafés Only",
      color: "bg-purple-500",
      points: [
        "Every café goes through a verification check",
        "Business licenses and FSSAI registration verified",
        "Ensures authenticity and safety of all partners",
        "Regular quality audits of partner establishments"
      ]
    },
    {
      icon: Shield,
      title: "Safe Interaction",
      color: "bg-orange-500",
      points: [
        "QR codes are unique and secure for each café",
        "Customer information only visible after voluntary check-in",
        "No sharing of personal details without consent",
        "Protected from unauthorized access"
      ]
    },
    {
      icon: FileCheck,
      title: "Compliance",
      color: "bg-indigo-500",
      points: [
        "Follows RBI rules for settlements and banking operations",
        "Compliant with Indian digital policies and data protection laws",
        "Adheres to IT Act, 2000 and related amendments",
        "Regular compliance reviews and updates"
      ]
    },
    {
      icon: AlertCircle,
      title: "Fair Use",
      color: "bg-pink-500",
      points: [
        "Clear community guidelines for all users",
        "Encourages respectful usage from cafés and customers",
        "Zero-tolerance policy for misuse or fraud",
        "Report system for any suspicious activity"
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
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl">Safety Guidelines</h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Your safety and data protection are our top priorities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Introduction Card */}
        <Card className="p-6 md:p-8 mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl mb-3">Our Commitment to Safety</h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                At Caffélino, we follow strict security protocols to keep both café owners and customers safe. We are committed to maintaining the highest standards of data protection and user safety.
              </p>
            </div>
          </div>
        </Card>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guidelines.map((guideline, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${guideline.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <guideline.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl">{guideline.title}</h3>
              </div>

              {/* Points */}
              <ul className="space-y-3">
                {guideline.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-slate-600 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Security Badges Section */}
        <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <h2 className="text-2xl mb-4">Security Certifications</h2>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-green-600 text-white border-0 px-4 py-2">
              SSL Encrypted
            </Badge>
            <Badge className="bg-blue-600 text-white border-0 px-4 py-2">
              PCI-DSS Compliant
            </Badge>
            <Badge className="bg-purple-600 text-white border-0 px-4 py-2">
              RBI Guidelines
            </Badge>
            <Badge className="bg-orange-600 text-white border-0 px-4 py-2">
              IT Act 2000
            </Badge>
            <Badge className="bg-indigo-600 text-white border-0 px-4 py-2">
              ISO 27001 Ready
            </Badge>
          </div>
        </Card>

        {/* User Rights Section */}
        <Card className="p-6 md:p-8 mb-8">
          <h2 className="text-2xl mb-4 flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-[#be9d80]" />
            Your Rights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Right to access your data",
              "Right to delete your account",
              "Right to opt-out of communications",
              "Right to data portability",
              "Right to know how data is used",
              "Right to update information"
            ].map((right, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <BadgeCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{right}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact for Safety Concerns */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-[#be9d80] to-[#a88968] text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl mb-3">Report Safety Concerns</h2>
              <p className="text-white/95 leading-relaxed">
                If you encounter any safety issues or have concerns about data privacy, please contact our support team immediately. We take all reports seriously.
              </p>
            </div>
            <Button 
              onClick={() => onNavigate('report-problem')}
              className="bg-white text-[#be9d80] hover:bg-white/90 flex-shrink-0"
              size="lg"
            >
              Report Issue
            </Button>
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-6 text-lg">
            Questions about our safety measures?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => onNavigate('home')}
              variant="outline"
              size="lg"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => onNavigate('how-it-works')}
              size="lg"
              className="bg-[#be9d80] hover:bg-[#a88968]"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
