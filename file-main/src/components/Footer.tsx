import { Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import ContactModal from './ContactModal';

interface FooterProps {
  user?: any;
  onShowAuth?: () => void;
  onNavigate?: (page: string) => void;
}

export default function Footer({ user, onShowAuth, onNavigate }: FooterProps) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <footer className="bg-[#1a2332] text-white w-full">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-[18px] mb-3">Caffélino</h3>
              <p className="text-slate-300 text-[14px] mb-4">
                Connect with real people over real conversations.
              </p>
              <a 
                href="https://www.instagram.com/caffelino.9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-600 hover:border-slate-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[16px] mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => onNavigate?.('home')}
                    className="text-slate-300 text-[14px] hover:text-white transition-colors text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="text-slate-300 text-[14px] hover:text-white transition-colors text-left"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[16px] mb-3">Legal</h3>
              <ul className="space-y-2">

                <li>
                  <button 
                    onClick={() => onNavigate?.('how-it-works')}
                    className="text-slate-300 text-[14px] hover:text-white transition-colors text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('safety-guidelines')}
                    className="text-slate-300 text-[14px] hover:text-white transition-colors text-left"
                  >
                    Safety Guidelines
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        {!user && (
          <div className="bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-700 text-[14px]">
                  Join Caffélino to create and join groups
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={onShowAuth}
                    className="bg-[#be9d80] hover:bg-[#a88a6e] text-white h-[36px] px-6 rounded-[8px]"
                  >
                    Login / Sign Up
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </footer>
      
      <ContactModal 
        open={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </>
  );
}