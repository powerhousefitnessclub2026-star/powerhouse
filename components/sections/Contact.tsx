'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, Phone, MessageCircle, MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useGymData } from '@/lib/context/GymDataContext';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact-schema';
import { FADE_IN_UP } from '@/lib/animations/framer';

export const Contact: React.FC = () => {
  const { gymInfo, contactOptions } = useGymData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      whatsappNumber: '',
      gender: 'Male',
      age: 25,
      fitnessGoal: contactOptions?.fitnessGoals?.[0] || 'General Fitness',
      preferredTime: contactOptions?.preferredTimes?.[0] || 'Morning (5:30 AM - 9:00 AM)',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSubmitSuccess(
          resData.message || 'Thank you for reaching out! Our team will contact you within 24 hours.'
        );
        reset();
      } else {
        setServerError(resData.error || 'Failed to send enquiry. Please check your form or try again later.');
      }
    } catch (err) {
      setServerError('An unexpected network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-24 lg:py-28 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="GET IN TOUCH"
          title="START YOUR TRANSFORMATION"
          description="Book a complimentary consultation, claim your ₹500 admission privileges, or inquire about master coaching."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-start">
          {/* Quick Contact Info Column */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 lg:col-span-1 text-left"
          >
            <div className="p-6 rounded-2xl bg-[#080808]/80 border border-white/10 space-y-4">
              <h3 className="font-heading text-2xl uppercase font-bold text-white">Direct Contacts</h3>
              <div className="space-y-4 text-sm text-neutral-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Call</p>
                    <p className="text-xs text-neutral-400">+91 73739 96262</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">WhatsApp</p>
                    <p className="text-xs text-neutral-400">+91 93423 03823</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-500 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">WhatsApp Number</p>
                    <p className="text-xs text-neutral-400 break-all">+91 93423 03823</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="text-xs text-neutral-400">{gymInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 to-black border border-red-500/30 text-left">
              <h4 className="font-heading text-lg uppercase font-bold text-white mb-2">
                Fast Response Guarantee
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Submissions are processed immediately. One of our fitness consultants will confirm your preferred timing via call or email.
              </p>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card glowOnHover={false} className="p-4 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left" noValidate>
                {/* Form Status Banners */}
                {submitSuccess && (
                  <div className="p-4 rounded-xl bg-green-950/30 border border-green-500/50 text-green-400 text-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-green-500" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                {serverError && (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/50 text-red-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Lakshan"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="e.g. +91 9876543210"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="WhatsApp Number"
                    type="tel"
                    placeholder="e.g. +91 9342303823"
                    error={errors.whatsappNumber?.message}
                    {...register('whatsappNumber')}
                  />
                  <Input
                    label="Age"
                    type="number"
                    placeholder="e.g. 25"
                    error={errors.age?.message}
                    {...register('age', { valueAsNumber: true })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Gender"
                    options={[
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                      { label: 'Other', value: 'Other' },
                      { label: 'Prefer not to say', value: 'Prefer not to say' },
                    ]}
                    error={errors.gender?.message}
                    {...register('gender')}
                  />

                  <Select
                    label="Fitness Goal"
                    options={(contactOptions?.fitnessGoals || []).map(g => ({ label: g, value: g }))}
                    error={errors.fitnessGoal?.message}
                    {...register('fitnessGoal')}
                  />

                  <Select
                    label="Preferred Timing"
                    options={(contactOptions?.preferredTimes || []).map(t => ({ label: t, value: t }))}
                    error={errors.preferredTime?.message}
                    {...register('preferredTime')}
                  />
                </div>

                <Textarea
                  label="Message / Requirements"
                  placeholder="Tell us about your fitness background, any injuries, or specific goals..."
                  error={errors.message?.message}
                  {...register('message')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  className="gap-2 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Sending Enquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Submit Fitness Inquiry
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
