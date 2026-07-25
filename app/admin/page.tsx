'use client';

import React, { useEffect, useState } from 'react';
import { Users, Phone, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/data?t=' + Date.now())
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  }, []);

  if (!data) return <p className="text-neutral-400">Loading dashboard...</p>;

  const leads = data.LEADS || [];
  const pendingReviews = data.REVIEWS?.filter((r: any) => r.status === 'pending') || [];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-white">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4 text-amber-500">
            <Users className="w-8 h-8" />
            <h3 className="font-heading text-xl uppercase font-bold">Total Leads</h3>
          </div>
          <p className="text-4xl font-bold text-white">{leads.length}</p>
        </div>

        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4 text-cyan-400">
            <Calendar className="w-8 h-8" />
            <h3 className="font-heading text-xl uppercase font-bold">Memberships</h3>
          </div>
          <p className="text-4xl font-bold text-white">{data.MEMBERSHIP_PLANS?.length || 0}</p>
        </div>

        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4 text-red-500">
            <Phone className="w-8 h-8" />
            <h3 className="font-heading text-xl uppercase font-bold">Pending Reviews</h3>
          </div>
          <p className="text-4xl font-bold text-white">{pendingReviews.length}</p>
        </div>
      </div>

      <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 mt-8">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white mb-6">
          Recent Contact Leads
        </h2>
        
        {leads.length === 0 ? (
          <p className="text-neutral-400">No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Name</th>
                  <th className="pb-4 font-semibold">Phone</th>
                  <th className="pb-4 font-semibold">Subject</th>
                  <th className="pb-4 font-semibold">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead: any, i: number) => (
                  <tr key={i} className="text-neutral-300 hover:bg-white/5">
                    <td className="py-4 pr-4">{new Date(lead.date).toLocaleDateString()}</td>
                    <td className="py-4 pr-4 font-bold text-white">{lead.name}</td>
                    <td className="py-4 pr-4">{lead.phone}</td>
                    <td className="py-4 pr-4">{lead.subject}</td>
                    <td className="py-4 pr-4 max-w-xs truncate" title={lead.message}>{lead.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
