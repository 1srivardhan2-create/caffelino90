import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';

interface LovedByUsersPageProps {
  onNavigate: (page: string) => void;
}

interface FeedbackComment {
  id: number;
  name: string;
  text: string;
  stars: number;
}

export default function LovedByUsersPage({ onNavigate }: LovedByUsersPageProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !text.trim()) return;

    setComments((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        text: text.trim(),
        stars,
      },
      ...prev,
    ]);

    setName('');
    setText('');
    setStars(5);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#3c1e16] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(71,47,35,0.92)_0%,rgba(58,30,20,0.95)_50%,rgba(30,15,10,0.98)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-[#f0dfd1] transition hover:-translate-y-0.5 hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mx-auto w-full max-w-[1150px] rounded-[36px] border border-white/10 bg-[#352219]/80 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] xl:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-[#d8b49b]">Loved By Users</p>
                <h1 className="text-4xl font-semibold text-[#f5e8dc] sm:text-5xl">Leave your 5-star restaurant-style feedback</h1>
                <p className="max-w-2xl text-sm leading-7 text-[#dfc8b8] sm:text-base">
                  Write feedback like a Google Maps restaurant review. Your comment will float live on this page for everyone to see.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#2f1a13]/80 p-6 shadow-[inset_0_1px_3px_rgba(255,255,255,0.08)]">
                <div className="mb-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#c9a68f]">Star rating</p>
                  <div className="mt-3 flex gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setStars(value)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition ${
                          stars >= value
                            ? 'border-[#f8d78c] bg-[#f8d78c]/20 text-[#f9e6be] shadow-[0_10px_18px_rgba(248,215,140,0.22)]'
                            : 'border-white/15 bg-[#3b1f16]/90 text-[#b59d8c] hover:border-[#f8d78c]/50 hover:text-[#f9e6be]'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#dfc8b8]">Name</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-[#442a20]/90 px-4 py-4 text-base text-white outline-none placeholder:text-[#b69c88] focus:border-[#f8d78c] focus:ring-2 focus:ring-[#f8d78c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#dfc8b8]">Feedback</label>
                    <textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder="Write your feedback like a restaurant review on Google Maps..."
                      rows={6}
                      className="mt-2 w-full resize-none rounded-3xl border border-white/10 bg-[#442a20]/90 px-4 py-4 text-base text-white outline-none placeholder:text-[#b69c88] focus:border-[#f8d78c] focus:ring-2 focus:ring-[#f8d78c]/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6d4c41] via-[#8d6e63] to-[#a1887f] px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_50px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5"
                  >
                    Submit feedback
                  </button>

                  {submitted && (
                    <div className="rounded-3xl border border-[#f8d78c]/20 bg-[#f8d78c]/10 px-4 py-3 text-sm text-[#f3e6cf] shadow-inner shadow-black/20">
                      Your feedback is live and floating on the page now.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1f120f]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_40%)]" />
              <div className="relative z-10 h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#c9a68f]">Live Feed</p>
                    <p className="text-xl font-semibold text-[#f4e5d8]">Floating reviews</p>
                  </div>
                  <span className="rounded-full bg-[#543827]/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#dfc8b8]">
                    Everyone sees it
                  </span>
                </div>

                <div className="grid gap-4">
                  {comments.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-[#2d1c16]/90 p-5 text-sm text-[#d8bba7]">
                      No comments yet. Once submitted, your feedback will float here for everyone to see.
                    </div>
                  ) : (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: [0, -8, 0], rotate: [0, -1.2, 0, 1.2, 0] }}
                        transition={{ duration: 8 + index * 0.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                        className="rounded-[28px] border border-white/10 bg-[#3b241d]/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#f4e5d8]">{comment.name || 'Guest reviewer'}</p>
                            <div className="flex gap-1 text-[#f8d78c]">
                              {Array.from({ length: 5 }).map((_, starIndex) => (
                                <span key={starIndex}>{starIndex < comment.stars ? '★' : '☆'}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 leading-7 text-[#d9c3b0]">“{comment.text}”</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
