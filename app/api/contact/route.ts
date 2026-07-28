import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/schemas/contact-schema';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side Zod validation
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed. Please check your form input fields.',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, whatsappNumber, gender, age, fitnessGoal, preferredTime, message } =
      validationResult.data;

    // Resend Email Integration
    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || 'powerhousefitnessclub2026@gmail.com';

    if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY') {
      console.warn('RESEND_API_KEY is missing or unconfigured.');
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is unconfigured. Please ensure RESEND_API_KEY is set in .env.local.',
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #080808; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #333;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">
          POWER HOUSE FITNESS CLUB - NEW MEMBERSHIP ENQUIRY
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa; width: 140px;">Full Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #222; color: #fff;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Phone Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #222; color: #fff;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">WhatsApp Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #222; color: #fff;">${whatsappNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Gender & Age:</td>
            <td style="padding: 10px; border-bottom: 1px solid #222; color: #fff;">${gender}, ${age} yrs</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Fitness Goal:</td>
            <td style="padding: 10px; border-bottom: 1px solid #222; color: #dc2626; font-weight: bold;">${fitnessGoal}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #222; font-weight: bold; color: #aaa;">Preferred Timing:</td>
            <td style="padding: 10px; border-bottom: 1px solid #222; color: #fff;">${preferredTime}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 14px; background-color: #121212; border-radius: 8px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; font-weight: bold; color: #aaa;">User Message:</p>
          <p style="margin-top: 6px; color: #eee; font-style: italic;">"${message}"</p>
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #666; text-align: center;">
          Sent automatically via Power House Fitness Club Web Platform.
        </p>
      </div>
    `;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Power House Fitness <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `[New Gym Lead] ${name} - ${fitnessGoal}`,
      html: htmlContent,
    });

    if (resendError) {
      console.error('Resend API Error:', resendError);
      return NextResponse.json(
        {
          success: false,
          error: `Resend email delivery error: ${resendError.message}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been received successfully! Our team will contact you shortly.',
        resendId: resendData?.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API Contact Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'An internal server error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
}
