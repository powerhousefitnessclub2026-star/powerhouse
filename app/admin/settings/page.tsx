'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Clock, Lock, List, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [gymInfo, setGymInfo] = useState<any>(null);
  const [contactOptions, setContactOptions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Section saving states
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Security
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [savingAuth, setSavingAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/data?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setGymInfo(data.GYM_INFO || {});
        setContactOptions(data.CONTACT_OPTIONS || { fitnessGoals: [], preferredTimes: [] });
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (field: string, value: string) => {
    setGymInfo({ ...gymInfo, [field]: value });
  };

  const handleTimingChange = (index: number, field: string, value: string) => {
    const newTimings = [...(gymInfo.workingHours || [])];
    newTimings[index][field] = value;
    setGymInfo({ ...gymInfo, workingHours: newTimings });
  };

  const handleAddTiming = () => {
    const newTimings = [...(gymInfo.workingHours || []), { days: 'New Day', time: '00:00 AM - 00:00 PM' }];
    setGymInfo({ ...gymInfo, workingHours: newTimings });
  };

  const handleRemoveTiming = (index: number) => {
    const newTimings = [...(gymInfo.workingHours || [])];
    newTimings.splice(index, 1);
    setGymInfo({ ...gymInfo, workingHours: newTimings });
  };

  const handleSocialChange = (field: string, value: string) => {
    setGymInfo({ 
      ...gymInfo, 
      socials: { ...(gymInfo.socials || {}), [field]: value } 
    });
  };

  // Contact Options Handlers
  const handleOptionChange = (type: 'fitnessGoals' | 'preferredTimes', index: number, value: string) => {
    const newList = [...contactOptions[type]];
    newList[index] = value;
    setContactOptions({ ...contactOptions, [type]: newList });
  };

  const addOption = (type: 'fitnessGoals' | 'preferredTimes') => {
    setContactOptions({ ...contactOptions, [type]: [...contactOptions[type], 'New Option'] });
  };

  const removeOption = (type: 'fitnessGoals' | 'preferredTimes', index: number) => {
    const newList = [...contactOptions[type]];
    newList.splice(index, 1);
    setContactOptions({ ...contactOptions, [type]: newList });
  };

  const handleSaveData = async (section: string, type: 'gym' | 'contact') => {
    setSavingSection(section);
    try {
      const payload = type === 'gym' 
        ? { GYM_INFO: gymInfo } 
        : { CONTACT_OPTIONS: contactOptions };
        
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      alert(`${section} saved successfully!`);
    } catch (err) {
      alert(`Failed to save ${section}`);
    } finally {
      setSavingSection(null);
    }
  };

  const handleUpdateAuth = async () => {
    setAuthFeedback(null);
    const user = adminUser.trim();
    const pass = adminPass.trim();

    if (!user || !pass) {
      setAuthFeedback({ type: 'error', message: 'Username and password cannot be empty' });
      return;
    }
    if (user.length < 3) {
      setAuthFeedback({ type: 'error', message: 'Username must be at least 3 characters long' });
      return;
    }
    if (pass.length < 4) {
      setAuthFeedback({ type: 'error', message: 'Password must be at least 4 characters long' });
      return;
    }

    setSavingAuth(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthFeedback({
          type: 'success',
          message: 'Admin credentials updated successfully! Old credentials are disabled and new credentials are active immediately.',
        });
        setAdminUser('');
        setAdminPass('');
      } else {
        setAuthFeedback({ type: 'error', message: data.error || data.message || 'Failed to update credentials' });
      }
    } catch (err) {
      setAuthFeedback({ type: 'error', message: 'Error updating credentials. Please try again.' });
    } finally {
      setSavingAuth(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading settings...</p>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
          Gym Settings
        </h1>
      </div>

      {/* SECURITY SECTION */}
      <div className="bg-[#121212] p-6 rounded-2xl border border-red-500/30 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Lock className="w-32 h-32 text-red-500" />
        </div>
        <div className="flex items-center gap-3 text-red-500 mb-4 relative z-10">
          <Lock className="w-6 h-6" />
          <h2 className="font-heading text-xl uppercase font-bold">Admin Credentials</h2>
        </div>

        {authFeedback && (
          <div className={`p-4 rounded-xl text-sm font-semibold relative z-10 border ${
            authFeedback.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {authFeedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 max-w-2xl">
          <div>
            <label className="block text-xs uppercase text-neutral-400 mb-1">New Username</label>
            <input 
              type="text" 
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black border border-red-500/20 text-white focus:border-red-500 focus:outline-none"
              placeholder="Enter new username"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-neutral-400 mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 pr-10 py-2 rounded-lg bg-black border border-red-500/20 text-white focus:border-red-500 focus:outline-none"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleUpdateAuth}
          disabled={savingAuth}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-sm tracking-wider transition-colors relative z-10"
        >
          {savingAuth ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Credentials
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-xl uppercase font-bold text-amber-500">Basic Information</h2>
            <button
              onClick={() => handleSaveData('Basic Information', 'gym')}
              disabled={savingSection === 'Basic Information'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-50"
            >
              {savingSection === 'Basic Information' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Info
            </button>
          </div>
          
          <div>
            <label className="block text-xs uppercase text-neutral-400 mb-1">Gym Name</label>
            <input 
              type="text" 
              value={gymInfo.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-400 mb-1">Address</label>
            <textarea 
              rows={2}
              value={gymInfo.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-neutral-400 mb-1">Phone</label>
              <input 
                type="text" 
                value={gymInfo.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-400 mb-1">Email</label>
              <input 
                type="email" 
                value={gymInfo.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Timings */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3 text-amber-500">
              <Clock className="w-6 h-6" />
              <h2 className="font-heading text-xl uppercase font-bold">Working Hours</h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddTiming}
                className="text-xs flex items-center gap-1 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                onClick={() => handleSaveData('Working Hours', 'gym')}
                disabled={savingSection === 'Working Hours'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-50"
              >
                {savingSection === 'Working Hours' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Timings
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {gymInfo.workingHours?.map((timing: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-white/5 bg-black">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1">Days</label>
                  <input 
                    type="text" 
                    value={timing.days}
                    onChange={(e) => handleTimingChange(i, 'days', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-[#121212] border border-white/5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1">Time</label>
                  <input 
                    type="text" 
                    value={timing.time}
                    onChange={(e) => handleTimingChange(i, 'time', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-[#121212] border border-white/5 text-cyan-400 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => handleRemoveTiming(i)}
                    className="p-2 text-neutral-500 hover:text-red-500 mb-1 transition-colors"
                    title="Remove Timing"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Contact Options */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-amber-500">
              <List className="w-6 h-6" />
              <h2 className="font-heading text-xl uppercase font-bold">Contact Form Options</h2>
            </div>
            <button
              onClick={() => handleSaveData('Contact Options', 'contact')}
              disabled={savingSection === 'Contact Options'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-50"
            >
              {savingSection === 'Contact Options' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Options
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fitness Goals */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold uppercase text-neutral-300">Fitness Goals</label>
                <button onClick={() => addOption('fitnessGoals')} className="text-xs flex items-center gap-1 text-amber-500 hover:text-amber-400">
                  <Plus className="w-4 h-4" /> Add Goal
                </button>
              </div>
              <div className="space-y-2">
                {contactOptions.fitnessGoals.map((goal: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={goal}
                      onChange={(e) => handleOptionChange('fitnessGoals', idx, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                    />
                    <button onClick={() => removeOption('fitnessGoals', idx)} className="p-2 text-neutral-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Timings */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold uppercase text-neutral-300">Preferred Timings</label>
                <button onClick={() => addOption('preferredTimes')} className="text-xs flex items-center gap-1 text-amber-500 hover:text-amber-400">
                  <Plus className="w-4 h-4" /> Add Time
                </button>
              </div>
              <div className="space-y-2">
                {contactOptions.preferredTimes.map((time: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={time}
                      onChange={(e) => handleOptionChange('preferredTimes', idx, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm rounded-lg bg-black border border-white/10 text-cyan-400 focus:border-amber-500 focus:outline-none"
                    />
                    <button onClick={() => removeOption('preferredTimes', idx)} className="p-2 text-neutral-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-xl uppercase font-bold text-amber-500">Social Media Links</h2>
            <button
              onClick={() => handleSaveData('Social Links', 'gym')}
              disabled={savingSection === 'Social Links'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-50"
            >
              {savingSection === 'Social Links' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Links
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['instagram', 'facebook', 'youtube', 'whatsapp'].map((social) => (
              <div key={social}>
                <label className="block text-xs uppercase text-neutral-400 mb-1">{social}</label>
                <input 
                  type="text" 
                  value={gymInfo.socials?.[social] || ''}
                  onChange={(e) => handleSocialChange(social, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                  placeholder={`Enter ${social} URL`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
