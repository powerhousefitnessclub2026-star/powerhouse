import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\s\-()]+$/, 'Invalid phone number format'),
  email: z.string().email('Please enter a valid email address'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .min(14, 'Minimum age is 14')
    .max(90, 'Maximum age is 90'),
  fitnessGoal: z.string().min(2, 'Please select a fitness goal'),
  preferredTime: z.string().min(2, 'Please select a preferred workout time'),
  message: z.string().max(1000, 'Message is too long').optional().or(z.literal('')),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
