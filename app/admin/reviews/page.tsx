'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetch('/api/admin/data?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        // Sort pending reviews first, then by latest if possible
        const sorted = [...(data.REVIEWS || [])].sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return 0;
        });
        setReviews(sorted);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const deleteReview = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      const updated = reviews.filter((r: any) => r.id !== id);
      setReviews(updated);
      
      // Auto-save
      try {
        await fetch('/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ REVIEWS: updated }),
        });
      } catch (err) {
        console.error('Auto-save failed');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ REVIEWS: reviews }),
      });
      setHasChanges(false);
      alert('Reviews saved successfully!');
    } catch (err) {
      alert('Failed to save reviews');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading reviews...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
          Review Moderation
        </h1>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50 w-full md:w-auto"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 overflow-hidden">
        {reviews.length === 0 ? (
          <p className="text-neutral-400">No reviews found.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className={`p-5 rounded-xl border ${review.status === 'pending' ? 'border-amber-500/50 bg-amber-950/10' : 'border-white/10 bg-black'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-heading text-lg uppercase font-bold text-white">{review.name}</h4>
                      <p className="text-xs text-neutral-400">{review.role} • {review.achievement}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-neutral-300 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
