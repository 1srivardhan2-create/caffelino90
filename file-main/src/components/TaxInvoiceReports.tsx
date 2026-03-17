import { FileText, Download, Calendar, TrendingUp, Receipt, FileSpreadsheet } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface TaxInvoiceReportsProps {
  monthEarnings: number;
  lifetimeEarnings: number;
}

export default function TaxInvoiceReports({ monthEarnings, lifetimeEarnings }: TaxInvoiceReportsProps) {
  const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const currentYear = new Date().getFullYear();

  const handleDownloadMonthlyReport = () => {
    toast.success('Generating monthly earnings report...');
    setTimeout(() => {
      toast.success('Monthly report downloaded successfully!');
    }, 1500);
  };

  const handleDownloadTaxInvoice = () => {
    toast.success('Generating GST invoice...');
    setTimeout(() => {
      toast.success('Tax invoice downloaded successfully!');
    }, 1500);
  };

  const handleDownloadFinancialStatement = () => {
    toast.success('Generating financial statement...');
    setTimeout(() => {
      toast.success('Financial statement downloaded successfully!');
    }, 2000);
  };

  const handleExportToExcel = () => {
    toast.success('Exporting to Excel...');
    setTimeout(() => {
      toast.success('Excel file downloaded successfully!');
    }, 1500);
  };

  const reports = [
    {
      title: 'Monthly Earnings Report',
      description: `Detailed breakdown for ${currentMonth}`,
      icon: Calendar,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      amount: monthEarnings,
      action: handleDownloadMonthlyReport,
      format: 'PDF'
    },
    {
      title: 'GST Tax Invoice',
      description: 'GST-compliant invoice for tax filing',
      icon: Receipt,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      amount: monthEarnings * 0.18, // 18% GST
      action: handleDownloadTaxInvoice,
      format: 'PDF'
    },
    {
      title: 'Annual Financial Statement',
      description: `Complete statement for ${currentYear}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      amount: lifetimeEarnings,
      action: handleDownloadFinancialStatement,
      format: 'PDF'
    },
    {
      title: 'Transaction Export',
      description: 'All transactions in Excel format',
      icon: FileSpreadsheet,
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      amount: null,
      action: handleExportToExcel,
      format: 'Excel'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <h3 className="text-[20px] font-medium text-neutral-950">Tax & Invoice Reports</h3>
            <p className="text-[13px] text-neutral-600">Auto-generated financial documents</p>
          </div>
        </div>
      </Card>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className={`p-6 ${report.bgColor} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <Badge className="bg-white text-neutral-700 hover:bg-white border border-neutral-300">
                  {report.format}
                </Badge>
              </div>

              <h4 className="text-[18px] font-medium text-neutral-950 mb-2">
                {report.title}
              </h4>
              <p className="text-[13px] text-neutral-600 mb-4">
                {report.description}
              </p>

              {report.amount !== null && (
                <p className="text-[24px] font-bold text-neutral-950 mb-4">
                  ₹{report.amount.toLocaleString()}
                </p>
              )}

              <Button
                onClick={report.action}
                className={`w-full bg-gradient-to-r ${report.color} hover:opacity-90`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download {report.format}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Tax Summary */}
      <Card className="p-6">
        <h4 className="text-[18px] font-medium text-neutral-950 mb-4">Tax Summary</h4>
        
        <div className="space-y-4">
          {/* Current Month */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] font-medium text-neutral-700">This Month ({currentMonth})</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[11px] text-neutral-500 uppercase mb-1">Gross Revenue</p>
                <p className="text-[18px] font-bold text-neutral-950">₹{monthEarnings.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-500 uppercase mb-1">GST (18%)</p>
                <p className="text-[18px] font-bold text-orange-600">₹{(monthEarnings * 0.18).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-500 uppercase mb-1">Net Earnings</p>
                <p className="text-[18px] font-bold text-green-600">₹{(monthEarnings * 0.82).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Year to Date */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] font-medium text-neutral-700">Year to Date ({currentYear})</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[11px] text-neutral-500 uppercase mb-1">Total Revenue</p>
                <p className="text-[20px] font-bold text-neutral-950">₹{lifetimeEarnings.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-500 uppercase mb-1">Total GST</p>
                <p className="text-[20px] font-bold text-orange-600">₹{(lifetimeEarnings * 0.18).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-500 uppercase mb-1">Net Income</p>
                <p className="text-[20px] font-bold text-green-600">₹{(lifetimeEarnings * 0.82).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Breakdown */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[18px] font-medium text-neutral-950">Monthly Breakdown ({currentYear})</h4>
          <Button variant="outline" size="sm" onClick={handleExportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-2">
          {[
            { month: 'December', earnings: 11668.25 },
            { month: 'November', earnings: 8797.50 },
            { month: 'October', earnings: 0 },
            { month: 'September', earnings: 0 },
            { month: 'August', earnings: 0 },
            { month: 'July', earnings: 0 }
          ].map((item) => (
            <div key={item.month} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <span className="text-[14px] font-medium text-neutral-700">{item.month} {currentYear}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                    style={{ width: `${(item.earnings / Math.max(...[11668.25, 8797.50])) * 100}%` }}
                  />
                </div>
                <span className="text-[16px] font-bold text-neutral-950 min-w-[100px] text-right">
                  ₹{item.earnings.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <h4 className="text-[16px] font-medium text-amber-900 mb-3">📋 Important Notes</h4>
        <div className="space-y-2 text-[13px] text-amber-800">
          <p>• <strong>GST Registration:</strong> Required for annual revenue exceeding ₹20 lakhs</p>
          <p>• <strong>TDS Deduction:</strong> Applicable as per Income Tax Act 1961</p>
          <p>• <strong>Quarterly Returns:</strong> File GSTR-1 and GSTR-3B by the 20th of next month</p>
          <p>• <strong>Annual Returns:</strong> File GSTR-9 by December 31st</p>
          <p>• <strong>Record Keeping:</strong> Maintain all invoices and receipts for 6 years</p>
        </div>
      </Card>

      {/* Auto-generation Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[13px] text-blue-900">
            <p><strong>Auto-Generated Reports:</strong></p>
            <p>All financial reports are automatically generated on the 1st of every month and stored in your account for 7 years. Download anytime for tax filing or audits.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
