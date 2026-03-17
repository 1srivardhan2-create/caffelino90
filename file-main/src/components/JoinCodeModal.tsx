import { ArrowLeft } from 'lucide-react';

interface JoinCodeModalProps {
  onNavigate: (page: string, data?: any) => void;
  onClose: () => void;
  user: any;
}

export default function JoinCodeModal({ onNavigate, onClose, user }: JoinCodeModalProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Join with Code</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Empty page - all content removed */}
      </div>
    </div>
  );
}
