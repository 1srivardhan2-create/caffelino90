import { ArrowLeft } from 'lucide-react';

interface EmptyMenuPageProps {
  onBack: () => void;
}

export default function EmptyMenuPage({ onBack }: EmptyMenuPageProps) {
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
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Menu</h1>
        </div>
      </div>

      {/* Empty Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {/* Empty state - just white space */}
      </div>
    </div>
  );
}
