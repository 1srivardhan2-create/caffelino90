import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Coffee, Upload } from 'lucide-react';

interface LovedByUsersPageProps {
  onNavigate: (page: string) => void;
}

interface Review {
  name: string;
  text: string;
  stars: number;
  image: string;
}

const initialReviews: Review[] = [
  {
    name: 'Rahul',
    text: 'Amazing meetup experience with friends ☕',
    stars: 5,
    image: 'https://i.pravatar.cc/100?img=1',
  },
  {
    name: 'Sneha',
    text: 'Beautiful cafés and smooth planning.',
    stars: 5,
    image: 'https://i.pravatar.cc/100?img=2',
  },
];

const featuredReviews: Review[] = [
  {
    name: 'Rahul',
    text: 'Best meetup experience ever. The café vibe was amazing.',
    stars: 5,
    image: 'https://i.pravatar.cc/100?img=3',
  },
  {
    name: 'Sneha',
    text: 'The community feel and coffee tones feel premium and warm.',
    stars: 5,
    image: 'https://i.pravatar.cc/100?img=4',
  },
  {
    name: 'Aman',
    text: 'Loved how easy planning was. The cafe moments felt cinematic.',
    stars: 5,
    image: 'https://i.pravatar.cc/100?img=5',
  },
];

const floatingPositions = [
  { top: '8%', left: '6%' },
  { top: '16%', left: '68%' },
  { top: '42%', left: '12%' },
  { top: '54%', left: '65%' },
  { top: '28%', left: '40%' },
];

export default function LovedByUsersPage({ onNavigate }: LovedByUsersPageProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const addReview = () => {
    if (!name.trim() || !text.trim()) return;

    const newReview: Review = {
      name: name.trim(),
      text: text.trim(),
      stars,
      image: 'https://i.pravatar.cc/100',
    };

    setReviews((prev) => [newReview, ...prev]);
    setName('');
    setText('');
    setStars(5);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 1800);
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-[linear-gradient(135deg,#3E2723_0%,#5D4037_25%,#8D6E63_50%,#D7CCC8_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)] pointer-events-none" />
      <div className="absolute left-10 top-24 h-48 w-48 rounded-full bg-[#d7ccc8]/20 blur-3xl opacity-90 pointer-events-none" />
      <div className="absolute right-10 bottom-24 h-56 w-56 rounded-full bg-[#8d6e63]/20 blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-[#d7ccc8]/20 blur-2xl"
            style={{
              width: `${30 + index * 6}px`,
              height: `${30 + index * 6}px`,
              top: `${(index * 9) % 85}%`,
              left: `${(index * 17) % 85}%`,
            }}
            animate={{
              x: [0, index % 2 === 0 ? 18 : -18, 0],
              y: [0, index % 2 === 0 ? -14 : 14, 0],
            }}
            transition={{ duration: 22 + index, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-[#f7e8d9] transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Loved by Real People ☕
          </h1>
          <p className="mt-4 text-base text-[#f4e1d6] sm:text-lg">
            Every meetup creates a memory.
          </p>
          <p className="mt-2 text-sm text-[#e9d5c9] sm:text-base">
            Share your experience with cafés, friends, food, and moments.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative rounded-[30px] border border-white/15 bg-white/10 p-8 shadow-[0_40px_90px_rgba(0,0,0,0.25)] backdrop-blur-3xl"
          >
            <div className="absolute inset-0 rounded-[30px] border border-[#d7ccc8]/20 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]" />
            <div className="relative z-10 grid gap-6">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-[#4b2e2b]/85 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <Coffee className="h-10 w-10 text-[#f7e4d4]" />
              </div>

              <div className="rounded-[26px] border border-white/15 bg-[#341d17]/80 p-5 shadow-[inset_0_1px_3px_rgba(255,255,255,0.08)]">
                <label className="mb-2 block text-sm uppercase tracking-[0.22em] text-[#d6bba9]">Profile Picture Upload</label>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f2e6da] transition hover:border-[#d7b59b]"
                >
                  <span className="flex items-center gap-3">
                    <Upload className="h-4 w-4 text-[#f2e6da]" />
                    Add photo
                  </span>
                  <span className="text-xs text-[#cbb19f]">optional</span>
                </button>
              </div>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your Name"
                className="w-full rounded-[24px] border border-white/15 bg-[#341d17]/85 px-5 py-4 text-base text-white outline-none placeholder:text-[#d8c1b4] focus:border-[#d7b59b] focus:ring-2 focus:ring-[#d7b59b]/20"
              />

              <div className="space-y-3 rounded-[24px] border border-white/15 bg-[#341d17]/80 p-5 shadow-[inset_0_1px_4px_rgba(255,255,255,0.08)]">
                <p className="text-sm uppercase tracking-[0.22em] text-[#d6bba9]">Star Rating</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStars(value)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition ${
                        stars >= value
                          ? 'border-[#f6d88d] bg-[#f7e2b1]/25 text-[#f7e2b1] shadow-[0_10px_20px_rgba(247,226,177,0.26)]'
                          : 'border-white/15 bg-[#24140f]/90 text-[#c4ab9f] hover:border-[#f6d88d]/50 hover:text-[#f7e2b1]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Write your experience with Caffelino..."
                rows={6}
                className="w-full resize-none rounded-[24px] border border-white/15 bg-[#341d17]/85 px-5 py-4 text-base text-white outline-none placeholder:text-[#d8c1b4] focus:border-[#d7b59b] focus:ring-2 focus:ring-[#d7b59b]/20"
              />

              <button
                type="button"
                onClick={addReview}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#4E342E] via-[#6D4C41] to-[#8D6E63] px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_50px_rgba(79,46,40,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(79,46,40,0.45)]"
              >
                <Coffee className="h-5 w-5" />
                Share Experience
              </button>

              {submitted && (
                <div className="rounded-3xl border border-white/15 bg-[#ffffff]/10 px-4 py-3 text-sm text-[#eae2d8] shadow-inner shadow-black/10">
                  Thank you — your review is now floating in the lounge.
                </div>
              )}
            </div>
          </motion.div>

          <div className="relative min-h-[620px] overflow-hidden rounded-[30px] border border-white/15 bg-white/10 p-5 shadow-[0_32px_70px_rgba(0,0,0,0.22)] backdrop-blur-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_45%)]" />
            <div className="relative z-10 h-full">
              {reviews.map((review, index) => (
                <motion.div
                  key={`${review.name}-${index}`}
                  className="absolute max-w-[240px] rounded-[28px] border border-white/20 bg-[#281b16]/80 p-5 text-white shadow-[0_22px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:scale-[1.02]"
                  style={floatingPositions[index % floatingPositions.length]}
                  initial={{ opacity: 0, scale: 0.94, y: 24 }}
                  animate={{ opacity: 1, y: [0, index % 2 === 0 ? -14 : 14, 0], rotate: [0, index % 2 === 0 ? 2 : -2, 0] }}
                  transition={{ duration: 10 + index * 0.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: index * 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <img src={review.image} alt={review.name} className="h-12 w-12 rounded-2xl border border-white/20 object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-[#f6e7dd]">{review.name}</p>
                      <div className="flex gap-1 text-[#f3dfc9]">{Array.from({ length: 5 }).map((_, starIndex) => (<span key={starIndex}>{starIndex < review.stars ? '★' : '☆'}</span>))}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#e9d4c8]">“{review.text}”</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-6">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-[#e8d1c1]">Top Community Reviews ❤️</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#f8efe7] md:text-4xl">Featured moments from our community</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredReviews.map((card) => (
              <motion.div
                key={card.name}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3">
                  <img src={card.image} alt={card.name} className="h-14 w-14 rounded-2xl border border-white/15 object-cover" />
                  <div>
                    <p className="text-base font-semibold text-[#f8efe7]">{card.name}</p>
                    <div className="flex gap-1 text-[#f3dfc9]">{Array.from({ length: 5 }).map((_, idx) => <span key={idx}>{idx < card.stars ? '★' : '☆'}</span>)}</div>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-[#e8d4c8]">“{card.text}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
