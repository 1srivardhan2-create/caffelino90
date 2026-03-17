import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Upload, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface RestaurantBillScanProps {
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

interface ExtractedBillData {
  totalAmount: number;
  restaurantName: string;
  date: string;
  time: string;
  billNumber?: string;
}

export default function RestaurantBillScan({ onNavigate, onBack }: RestaurantBillScanProps) {
  const [step, setStep] = useState<'code' | 'scan' | 'preview'>('code');
  const [orderCode, setOrderCode] = useState('');
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [groupData, setGroupData] = useState<any>(null);
  const [billImage, setBillImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Mock validation - In production, this would call a backend API
  const handleVerifyCode = async () => {
    if (!orderCode.trim()) {
      toast.error('Please enter an order code');
      return;
    }

    setVerifyingCode(true);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - accept any 6-character alphanumeric code
      if (orderCode.length === 6) {
        const mockGroupData = {
          code: orderCode,
          groupName: "Sarah's Meetup",
          adminName: 'Sarah Johnson',
          memberCount: 5,
          cafeName: 'Café Milano',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'active'
        };
        setGroupData(mockGroupData);
        setStep('scan');
        toast.success('Order code verified successfully!');
      } else {
        toast.error('Invalid or expired order code');
      }
      setVerifyingCode(false);
    }, 1500);
  };

  // Mock OCR processing - In production, this would use a real OCR service
  const processImageOCR = async (imageUrl: string): Promise<ExtractedBillData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock extracted data
        const mockData: ExtractedBillData = {
          totalAmount: 2850 + Math.floor(Math.random() * 500),
          restaurantName: groupData?.cafeName || 'Café Milano',
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          billNumber: 'BL' + Math.floor(Math.random() * 10000)
        };
        resolve(mockData);
      }, 2000);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Create image URL
    const imageUrl = URL.createObjectURL(file);
    setBillImage(imageUrl);
    setProcessing(true);

    try {
      // Process with OCR
      const extracted = await processImageOCR(imageUrl);
      setExtractedData(extracted);
      setStep('preview');
      toast.success('Bill scanned successfully!');
    } catch (error) {
      toast.error('Failed to process bill image');
      setBillImage(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleSubmitBill = () => {
    if (!extractedData || !billImage) return;

    // Send to admin for approval
    const billData = {
      ...groupData,
      billImage,
      extractedData,
      submittedAt: new Date().toISOString(),
      status: 'pending_admin_approval'
    };

    toast.success('Bill sent to admin for verification');
    
    // Navigate to confirmation/waiting screen
    onNavigate('bill-approval-admin', billData);
  };

  const handleEditAmount = (newAmount: string) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        totalAmount: parseFloat(newAmount) || 0
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
            Restaurant Bill Verification
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        {/* Step 1: Order Code Verification */}
        {step === 'code' && (
          <div className="space-y-6">
            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-neutral-900 mb-2">
                    Bill Verification Process
                  </h3>
                  <p className="text-[14px] text-neutral-600 leading-relaxed">
                    Enter the order code provided by the group admin to verify and upload the bill for payment processing.
                  </p>
                </div>
              </div>
            </Card>

            {/* Order Code Input */}
            <Card className="p-6">
              <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Step 1: Verify Order Code
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-700 mb-2">
                    Group Order Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code (e.g., ABC123)"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="text-center text-[18px] font-mono tracking-wider"
                    disabled={verifyingCode}
                  />
                  <p className="text-[12px] text-neutral-500 mt-2">
                    Ask the group admin for the order code
                  </p>
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={!orderCode || verifyingCode}
                  className="w-full h-[48px] bg-[#030213] hover:bg-[#030213]/90"
                >
                  {verifyingCode ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>
              </div>
            </Card>

            {/* Demo Hint */}
            <Card className="p-4 bg-amber-50 border-amber-200">
              <p className="text-[12px] text-amber-800 text-center">
                💡 <strong>Demo Mode:</strong> Enter any 6-character code to test the flow
              </p>
            </Card>
          </div>
        )}

        {/* Step 2: Bill Scan & Upload */}
        {step === 'scan' && (
          <div className="space-y-6">
            {/* Verified Group Info */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-green-900">
                    Order Verified: {groupData?.groupName}
                  </p>
                  <p className="text-[12px] text-green-700">
                    Admin: {groupData?.adminName} • {groupData?.memberCount} members
                  </p>
                </div>
              </div>
            </Card>

            {/* Upload Options */}
            <Card className="p-6">
              <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Step 2: Upload Bill
              </h2>

              <div className="space-y-4">
                {/* Camera Scan */}
                <button
                  onClick={handleCameraClick}
                  disabled={processing}
                  className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-[#8b5943] hover:bg-neutral-50 transition-all group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#8b5943] to-[#d9bf9d] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-neutral-900">
                        Scan Bill with Camera
                      </p>
                      <p className="text-[12px] text-neutral-500">
                        Take a photo of the physical bill
                      </p>
                    </div>
                  </div>
                </button>

                {/* File Upload */}
                <button
                  onClick={handleUploadClick}
                  disabled={processing}
                  className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-[#8b5943] hover:bg-neutral-50 transition-all group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-[16px] font-medium text-neutral-900">
                        Upload Bill Image
                      </p>
                      <p className="text-[12px] text-neutral-500">
                        Select from gallery or files
                      </p>
                    </div>
                  </div>
                </button>

                {/* Hidden Inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {processing && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="text-[14px] font-medium text-blue-900">
                        Processing bill image...
                      </p>
                      <p className="text-[12px] text-blue-700">
                        Extracting bill details with OCR
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-neutral-50">
              <p className="text-[12px] text-neutral-600 mb-2">
                <strong>Tips for best results:</strong>
              </p>
              <ul className="text-[12px] text-neutral-600 space-y-1 list-disc list-inside">
                <li>Ensure good lighting and no shadows</li>
                <li>Capture the entire bill clearly</li>
                <li>Avoid blurry or cropped images</li>
                <li>Make sure text is readable</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Step 3: Preview & Confirm */}
        {step === 'preview' && extractedData && (
          <div className="space-y-6">
            {/* Bill Image Preview */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-medium text-neutral-900">
                  Scanned Bill
                </h3>
                <button
                  onClick={() => {
                    setBillImage(null);
                    setExtractedData(null);
                    setStep('scan');
                  }}
                  className="text-[12px] text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {billImage && (
                <img
                  src={billImage}
                  alt="Bill"
                  className="w-full rounded-lg border border-neutral-200"
                />
              )}
            </Card>

            {/* Extracted Data */}
            <Card className="p-6">
              <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Extracted Bill Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-1">
                    Restaurant Name
                  </label>
                  <Input
                    value={extractedData.restaurantName}
                    readOnly
                    className="bg-neutral-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-neutral-600 mb-1">
                      Date
                    </label>
                    <Input
                      value={extractedData.date}
                      readOnly
                      className="bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-neutral-600 mb-1">
                      Time
                    </label>
                    <Input
                      value={extractedData.time}
                      readOnly
                      className="bg-neutral-50"
                    />
                  </div>
                </div>

                {extractedData.billNumber && (
                  <div>
                    <label className="block text-[12px] text-neutral-600 mb-1">
                      Bill Number
                    </label>
                    <Input
                      value={extractedData.billNumber}
                      readOnly
                      className="bg-neutral-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[12px] text-neutral-600 mb-1">
                    Total Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-medium text-neutral-600">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={extractedData.totalAmount}
                      onChange={(e) => handleEditAmount(e.target.value)}
                      className="pl-10 text-[20px] font-bold text-[#8b5943]"
                    />
                  </div>
                  <p className="text-[12px] text-neutral-500 mt-1">
                    You can edit if the amount is incorrect
                  </p>
                </div>
              </div>
            </Card>

            {/* Warning */}
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-amber-900 mb-1">
                    Verify Before Submitting
                  </p>
                  <p className="text-[12px] text-amber-800">
                    Please double-check all details. Once the admin approves, the bill amount will be locked and cannot be changed.
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitBill}
              className="w-full h-[48px] bg-[#030213] hover:bg-[#030213]/90"
            >
              Submit to Admin for Approval
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
