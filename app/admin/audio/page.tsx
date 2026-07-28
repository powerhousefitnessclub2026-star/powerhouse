'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2, Music, Upload, CheckCircle2, Play, Pause } from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

export default function AudioAdminPage() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Audio preview state
  const [previewingUrl, setPreviewingUrl] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/api/admin/data?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        let audioList = data.AUDIO_TRACKS || [];
        // Default track if empty
        if (audioList.length === 0) {
          audioList = [
            {
              id: 'default-bgm',
              title: 'Tamil Fitness BGM',
              url: '/assets/audio/bgm.mp3.aac',
              active: true,
            },
          ];
        }
        setTracks(audioList);
        setLoading(false);
      })
      .catch(console.error);

    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, []);

  const togglePreview = (url: string) => {
    if (previewingUrl === url) {
      if (audioObj) audioObj.pause();
      setPreviewingUrl(null);
    } else {
      if (audioObj) audioObj.pause();
      const newAudio = new Audio(url);
      newAudio.play().catch(console.error);
      newAudio.onended = () => setPreviewingUrl(null);
      setAudioObj(newAudio);
      setPreviewingUrl(url);
    }
  };

  const handleChange = (index: number, field: keyof AudioTrack, value: any) => {
    const updated = [...tracks];
    updated[index] = { ...updated[index], [field]: value };
    setTracks(updated);
  };

  const handleSetActive = (index: number) => {
    const updated = tracks.map((track, i) => ({
      ...track,
      active: i === index,
    }));
    setTracks(updated);
  };

  const addTrack = () => {
    const newTrack: AudioTrack = {
      id: `audio-${Date.now()}`,
      title: 'New Tamil Track',
      url: '/assets/audio/bgm.mp3.aac',
      active: tracks.length === 0,
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (index: number) => {
    if (confirm('Are you sure you want to delete this audio track?')) {
      const updated = [...tracks];
      const deletedWasActive = updated[index].active;
      updated.splice(index, 1);
      
      // If deleted track was active, set first track as active
      if (deletedWasActive && updated.length > 0) {
        updated[0].active = true;
      }
      
      setTracks(updated);
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        handleChange(index, 'url', data.url);
        alert('Audio file uploaded successfully!');
      } else {
        alert(data.error || 'Failed to upload audio file');
      }
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AUDIO_TRACKS: tracks }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save audio settings');
      }
    } catch (err) {
      alert('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-400">Loading audio tracks...</p>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white flex items-center gap-3">
            <Music className="w-8 h-8 text-amber-500" /> Manage BGM Audio Tracks
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Add, update, or delete background music tracks. The active track plays on the main website.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={addTrack}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-sm tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Track
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase text-sm tracking-wider transition-all disabled:opacity-50 ${
              savedSuccess
                ? 'bg-green-500 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : savedSuccess ? (
              '✓ Saved!'
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Audio Tracks List */}
      <div className="space-y-6">
        {tracks.map((track, index) => (
          <div
            key={track.id || index}
            className={`p-6 rounded-2xl border transition-all ${
              track.active
                ? 'bg-[#181510] border-amber-500/50 shadow-xl shadow-amber-950/20'
                : 'bg-[#121212] border-white/10'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSetActive(index)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    track.active
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {track.active ? 'Active Website BGM' : 'Set as Active'}
                </button>
                <span className="font-heading text-lg font-bold text-white uppercase">
                  {track.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Preview Button */}
                <button
                  onClick={() => togglePreview(track.url)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {previewingUrl === track.url ? (
                    <><Pause className="w-3.5 h-3.5 text-amber-400" /> Stop</>
                  ) : (
                    <><Play className="w-3.5 h-3.5 text-amber-400" /> Preview</>
                  )}
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => removeTrack(index)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors border border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1.5 tracking-widest">Track Title</label>
                <input
                  type="text"
                  value={track.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white font-medium text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. Tamil Gym Motivation BGM"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-400 mb-1.5 tracking-widest">
                  Audio File URL / Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={track.url}
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/10 text-amber-400 font-mono text-xs focus:border-amber-500 focus:outline-none"
                    placeholder="/assets/audio/bgm.mp3.aac"
                  />

                  {/* File Upload Button */}
                  <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase cursor-pointer transition-colors shrink-0">
                    {uploadingIndex === index ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-400" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(index, file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        {tracks.length === 0 && (
          <div className="text-center py-20 text-neutral-500 bg-[#121212] rounded-2xl border border-white/10">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No audio tracks yet.</p>
            <p className="text-sm mt-1">Click "Add New Track" to upload or add music.</p>
          </div>
        )}
      </div>
    </div>
  );
}
