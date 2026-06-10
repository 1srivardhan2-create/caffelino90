import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';

interface Feedback {
  _id: string;
  name: string;
  profilePicture: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export default function LovedByUsers({ onClose }: { onClose: () => void }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/feedback`);
      const data = await response.json();
      if (response.ok) setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchFeedbacks, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!newFeedback.trim()) return;
    
    // User must be logged in to submit feedback
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user'); // Basic fallback, in real app pass user object from parent
    
    if (!token) {
      toast.error('Please log in to leave feedback');
      return;
    }

    let user = { id: 'test_user', name: 'Guest User', photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guest' };
    if (userStr) {
      try { user = JSON.parse(userStr); } catch (e) {}
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId: user.id || 'anonymous',
          name: user.name || 'Anonymous',
          profilePicture: user.photo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`,
          comment: newFeedback,
          rating
        })
      });

      if (response.ok) {
        toast.success('Feedback submitted successfully!');
        setNewFeedback('');
        setRating(5);
        fetchFeedbacks(); // Instantly update
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#fbf9f6] z-[9000] flex flex-col overflow-hidden font-['Inter',sans-serif]">
      {/* Header */}
      <div className="pt-12 pb-4 px-6 bg-white shadow-sm z-20 flex items-center gap-4">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-stone-800" />
        </button>
        <h1 className="text-xl font-bold text-stone-900">Loved by Users ❤️</h1>
      </div>

      {/* Floating Cards Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(#8d5943_1px,transparent_1px)] [background-size:24px_24px] relative scroll-smooth no-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6 pb-32">
            <AnimatePresence>
              {feedbacks.map((fb, i) => (
                <motion.div
                  key={fb._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white/80 backdrop-blur-lg border border-stone-200/50 p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={fb.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fb.name}`} 
                      alt={fb.name}
                      className="w-12 h-12 rounded-full bg-[#f0ebe3] border-2 border-white shadow-sm object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-stone-900">{fb.name}</h3>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3.5 h-3.5 ${j < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-stone-200 text-stone-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed font-medium">
                        "{fb.comment}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {feedbacks.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <MessageSquare className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                <p className="font-medium text-stone-500">No feedback yet. Be the first!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area (Bottom Sheet style) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-6 pt-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Leave a Review</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                onClick={() => setRating(i + 1)}
                className={`w-5 h-5 cursor-pointer transition-all ${i < rating ? 'fill-yellow-400 text-yellow-400 scale-110' : 'fill-stone-200 text-stone-200'}`} 
              />
            ))}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <textarea
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Share your Caffélino experience..."
            className="flex-1 bg-stone-100 border-transparent focus:border-stone-300 focus:bg-white resize-none rounded-2xl p-4 text-sm font-medium outline-none transition-all h-[56px] min-h-[56px] max-h-[120px]"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !newFeedback.trim()}
            className="h-[56px] px-6 bg-black hover:bg-stone-800 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-md active:scale-95"
          >
            {isSubmitting ? '...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
