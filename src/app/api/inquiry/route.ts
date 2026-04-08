import { NextRequest, NextResponse } from 'next/server';
import { inquiryFormSchema } from '@/lib/zodSchemas';
import type { FormResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<FormResponse>> {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: 'Submitted.' });
    }

    // Validate with Zod
    const result = inquiryFormSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json(
        { success: false, message: `Validation error: ${errors}` },
        { status: 400 }
      );
    }

    const data = result.data;
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // GDPR retention notice (log only minimal data in prod)
    const logEntry = {
      id,
      timestamp,
      type: 'vtd_inquiry',
      role: data.role,
      commodityCategory: data.commodityCategory,
      // PII not logged in full — only confirmation
      emailDomain: data.email.split('@')[1] ?? 'unknown',
      complianceConfirmed: data.complianceConsent,
      ndaConfirmed: data.ndaConsent,
    };

    console.log('[VTD Inquiry Received]', JSON.stringify(logEntry));

    // TODO: Replace with actual DB write + email via Resend/SendGrid
    // Example (Resend):
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@aurexon.at',
    //   to: data.email,
    //   subject: 'Aurexon GmbH - VTD Inquiry Received',
    //   html: `<p>Your inquiry (ID: ${id}) has been received. NDA will follow within 24h.</p>`,
    // });

    return NextResponse.json({
      success: true,
      message: 'Ihre vertrauliche Anfrage wurde erfolgreich übermittelt. Das NDA wird innerhalb von 24 Geschäftsstunden an Ihre E-Mail-Adresse gesendet.',
      id,
    });
  } catch (err) {
    console.error('[VTD Inquiry Error]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
