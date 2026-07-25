'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

export default function MembershipsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/data?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setPlans(data.MEMBERSHIP_PLANS || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const newPlans = [...plans];
    newPlans[index][field] = value;
    setPlans(newPlans);
  };

  const handleAddPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      name: 'New Plan',
      duration: '1 Month',
      strengthPrice: '₹0',
      cardioStrengthPrice: '₹0',
      admissionFee: '₹0',
      badge: ''
    };
    setPlans([...plans, newPlan]);
  };

  const handleRemovePlan = (index: number) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      const newPlans = [...plans];
      newPlans.splice(index, 1);
      setPlans(newPlans);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ MEMBERSHIP_PLANS: plans }),
      });
      alert('Memberships saved successfully!');
    } catch (err) {
      alert('Failed to save memberships');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading memberships...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
          Manage Memberships
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddPlan}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-amber-500 font-bold uppercase tracking-wider transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Plan
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50 w-full md:w-auto"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, i) => (
          <div key={plan.id} className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-xl font-bold uppercase text-amber-500">
                <input 
                  type="text"
                  value={plan.name}
                  onChange={(e) => handleChange(i, 'name', e.target.value)}
                  className="bg-transparent border-b border-white/20 focus:border-amber-500 focus:outline-none w-full max-w-[200px]"
                />
              </h3>
              <button 
                onClick={() => handleRemovePlan(i)}
                className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                title="Delete Plan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <label className="block text-xs uppercase text-neutral-400 mb-1">Duration</label>
              <input 
                type="text" 
                value={plan.duration}
                onChange={(e) => handleChange(i, 'duration', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-neutral-400 mb-1">Strength Price</label>
                <input 
                  type="text" 
                  value={plan.strengthPrice}
                  onChange={(e) => handleChange(i, 'strengthPrice', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-neutral-400 mb-1">Cardio + Strength Price</label>
                <input 
                  type="text" 
                  value={plan.cardioStrengthPrice}
                  onChange={(e) => handleChange(i, 'cardioStrengthPrice', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-cyan-400 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase text-neutral-400 mb-1">Admission Fee</label>
              <input 
                type="text" 
                value={plan.admissionFee}
                onChange={(e) => handleChange(i, 'admissionFee', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase text-neutral-400 mb-1">Badge (Optional)</label>
              <input 
                type="text" 
                value={plan.badge || ''}
                onChange={(e) => handleChange(i, 'badge', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-red-500 font-bold focus:border-amber-500 focus:outline-none"
                placeholder="e.g. BEST VALUE"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
