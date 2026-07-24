'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Save, Loader2, Upload, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';

export default function MediaPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<'hero' | 'gallery'>('hero');

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ HERO: data.HERO, GALLERY_ITEMS: data.GALLERY_ITEMS }),
      });
      alert('Media settings saved successfully!');
    } catch (err) {
      alert('Failed to save media settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await res.json();
      
      if (res.ok && uploadData.url) {
        if (uploadTarget === 'hero') {
          setData({ ...data, HERO: { ...data.HERO, videoUrl: uploadData.url } });
        } else {
          // Add to gallery
          const newGalleryItem = {
            id: `g-${Date.now()}`,
            title: file.name.split('.')[0] || 'New Image',
            category: 'Gym Floor',
            image: uploadData.url,
            description: 'New gallery image added from admin panel.'
          };
          setData({ ...data, GALLERY_ITEMS: [newGalleryItem, ...(data.GALLERY_ITEMS || [])] });
        }
      } else {
        alert(uploadData.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (target: 'hero' | 'gallery') => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const removeGalleryItem = (index: number) => {
    if (confirm('Remove this image from the gallery?')) {
      const newItems = [...data.GALLERY_ITEMS];
      newItems.splice(index, 1);
      setData({ ...data, GALLERY_ITEMS: newItems });
    }
  };

  const handleGalleryChange = (index: number, field: string, value: string) => {
    const newItems = [...data.GALLERY_ITEMS];
    newItems[index][field] = value;
    setData({ ...data, GALLERY_ITEMS: newItems });
  };

  if (loading) return <p className="text-neutral-400">Loading media...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
          Manage Media
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider transition-colors disabled:opacity-50 w-full md:w-auto"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept={uploadTarget === 'hero' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'} 
      />

      {/* HERO SECTION */}
      <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 text-amber-500 mb-2">
          <Video className="w-6 h-6" />
          <h2 className="font-heading text-xl uppercase font-bold">Hero Background Video</h2>
        </div>
        
        <div>
          <label className="block text-xs uppercase text-neutral-400 mb-1">Current Video URL</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={data.HERO?.videoUrl || ''}
              onChange={(e) => setData({ ...data, HERO: { ...data.HERO, videoUrl: e.target.value } })}
              className="flex-1 px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:border-amber-500 focus:outline-none"
            />
            <button 
              onClick={() => triggerUpload('hero')}
              disabled={uploadingFile}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
            >
              {uploadingFile && uploadTarget === 'hero' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload New MP4
            </button>
          </div>
        </div>

        {data.HERO?.videoUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10 w-full max-w-md bg-black">
            <video src={data.HERO.videoUrl} autoPlay loop muted playsInline className="w-full h-auto" />
          </div>
        )}
      </div>

      {/* GALLERY SECTION */}
      <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 text-amber-500">
            <ImageIcon className="w-6 h-6" />
            <h2 className="font-heading text-xl uppercase font-bold">Gallery Images</h2>
          </div>
          <button 
            onClick={() => triggerUpload('gallery')}
            disabled={uploadingFile}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium w-full sm:w-auto"
          >
            {uploadingFile && uploadTarget === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.GALLERY_ITEMS?.map((item: any, i: number) => (
            <div key={item.id} className="bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col">
              <div className="relative h-48 w-full bg-neutral-900 group">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removeGalleryItem(i)} className="p-3 bg-red-600 rounded-full text-white hover:scale-110 transition-transform">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3 flex-1">
                <div>
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={item.title}
                    onChange={(e) => handleGalleryChange(i, 'title', e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-[#121212] border border-white/5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-neutral-500 mb-1">Category</label>
                  <select 
                    value={item.category}
                    onChange={(e) => handleGalleryChange(i, 'category', e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-[#121212] border border-white/5 text-neutral-300 focus:border-amber-500 focus:outline-none"
                  >
                    <option>Gym Floor</option>
                    <option>Equipment</option>
                    <option>Training</option>
                    <option>All</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
