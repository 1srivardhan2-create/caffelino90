import { useState } from 'react';
import { ArrowLeft, AlertCircle, Bug, ShieldAlert, CreditCard, UserX, MessageSquare, Camera, Upload, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';

interface ReportProblemProps {
  onNavigate: (page: string) => void;
  user: any;
}

type ReportType = 'bug' | 'inappropriate' | 'payment' | 'safety' | 'harassment' | 'other';

const REPORT_CATEGORIES = [
  {
    id: 'bug' as ReportType,
    icon: <Bug className="size-6" />,
    title: 'Technical Issue / Bug',
    description: 'App crashes, errors, or not working properly',
    color: 'text-orange-600 bg-orange-50'
  },
  {
    id: 'inappropriate' as ReportType,
    icon: <ShieldAlert className="size-6" />,
    title: 'Inappropriate Content',
    description: 'Offensive posts, images, or behavior',
    color: 'text-red-600 bg-red-50'
  },
  {
    id: 'payment' as ReportType,
    icon: <CreditCard className="size-6" />,
    title: 'Payment Issue',
    description: 'Problems with payments, refunds, or billing',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'safety' as ReportType,
    icon: <AlertCircle className="size-6" />,
    title: 'Safety Concern',
    description: 'Feel unsafe or uncomfortable',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    id: 'harassment' as ReportType,
    icon: <UserX className="size-6" />,
    title: 'Harassment or Abuse',
    description: 'Report harassment, bullying, or abusive behavior',
    color: 'text-red-700 bg-red-50'
  },
  {
    id: 'other' as ReportType,
    icon: <MessageSquare className="size-6" />,
    title: 'Other Issue',
    description: 'Something else not listed here',
    color: 'text-slate-600 bg-slate-50'
  }
];

export default function ReportProblem({ onNavigate, user }: ReportProblemProps) {
  const [step, setStep] = useState<'category' | 'details' | 'success'>('category');
  const [selectedCategory, setSelectedCategory] = useState<ReportType | null>(null);
  const [reportData, setReportData] = useState({
    subject: '',
    description: '',
    location: '',
    groupId: '',
    userId: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const handleCategorySelect = (category: ReportType) => {
    setSelectedCategory(category);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportData.subject || !reportData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock submission
    console.log('Report submitted:', {
      category: selectedCategory,
      ...reportData,
      screenshots,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });

    toast.success('Report submitted successfully');
    setStep('success');
  };

  const handleScreenshotUpload = () => {
    // Mock file upload
    const mockScreenshot = `https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400`;
    setScreenshots([...screenshots, mockScreenshot]);
    toast.success('Screenshot uploaded');
  };

  const getCategoryInfo = () => {
    return REPORT_CATEGORIES.find(cat => cat.id === selectedCategory);
  };

  // Category Selection View
  const renderCategorySelection = () => (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-[24px] leading-[32px] text-neutral-950 mb-2">
          What type of issue are you experiencing?
        </h2>
        <p className="text-[14px] text-slate-600">
          Select the category that best describes your problem
        </p>
      </div>

      <div className="grid gap-3">
        {REPORT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="w-full text-left p-4 rounded-[12px] border-2 border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`${category.color} p-3 rounded-[8px] transition-transform group-hover:scale-110`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] text-neutral-950 mb-1">
                  {category.title}
                </h3>
                <p className="text-[14px] text-slate-600">
                  {category.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200 p-4 mt-6">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-[14px] text-blue-900">
            <strong>Need immediate help?</strong> If you're in danger or experiencing an emergency, 
            please contact local authorities immediately.
          </div>
        </div>
      </Card>
    </div>
  );

  // Details Form View
  const renderDetailsForm = () => {
    const categoryInfo = getCategoryInfo();
    
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Header */}
        <Card className={`${categoryInfo?.color} border-0 p-4`}>
          <div className="flex items-center gap-3">
            {categoryInfo?.icon}
            <div>
              <h3 className="text-[16px]">{categoryInfo?.title}</h3>
              <p className="text-[12px] opacity-80">{categoryInfo?.description}</p>
            </div>
          </div>
        </Card>

        {/* Subject */}
        <div>
          <Label htmlFor="subject" className="text-neutral-950 mb-2 block">
            Subject <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subject"
            value={reportData.subject}
            onChange={(e) => setReportData({ ...reportData, subject: e.target.value })}
            placeholder="Brief summary of the issue"
            className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-neutral-950 mb-2 block">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={reportData.description}
            onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
            placeholder="Please provide as much detail as possible about the issue..."
            className="bg-slate-100 border-0 rounded-[8px] min-h-[120px]"
            required
          />
          <p className="text-[12px] text-slate-500 mt-1">
            Include what happened, when it happened, and any steps to reproduce the issue
          </p>
        </div>

        {/* Location (where in the app) */}
        <div>
          <Label htmlFor="location" className="text-neutral-950 mb-2 block">
            Where did this happen?
          </Label>
          <select
            id="location"
            value={reportData.location}
            onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
            className="w-full h-[44px] px-3 rounded-[8px] bg-slate-100 border-0"
          >
            <option value="">Select location</option>
            <option value="home">Home Page</option>
            <option value="group-detail">Group Detail Page</option>
            <option value="chat">Chat/Messages</option>
            <option value="cafe-menu">Café Menu</option>
            <option value="payment">Payment Page</option>
            <option value="profile">Profile Page</option>
            <option value="notifications">Notifications</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Report specific user (for harassment/inappropriate content) */}
        {(selectedCategory === 'harassment' || selectedCategory === 'inappropriate') && (
          <div>
            <Label htmlFor="userId" className="text-neutral-950 mb-2 block">
              User ID or Name (if reporting a user)
            </Label>
            <Input
              id="userId"
              value={reportData.userId}
              onChange={(e) => setReportData({ ...reportData, userId: e.target.value })}
              placeholder="Enter user ID or name"
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
            />
          </div>
        )}

        {/* Group ID (optional) */}
        <div>
          <Label htmlFor="groupId" className="text-neutral-950 mb-2 block">
            Related Group ID (if applicable)
          </Label>
          <Input
            id="groupId"
            value={reportData.groupId}
            onChange={(e) => setReportData({ ...reportData, groupId: e.target.value })}
            placeholder="Enter group ID if issue is related to a specific group"
            className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
          />
        </div>

        {/* Urgency */}
        <div>
          <Label className="text-neutral-950 mb-3 block">
            Urgency Level
          </Label>
          <RadioGroup
            value={reportData.urgency}
            onValueChange={(value: any) => setReportData({ ...reportData, urgency: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 rounded-[8px] border border-slate-200 hover:bg-slate-50">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="flex-1 cursor-pointer">
                <span className="text-[14px] text-neutral-950">Low - Can wait a few days</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-[8px] border border-slate-200 hover:bg-slate-50">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="flex-1 cursor-pointer">
                <span className="text-[14px] text-neutral-950">Medium - Should be addressed soon</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-[8px] border border-slate-200 hover:bg-slate-50">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="flex-1 cursor-pointer">
                <span className="text-[14px] text-neutral-950">High - Needs immediate attention</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Screenshots */}
        <div>
          <Label className="text-neutral-950 mb-2 block">
            Screenshots (optional)
          </Label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleScreenshotUpload}
              className="w-full h-[100px] border-2 border-dashed border-slate-300 rounded-[8px] hover:border-indigo-500 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 text-slate-600"
            >
              <Camera className="size-6" />
              <span className="text-[14px]">Upload Screenshot</span>
            </button>

            {screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-20 object-cover rounded-[8px]"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshots(screenshots.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-[12px] text-slate-500 mt-2">
            Screenshots help us understand and resolve your issue faster
          </p>
        </div>

        {/* Contact Information */}
        <Card className="bg-slate-50 border-slate-200 p-4">
          <h4 className="text-[14px] text-neutral-950 mb-2">Your Contact Information</h4>
          <div className="text-[12px] text-slate-600 space-y-1">
            <p>Email: {user?.email}</p>
            <p>User ID: {user?.id}</p>
            <p className="mt-2">
              We'll use this information to follow up on your report. Your report is confidential.
            </p>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('category')}
            className="flex-1 h-[44px] rounded-[8px]"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
          >
            Submit Report
          </Button>
        </div>
      </form>
    );
  };

  // Success View
  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="mb-6 flex justify-center">
        <div className="bg-green-100 p-6 rounded-full">
          <CheckCircle className="size-16 text-green-600" />
        </div>
      </div>

      <h2 className="text-[24px] leading-[32px] text-neutral-950 mb-3">
        Report Submitted Successfully
      </h2>

      <p className="text-[16px] text-slate-600 mb-8 max-w-md mx-auto">
        Thank you for helping us make Caffélino safer and better. We've received your report 
        and our team will review it within 24-48 hours.
      </p>

      <Card className="bg-slate-50 border-slate-200 p-6 max-w-md mx-auto mb-8 text-left">
        <h3 className="text-[16px] text-neutral-950 mb-3">What happens next?</h3>
        <ul className="space-y-2 text-[14px] text-slate-600">
          <li className="flex gap-2">
            <span>1.</span>
            <span>Our team will review your report within 24-48 hours</span>
          </li>
          <li className="flex gap-2">
            <span>2.</span>
            <span>We may reach out via email if we need more information</span>
          </li>
          <li className="flex gap-2">
            <span>3.</span>
            <span>You'll receive an update once the issue is resolved</span>
          </li>
        </ul>
      </Card>

      <div className="space-y-3 max-w-md mx-auto">
        <Button
          onClick={() => {
            setStep('category');
            setSelectedCategory(null);
            setReportData({
              subject: '',
              description: '',
              location: '',
              groupId: '',
              userId: '',
              urgency: 'medium',
            });
            setScreenshots([]);
          }}
          variant="outline"
          className="w-full h-[44px] rounded-[8px]"
        >
          Report Another Issue
        </Button>

        <Button
          onClick={() => onNavigate('settings')}
          className="w-full h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
        >
          Back to Settings
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen w-full pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => step === 'category' ? onNavigate('settings') : setStep('category')}
              className="caffelino-back-btn"
            >
              ← Back
            </button>
            <h1 className="text-[24px] leading-[32px] text-neutral-950">
              {step === 'category' && 'Report a Problem'}
              {step === 'details' && 'Report Details'}
              {step === 'success' && 'Report Submitted'}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {step === 'category' && renderCategorySelection()}
        {step === 'details' && renderDetailsForm()}
        {step === 'success' && renderSuccess()}
      </div>
    </div>
  );
}
