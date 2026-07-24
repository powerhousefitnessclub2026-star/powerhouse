'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(data => {
        setTrainers(data.TRAINERS || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const newTrainers = [...trainers];
    newTrainers[index][field] = value;
    setTrainers(newTrainers);
  };

  const handleAccoladeChange = (trainerIndex: number, accoladeIndex: number, value: string) => {
    const newTrainers = [...trainers];
    newTrainers[trainerIndex].accolades[accoladeIndex] = value;
    setTrainers(newTrainers);
  };

  const addAccolade = (trainerIndex: number) => {
    const newTrainers = [...trainers];
    newTrainers[trainerIndex].accolades.push('');
    setTrainers(newTrainers);
  };

  const removeAccolade = (trainerIndex: number, accoladeIndex: number) => {
    const newTrainers = [...trainers];
    newTrainers[trainerIndex].accolades.splice(accoladeIndex, 1);
    setTrainers(newTrainers);
  };

  const addTrainer = () => {
    setTrainers([
      ...trainers,
      {
        id: `t-${Date.now()}`,
        name: 'NEW TRAINER',
        role: 'Trainer Role',
        quote: 'Motivational quote',
        accolades: [''],
      }
    ]);
  };

  const removeTrainer = (index: number) => {
    if (confirm('Are you sure you want to remove this trainer?')) {
      const newTrainers = [...trainers];
      newTrainers.splice(index, 1);
      setTrainers(newTrainers);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TRAINERS: trainers }),
      });
      alert('Trainers saved successfully!');
    } catch (err) {
      alert('Failed to save trainers');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading trainers...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
          Manage Trainers
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addTrainer}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Trainer
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {trainers.map((trainer, i) => (
          <div key={trainer.id} className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold uppercase text-amber-500">Trainer {i + 1}</h3>
              <button onClick={() => removeTrainer(i)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-neutral-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={trainer.name}
                  onChange={(e) => handleChange(i, 'name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-neutral-400 mb-1">Role</label>
                <input 
                  type="text" 
                  value={trainer.role}
                  onChange={(e) => handleChange(i, 'role', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-neutral-300 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-neutral-400 mb-1">Quote</label>
              <textarea 
                value={trainer.quote}
                onChange={(e) => handleChange(i, 'quote', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-neutral-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase text-neutral-400">Accolades</label>
                <button onClick={() => addAccolade(i)} className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {trainer.accolades.map((accolade: string, accIndex: number) => (
                  <div key={accIndex} className="flex gap-2">
                    <input 
                      type="text" 
                      value={accolade}
                      onChange={(e) => handleAccoladeChange(i, accIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-black border border-white/10 text-neutral-300 text-sm focus:border-amber-500 focus:outline-none"
                    />
                    <button onClick={() => removeAccolade(i, accIndex)} className="p-2 text-neutral-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
