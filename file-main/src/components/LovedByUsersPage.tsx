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

const sampleComments: FeedbackComment[] = [
  {
    id: 1,
    name: 'Avery',
    text: 'The vibe is premium and warm—like coffee in a luxe lounge.',
    stars: 5,
  },
  {
    id: 2,
    name: 'Jules',
    text: 'Feels like a cinematic café experience with every review.',
    stars: 5,
  },
];

const floatingOffsets = [
  { x: [0, 18, 0], y: [0, -10, 0] },
  { x: [0, -20, 0], y: [0, 14, 0] },
  { x: [0, 16, 0], y: [0, 8, 0] },
  { x: [0, -14, 0], y: [0, -16, 0] },
];

export default function LovedByUsersPage({ onNavigate }: LovedByUsersPageProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);
  const [comments, setComments] = useState<FeedbackComment[]>(sampleComments);
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
    <div
      className="relative min-h-screen overflow-hidden bg-[#3E2723] text-white"
      style={{
        background: 'linear-gradient(135deg, #3E2723 0%, #5D4037 25%, #8D6E63 55%, #D7CCC8 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_35%)] pointer-events-none" />
      <div className="absolute left-[-120px] top-20 h-[420px] w-[420px] rounded-full bg-[#c48f71]/20 blur-3xl opacity-90" />
      <div className="absolute right-0 top-32 h-[380px] w-[380px] rounded-full bg-[#8b5a41]/15 blur-3xl opacity-90" />
      <div className="absolute left-16 bottom-16 h-[240px] w-[240px] rounded-full bg-[#efd8c0]/10 blur-3xl opacity-80" />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white/15 blur-2xl"
            style={{
              width: `${12 + index * 4}px`,
              height: `${12 + index * 4}px`,
              top: `${(index * 11) % 90}%`,
              left: `${(index * 13) % 92}%`,
              opacity: 0.18,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#f4e6d9] shadow-[0_14px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[38px] border border-white/15 bg-white/10 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d7b9a0]">Loved by Real People</p>
              <h1 className="text-4xl font-semibold tracking-tight text-[#fdf7ef] sm:text-5xl lg:text-6xl">
                Loved by Real People ☕
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#e8d6c3] sm:text-lg">
                A luxury coffee review lounge where every story floats like steam. Submit your 5-star feedback and watch the premium memories drift across the page.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-[0_16px_56px_rgba(0,0,0,0.24)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#d7b9a0]">Feedback card</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#fbf7f0]">Premium review entry</h2>
                  </div>
                  <div className="rounded-full border border-[#f0d4b0]/20 bg-[#f9e8d7]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#d09a6d]">
                    smooth
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-[#3d1f12]/70 p-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#d7b9a0]">Star rating</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.button
                        key={value}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setStars(value)}
                        className={`flex h-14 w-14 items-center justify-center rounded-full border text-2xl transition ${
                          stars >= value
                            ? 'border-[#f5d48d] bg-[#f5d48d]/20 text-[#ffe8b9] shadow-[0_0_24px_rgba(245,212,141,0.35)]'
                            : 'border-white/15 bg-[#2e1208]/90 text-[#b99c80] hover:border-[#f5d48d]/50 hover:text-[#ffe8b9]'
                        }`}
                      >
                        ★
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#e9d5c4]">Name</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-[24px] border border-white/10 bg-[#3c2216]/70 px-4 py-4 text-base text-white outline-none placeholder:text-[#ccb39c] focus:border-[#f5d48d] focus:ring-2 focus:ring-[#f5d48d]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#e9d5c4]">Feedback</label>
                    <textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder="Write your feedback like a restaurant review on Google Maps..."
                      rows={5}
                      className="w-full resize-none rounded-[24px] border border-white/10 bg-[#3c2216]/70 px-4 py-4 text-base text-white outline-none placeholder:text-[#ccb39c] focus:border-[#f5d48d] focus:ring-2 focus:ring-[#f5d48d]/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#4E342E] via-[#6D4C41] to-[#8D6E63] px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.35)]"
                  >
                    <span className="text-lg">☕</span>
                    Submit feedback
                  </button>

                  {submitted && (
                    <div className="rounded-[24px] border border-[#f5d48d]/20 bg-[#f5d48d]/10 px-4 py-3 text-sm text-[#2f1b12] shadow-inner shadow-black/10">
                      Your review is now floating live on the premium wall.
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
                className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-[#d7b9a0]">Live preview</p>
                <div className="mt-5 grid gap-4">
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="rounded-[26px] border border-white/10 bg-[#3b1f14]/85 p-4 shadow-[inset_0_1px_3px_rgba(255,255,255,0.06)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#f7efe8]">{comment.name}</p>
                          <div className="flex gap-1 text-[#f5d48d]">{Array.from({ length: 5 }).map((_, index) => <span key={index}>{index < comment.stars ? '★' : '☆'}</span>)}</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#ffe8c7]/20 ring-1 ring-white/10" />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#e6d0bd]">“{comment.text}”</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative flex flex-col gap-6">
            <div className="overflow-hidden rounded-[38px] border border-white/15 bg-white/10 p-6 shadow-[0_32px_95px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="absolute -right-8 top-12 h-28 w-28 rounded-full bg-[#c89a75]/20 blur-3xl opacity-80" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-[#d7b9a0]">Floating review wall</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#fbf7f0]">Cinematic drift cards</h2>
                  </div>
                  <span className="rounded-full border border-[#f5d48d]/20 bg-[#f5d48d]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#d7b9a0]">
                    premium
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      animate={floatingOffsets[index % floatingOffsets.length]}
                      transition={{ duration: 9 + index * 0.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                      className="rounded-[32px] border border-white/15 bg-[#321d16]/90 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#f8ebe1]">{comment.name}</p>
                          <div className="flex gap-1 text-[#f5d48d]">{Array.from({ length: 5 }).map((_, starIndex) => <span key={starIndex}>{starIndex < comment.stars ? '★' : '☆'}</span>)}</div>
                        </div>
                        <div className="h-11 w-11 rounded-full bg-[#e6c9ad]/20 ring-1 ring-white/10" />
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#dcc4ae]">“{comment.text}”</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-6 shadow-[0_26px_75px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#d7b9a0]">Ambient mood</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-[#3a2117]/85 p-4 text-sm text-[#e6d0bd]">
                  Warm brown glass surfaces, soft glow borders, and cinematic blur layers.
                </div>
                <div className="rounded-[28px] border border-white/10 bg-[#3a2117]/85 p-4 text-sm text-[#e6d0bd]">
                  Floating review cards drift like memories, giving the page a premium café lounge feel.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
