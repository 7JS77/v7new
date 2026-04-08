import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(200).optional(),
  subject: z.enum(['intermediation', 'trading', 'information', 'general'], {
    required_error: 'Please select a subject',
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
  honeypot: z.string().max(0).optional(),
});

export const inquiryFormSchema = z.object({
  name: z.string().min(2, 'Full name required').max(100),
  company: z.string().min(1, 'Company name required').max(200),
  email: z.string().email('Valid business email required'),
  phone: z.string().max(50).optional(),
  role: z.enum(['seller', 'buyer', 'broker', 'other'], {
    required_error: 'Please select your role',
  }),
  commodityCategory: z.enum(['metals', 'energy', 'agriculture'], {
    required_error: 'Please select a commodity category',
  }),
  quantity: z.string().max(200).optional(),
  incoterm: z.string().max(100).optional(),
  description: z.string().min(20, 'Please provide a description (min. 20 characters)').max(5000),
  ndaConsent: z.literal(true, {
    errorMap: () => ({ message: 'NDA consent is required to proceed' }),
  }),
  complianceConsent: z.literal(true, {
    errorMap: () => ({ message: 'Compliance confirmation is required' }),
  }),
  honeypot: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type InquiryFormData = z.infer<typeof inquiryFormSchema>;
