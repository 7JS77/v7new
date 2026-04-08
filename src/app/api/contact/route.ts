import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/zodSchemas';
import type { FormResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<FormResponse>> {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: 'Submitted.' });
    }

    // Validate
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json(
        { success: false, message: `Validation error: ${errors}` },
        { status: 400 }
      );
    }

    const data = result.data;
    const id = crypto.randomUUID();

    console.log('[Contact Form]', {
      id,
      timestamp: new Date().toISOString(),
      subject: data.subject,
      emailDomain: data.email.split('@')[1] ?? 'unknown',
      privacyConsent: data.privacyConsent,
    });

    // TODO: Send email via Resend/SendGrid
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank für Ihre Nachricht! Wir melden uns innerhalb eines Werktages.',
      id,
    });
  } catch (err) {
    console.error('[Contact Form Error]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
