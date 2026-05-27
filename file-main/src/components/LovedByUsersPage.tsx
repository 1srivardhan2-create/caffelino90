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
    <div className="relative min-h-screen overflow-hidden bg-[#100804] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,210,181,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,6,0.95)_0%,rgba(10,5,3,0.98)_75%)]" />
      <div className="absolute -left-20 top-20 h-[360px] w-[360px] rounded-full bg-[#8a5f44]/20 blur-3xl opacity-90" />
      <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-[#c79f7c]/10 blur-3xl opacity-90" />
      <div className="absolute right-20 bottom-24 h-[280px] w-[280px] rounded-full bg-[#f3d6b3]/10 blur-3xl opacity-80" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-8 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-[#f4e3d5] transition hover:-translate-y-0.5 hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#29170f]/80 p-8 shadow-[0_48px_120px_rgba(0,0,0,0.45)] backdrop-blur-[28px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_38%)]" />
          <div className="absolute left-0 top-0 h-20 w-20 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="absolute right-10 bottom-0 h-28 w-28 rounded-full border border-white/10 bg-[#f7e3ca]/5 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-[#d4b69a]">Loved By Users</p>
                <h1 className="text-4xl font-semibold leading-tight text-[#f8ead9] sm:text-5xl">
                  Premium brown glass review lounge
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#d9c2ad] sm:text-base">
                  Share your 5-star restaurant-style feedback in a polished live wall. Your comment will float here and appear on the page for everyone to admire.
                </p>
              </div>

              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#2b1810]/90 p-6 shadow-[inset_0_1px_3px_rgba(255,255,255,0.06)]">
                <div className="mb-6 rounded-[28px] border border-[#d8bca8]/15 bg-[#381f16]/85 p-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#d4b69a]">Star rating</p>
                  <div className="mt-4 flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setStars(value)}
                        className={`flex h-14 w-14 items-center justify-center rounded-full border text-[1.15rem] transition ${
                          stars >= value
                            ? 'border-[#f7d58d] bg-[#f7d58d]/20 text-[#f7e2b2] shadow-[0_10px_20px_rgba(247,213,141,0.25)]'
                            : 'border-white/15 bg-[#3d1e16]/90 text-[#b99e88] hover:border-[#f7d58d]/50 hover:text-[#f7e2b2]'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#dfc5ac]">Name</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Write your name"
                      className="w-full rounded-[24px] border border-white/10 bg-[#3b241d]/85 px-4 py-4 text-base text-white outline-none placeholder:text-[#b69f8f] focus:border-[#f7d58d] focus:ring-2 focus:ring-[#f7d48b]/25"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#dfc5ac]">Feedback</label>
                    <textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder="Write feedback like a restaurant review on Google Maps..."
                      rows={6}
                      className="w-full resize-none rounded-[24px] border border-white/10 bg-[#3b241d]/85 px-4 py-4 text-base text-white outline-none placeholder:text-[#b69f8f] focus:border-[#f7d58d] focus:ring-2 focus:ring-[#f7d48b]/25"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7a583f] via-[#a07b60] to-[#d5b08b] px-6 py-4 text-sm font-semibold text-[#1a0a05] shadow-[0_24px_55px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5"
                  >
                    <Star className="h-4 w-4 text-[#5a3a23]" />
                    Submit premium feedback
                  </button>

                  {submitted && (
                    <div className="rounded-[22px] border border-[#f7d58d]/20 bg-[#f7d58d]/10 px-4 py-3 text-sm text-[#4a2f1d] shadow-inner shadow-black/15">
                      Your premium review is floating live on the wall.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#1d100b]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_40%)]" />
              <div className="relative z-10 h-full">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-[#d4b69a]">Live feed</p>
                    <h2 className="text-2xl font-semibold text-[#f8ead9]">Floating review wall</h2>
                  </div>
                  <span className="rounded-full border border-[#f7d58d]/20 bg-[#f7d58d]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#f7d58d]">
                    Public view
                  </span>
                </div>

                <div className="grid gap-4">
                  {comments.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-[#2f1b15]/90 p-6 text-sm text-[#ceb69e] shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
                      No premium comments yet. Submit your review and watch it float into the lounge.
                    </div>
                  ) : (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: [0, -6, 0], rotate: [0, -0.7, 0, 0.7, 0] }}
                        transition={{ duration: 7 + index * 0.35, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                        className="rounded-[30px] border border-[#f7d58d]/15 bg-[#361f17]/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#f8ead9]">{comment.name || 'Guest reviewer'}</p>
                            <div className="flex gap-1 text-[#f7d58d]">
                              {Array.from({ length: 5 }).map((_, starIndex) => (
                                <span key={starIndex}>{starIndex < comment.stars ? '★' : '☆'}</span>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-full bg-[#8b684f]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#d9c4aa]">
                            Premium
                          </div>
                        </div>
                        <p className="mt-4 leading-7 text-[#dbc5b1]">“{comment.text}”</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
