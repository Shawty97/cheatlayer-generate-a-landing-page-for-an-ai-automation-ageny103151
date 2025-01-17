// app/api/submit-marketing/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { marketingCaption, marketingVoice, marketingVideo } = await request.json();

    // Validate input
    if (!marketingCaption || !marketingVoice || !marketingVideo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      start: "desktop",
      goal: "open tiktok",
      key: "66cd1bc53e281423b509383d", // Securely use the API key from environment variables
      json_output: [
        {
          type: "cheat_file",
          file: "repurpose_tiktok_agent.cheat",
          browser_mode: "false",
          caption: marketingCaption,
          voiceover: marketingVoice,
          prompt: marketingVideo
        }
      ]
    };

    const response = await fetch('http://34.133.178.153/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({ message: 'Success', data }, { status: 200 });
  } catch (err) {
    console.error('Error in /api/submit-marketing:', err);
    return NextResponse.json({ error: `Failed to submit: ${err.message}` }, { status: 500 });
  }
}
