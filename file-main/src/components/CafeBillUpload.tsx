import { useState, useRef } from 'react';
import { Camera, Upload, ArrowLeft, Check, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface CafeBillUploadProps {
  order: any;
  onBack: () => void;
  onBillUploaded: (billData: any) => void;
}

export default function CafeBillUpload({ order, onBack, onBillUploaded }: CafeBillUploadProps) {
  const [billImage, setBillImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState({
    totalAmount: '',
    cafeName: '',
    billDate: '',
    billTime: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate OCR extraction
  const processImage = (imageData: string) => {
    setIsProcessing(true);
    
    // Simulate OCR processing delay
    setTimeout(() => {
      // Mock OCR extraction (in real app, this would be actual OCR)
      const now = new Date();
      setExtractedData({
        totalAmount: order.totalAmount.toString(),
        cafeName: 'The Coffee House',
        billDate: now.toLocaleDateString('en-IN'),
        billTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      });
      setIsProcessing(false);
      toast.success('Bill scanned successfully! ✓');
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setBillImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
  };

  const handleSubmit = () => {
    if (!billImage && !showManualEntry) {
      toast.error('Please upload a bill image');
      return;
    }

    if (!extractedData.totalAmount || parseFloat(extractedData.totalAmount) <= 0) {
      toast.error('Please enter a valid bill amount');
      return;
    }

    const billData = {
      billImage,
      totalAmount: parseFloat(extractedData.totalAmount),
      cafeName: extractedData.cafeName,
      billDate: extractedData.billDate,
      billTime: extractedData.billTime,
      orderNumber: order.orderNumber,
    };

    onBillUploaded(billData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h2 className="text-slate-900">Upload Bill</h2>
            <p className="text-sm text-slate-600">{order.orderNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Order Summary */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-900 mb-2">
            <strong>Order Summary</strong>
          </div>
          <div className="text-sm text-blue-800">
            {order.meetupName} • {order.memberCount} members
          </div>
          <div className="text-sm text-blue-700 mt-1">
            Expected Amount: ₹{order.totalAmount}
          </div>
        </Card>

        {/* Upload Section */}
        {!billImage && !showManualEntry && (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="bg-slate-100 size-24 rounded-full flex items-center justify-center mx-auto">
                <FileText className="size-12 text-slate-400" />
              </div>
              
              <h3 className="text-slate-900">Upload Bill</h3>
              <p className="text-sm text-slate-600">
                Scan or upload the final bill for this order
              </p>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleCameraCapture}
                  className="w-full bg-[#8b5943] hover:bg-[#6d4532]"
                >
                  <Camera className="size-4 mr-2" />
                  Scan with Camera
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="size-4 mr-2" />
                  Upload from Gallery
                </Button>

                <Button
                  onClick={handleManualEntry}
                  variant="ghost"
                  className="w-full"
                >
                  Enter Manually
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </Card>
        )}

        {/* Processing State */}
        {isProcessing && (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin size-12 border-4 border-[#8b5943] border-t-transparent rounded-full mx-auto" />
              <p className="text-slate-600">Scanning bill...</p>
            </div>
          </Card>
        )}

        {/* Bill Preview & Extracted Data */}
        {billImage && !isProcessing && (
          <Card className="p-4 space-y-4">
            <div className="bg-slate-100 rounded-lg p-4">
              <img
                src={billImage}
                alt="Bill"
                className="w-full rounded-lg"
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Check className="size-4" />
                <span className="text-sm">Bill scanned successfully</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-slate-900">Extracted Information</h4>
              
              <div>
                <Label>Total Amount (₹)</Label>
                <Input
                  type="number"
                  value={extractedData.totalAmount}
                  onChange={(e) => setExtractedData({ ...extractedData, totalAmount: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Cafe Name</Label>
                <Input
                  value={extractedData.cafeName}
                  onChange={(e) => setExtractedData({ ...extractedData, cafeName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={extractedData.billDate}
                    onChange={(e) => setExtractedData({ ...extractedData, billDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    value={extractedData.billTime}
                    onChange={(e) => setExtractedData({ ...extractedData, billTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Check className="size-4 mr-2" />
              Send Bill to Admin
            </Button>
          </Card>
        )}

        {/* Manual Entry Form */}
        {showManualEntry && !billImage && (
          <Card className="p-4 space-y-4">
            <h4 className="text-slate-900">Enter Bill Details</h4>
            
            <div>
              <Label>Total Amount (₹) *</Label>
              <Input
                type="number"
                value={extractedData.totalAmount}
                onChange={(e) => setExtractedData({ ...extractedData, totalAmount: e.target.value })}
                placeholder="Enter total bill amount"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Cafe Name</Label>
              <Input
                value={extractedData.cafeName}
                onChange={(e) => setExtractedData({ ...extractedData, cafeName: e.target.value })}
                placeholder="Your cafe name"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={extractedData.billDate}
                  onChange={(e) => setExtractedData({ ...extractedData, billDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={extractedData.billTime}
                  onChange={(e) => setExtractedData({ ...extractedData, billTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Check className="size-4 mr-2" />
              Submit Bill
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
