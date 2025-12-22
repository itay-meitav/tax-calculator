import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, type, email } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL is not configured');
      return NextResponse.json(
        { error: 'Feedback service is not configured' },
        { status: 500 }
      );
    }

    const colors: Record<string, number> = {
      bug: 0xff4444,      // Red
      suggestion: 0x44ff44, // Green
      question: 0x4444ff,
      other: 0xffaa44,
    };

    const embed = {
      title: getTypeTitle(type),
      description: message.trim(),
      color: colors[type] || colors.other,
      fields: [
        ...(email ? [{ name: '📧 Email', value: email, inline: true }] : []),
        { name: '🌐 Source', value: 'Tax Calculator 2023-2026', inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Feedback Form',
      },
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook failed:', await discordResponse.text());
      return NextResponse.json(
        { error: 'Failed to send feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getTypeTitle(type: string): string {
  const titles: Record<string, string> = {
    bug: '🐛 Bug Report',
    suggestion: '💡 Suggestion',
    question: '❓ Question',
    other: '📝 Feedback',
  };
  return titles[type] || titles.other;
}

