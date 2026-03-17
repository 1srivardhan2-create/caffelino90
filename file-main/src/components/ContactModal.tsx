import { X, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200">
          <DialogTitle className="text-[24px] text-neutral-950">
            Contact Us
          </DialogTitle>
          <DialogDescription className="sr-only">
            Get in touch with Caffélino team via email
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-6">
          {/* Email Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-600">
              <Mail className="w-4 h-4" />
              <p className="text-[14px] font-medium">Email</p>
            </div>
            <a 
              href="mailto:caffelino.9@gmail.com"
              className="block text-[18px] text-[#be9d80] hover:text-[#8b5943] transition-colors font-medium break-all"
            >
              caffelino.9@gmail.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}