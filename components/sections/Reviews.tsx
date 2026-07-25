'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Trophy, Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { useGymData } from '@/lib/context/GymDataContext';
import { Review } from '@/lib/constants/gym-data';
import { FADE_IN_UP } from '@/lib/animations/framer';

export const Reviews: React.FC = () => {
  const { reviews, refreshData } = useGymData();
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Review Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newAchievement, setNewAchievement] = useState('Muscle Gain');
  const [newComment, setNewComment] = useState('');

  // Load approved reviews
  useEffect(() => {
    setReviewsList(reviews.filter(r => r.status === 'approved' || !r.status));
  }, [reviews]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  useEffect(() => {
    if (isPaused || isFormOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isFormOpen, currentIndex, reviewsList.length]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newReviewItem: Review = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      role: 'Verified Member',
      rating: newRating,
      comment: newComment.trim(),
      achievement: newAchievement,
      avatar: '',
      status: 'pending',
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReviewItem),
      });
      if (res.ok) {
        alert('Thank you for your review!');
        setNewName('');
        setNewRating(5);
        setNewAchievement('Muscle Gain');
        setNewComment('');
        setIsFormOpen(false);
        // Refresh data to show the new review immediately
        await refreshData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to submit review: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to submit review.');
    }
  };

  // Delete functionality removed as it is now exclusively in the admin panel

  const activeReview = reviewsList[currentIndex];

  return (
    <section id="reviews" className="py-20 md:py-24 lg:py-28 bg-[#040404] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="ATHLETE TESTIMONIALS"
          title="TRANSFORMATION STORIES"
          description="Hear directly from our members who have forged their physical potential and reclaimed their peak health."
        />

        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Card */}
          <div className="relative rounded-3xl bg-[#080808]/90 border border-white/10 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl shadow-black/80 text-left min-h-[380px] flex flex-col justify-between overflow-hidden">
            {/* Background Quote Icon */}
            <Quote className="absolute right-8 top-8 w-24 h-24 text-amber-500/5 pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeReview && (
                <motion.div
                  key={activeReview.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Rating Stars & Achievement */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(activeReview.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                        <Trophy className="w-3.5 h-3.5" />
                        {activeReview.achievement}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-base sm:text-lg md:text-xl text-neutral-200 font-sans leading-relaxed italic">
                    "{activeReview.comment}"
                  </p>

                  {/* Member Identity */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div>
                      <h4 className="font-heading text-xl uppercase font-bold text-white">
                        {activeReview.name}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/5">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {reviewsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-amber-500' : 'w-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Buttons to write reviews */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black transition-all font-bold text-sm uppercase tracking-wider cursor-pointer"
          >
            {isFormOpen ? 'Close Review Form' : 'Write a Review'}
          </button>
          <a
            href="https://www.google.com/search?q=powerhouse+fitness+club+erode&client=ms-android-motorola-rvo3&hs=AcdV&sca_esv=85b946b4252f7f97&sxsrf=APpeQnveBmgw2711isuzP8o4_7-9_4GDJQ%3A1784718787677&ei=w6VgapL1KJKK4-EPg7rasQQ&biw=432&oq=powerhouse+fitness+club&gs_lp=EhNtb2JpbGUtZ3dzLXdpei1zZXJwIhdwb3dlcmhvdXNlIGZpdG5lc3MgY2x1YioCCAAyBBAjGCcyBBAjGCcyBBAjGCcyBRAAGIAEMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB5I7RpQ_gxY2hFwAHgAkAEAmAHRAaABrw6qAQYwLjEwLjG4AQHIAQD4AQGYAgKgAqADwgILEAAYgAQYogQYsAPCAggQABjvBRiwA5gDAIgGAZAGBZIHBTAuMS4xoAeNULIHBTAuMS4xuAegA8IHAzMtMsgHIIAIAQ&sclient=mobile-gws-wiz-serp#sv=CAESzQEKuQEStgEKd0FKaVQ0dEpxdnR3MksxM3Jmd1B4VlVKZ0hid0lBNHpaQ3o4MHhmR3FQUm44RVNuQU50TE5zemViLWhEc2xHb281SU1LWTA1WHJTZElMVllQMmxuSUppdkloRmdGUy1ibnlZS2JIUVVmUVZrMnFNLUwwR1J1RlN3EhdFcVpnYW9LeU5laVVzZU1QbTdYeDRRTRoiQURzcjlmVGVJLXNGdll2X1BKUFZMV1NKMHZ1SUpRZUp2QRIEODA1MRoBMyoAMAA4AUAAGAAgj_DsvwxKAhAC"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold text-sm uppercase tracking-wider cursor-pointer"
          >
            Review us on Google
          </a>
        </div>

        {/* Collapsible Review Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl mx-auto mt-8 p-4 sm:p-8 rounded-3xl bg-[#080808]/90 border border-white/10 shadow-2xl overflow-hidden text-left"
            >
              <h3 className="font-heading text-2xl uppercase font-bold text-white mb-6 text-center">
                Submit Your Review
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Goal / Achievement
                  </label>
                  <select
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="General Fitness">General Fitness</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Personal Coaching">Personal Coaching</option>
                    <option value="Cardio & Stamina">Cardio & Stamina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="Write your experience with Power House Gym..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider transition-colors mt-2 cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
