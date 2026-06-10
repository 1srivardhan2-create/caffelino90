import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function CafeLiveOrders({ isOnline, cafeId }: { isOnline: boolean; cafeId?: string }) {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center bg-gray-50 min-h-[60vh]">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
        <div className="pt-2 space-y-8">
          <div className="mx-auto w-20 h-20 bg-[#be9d80]/10 rounded-full flex items-center justify-center mb-4">
            <ExternalLink className="w-10 h-10 text-[#be9d80]" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">New Dashboard is Live! 🚀</h2>
            <p className="text-gray-600 leading-relaxed px-4">
              We've created a dedicated Caffelino Owner Portal for a much better experience. 
              Please manage all your live orders there.
            </p>
          </div>

          <div className="pt-4">
            <a
              href="https://caffelinocafes.in/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center py-4 px-6 rounded-xl text-white font-semibold bg-[#be9d80] hover:bg-[#a88968] active:scale-95 transition-all shadow-md gap-2"
            >
              Take me to the new Dashboard
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-400">
        You can securely close this tab and manage everything from the new portal.
      </p>
    </div>
  );
}