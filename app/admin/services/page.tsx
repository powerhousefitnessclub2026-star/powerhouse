'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2, Dumbbell, ArrowUp, ArrowDown } from 'lucide-react';

const ICON_OPTIONS = ['Dumbbell', 'Zap', 'Flame', 'Sparkles', 'BicepsFlexed', 'HeartPulse'];

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/data?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setServices(data.SERVICES || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleHighlightChange = (sIdx: number, hIdx: number, value: string) => {
    const updated = [...services];
    const highlights = [...(updated[sIdx].highlights || [])];
    highlights[hIdx] = value;
    updated[sIdx] = { ...updated[sIdx], highlights };
    setServices(updated);
  };

  const addHighlight = (sIdx: number) => {
    const updated = [...services];
    updated[sIdx] = { ...updated[sIdx], highlights: [...(updated[sIdx].highlights || []), 'New Feature'] };
    setServices(updated);
  };

  const removeHighlight = (sIdx: number, hIdx: number) => {
    const updated = [...services];
    const highlights = [...(updated[sIdx].highlights || [])];
    highlights.splice(hIdx, 1);
    updated[sIdx] = { ...updated[sIdx], highlights };
    setServices(updated);
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === services.length - 1) return;
    const updated = [...services];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    // Swap array positions
    [updated[index], updated[swapIdx]] = [updated[swapIdx], updated[index]];
    // Re-number sequentially
    const renumbered = updated.map((s, i) => ({ ...s, number: String(i + 1).padStart(2, '0') }));
    setServices(renumbered);
  };

  const addService = () => {
    const nextNum = String(services.length + 1).padStart(2, '0');
    setServices([...services, {
      id: `service-${Date.now()}`,
      number: nextNum,
      title: 'New Service',
      description: 'Describe this service.',
      iconName: 'Dumbbell',
      highlights: ['Feature 1', 'Feature 2'],
    }]);
  };

  const removeService = (index: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updated = [...services];
      updated.splice(index, 1);
      setServices(updated);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SERVICES: services }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('Failed to save services. Please try again.');
      }
    } catch (err) {
      alert('Network error. Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading services...</p>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
            Elite Services
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {services.length} service{services.length !== 1 ? 's' : ''} — changes are saved to the live website.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addService}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-sm tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase text-sm tracking-wider transition-all disabled:opacity-50 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              '✓ Saved!'
            ) : (
              <><Save className="w-4 h-4" /> Save All Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-5">
        {services.map((service: any, sIdx: number) => (
          <div
            key={service.id || sIdx}
            className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Service Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/30">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-heading text-2xl font-black">{service.number}</span>
                <span className="font-heading text-lg font-bold text-white uppercase tracking-wide">
                  {service.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Move buttons */}
                <button
                  onClick={() => moveService(sIdx, 'up')}
                  disabled={sIdx === 0}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveService(sIdx, 'down')}
                  disabled={sIdx === services.length - 1}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-400 hover:bg-amber-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button
                  onClick={() => removeService(sIdx)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors border border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>

            {/* Service Fields */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1.5 tracking-widest">Number</label>
                  <input
                    type="text"
                    value={service.number || ''}
                    onChange={(e) => handleChange(sIdx, 'number', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-black border border-white/10 text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1.5 tracking-widest">Title</label>
                  <input
                    type="text"
                    value={service.title || ''}
                    onChange={(e) => handleChange(sIdx, 'title', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1.5 tracking-widest">Icon</label>
                  <select
                    value={service.iconName || 'Dumbbell'}
                    onChange={(e) => handleChange(sIdx, 'iconName', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-500 mb-1.5 tracking-widest">Description</label>
                <textarea
                  rows={2}
                  value={service.description || ''}
                  onChange={(e) => handleChange(sIdx, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-black border border-white/10 text-neutral-300 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] uppercase text-neutral-500 tracking-widest">Highlights</label>
                  <button
                    onClick={() => addHighlight(sIdx)}
                    className="text-[10px] flex items-center gap-1 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add Highlight
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(service.highlights || []).map((h: string, hIdx: number) => (
                    <div key={hIdx} className="flex gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleHighlightChange(sIdx, hIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-black border border-white/10 text-neutral-300 focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeHighlight(sIdx, hIdx)}
                        className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No services yet.</p>
          <p className="text-sm mt-1">Click "Add New Service" to get started.</p>
        </div>
      )}
    </div>
  );
}
