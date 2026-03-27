import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { clientInfo, postBrief } = await req.json();

  if (!clientInfo || !postBrief) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `You are a LinkedIn ghostwriter specializing in biotech/pharma content. Generate 3 LinkedIn post variations based on this brief:

CLIENT PROFILE:
- Name: ${clientInfo.name}
- Role: ${clientInfo.role} at ${clientInfo.company}
- Expertise: ${clientInfo.expertise}
- Target Audience: ${clientInfo.targetAudience}

POST BRIEF:
- Topic: ${postBrief.topic}
- Goal: ${postBrief.goal}
- Tone: ${postBrief.tone}
- Personal Story/Context: ${postBrief.personalStory || 'None provided'}
- Key Points to Cover: ${postBrief.keyPoints}
- Call to Action: ${postBrief.callToAction || 'None specified'}
- Include Hashtags: ${postBrief.includeHashtags ? 'Yes' : 'No'}

REQUIREMENTS:
1. Create 3 different variations (each with a different hook/angle)
2. Keep posts between 150-250 words
3. Use engaging hooks that stop the scroll
4. Balance scientific credibility with accessibility
5. Include line breaks for readability
6. If hashtags requested, add 3-5 relevant ones at the end
7. Make it sound authentic to the client's voice, not robotic

Return ONLY a JSON object with this structure (no markdown, no preamble):
{
  "posts": [
    {
      "variant": "Variant 1: [brief description of angle]",
      "content": "The actual LinkedIn post text here..."
    },
    {
      "variant": "Variant 2: [brief description of angle]",
      "content": "The actual LinkedIn post text here..."
    },
    {
      "variant": "Variant 3: [brief description of angle]",
      "content": "The actual LinkedIn post text here..."
    }
  ]
}`,
      },
    ],
  });

  const textContent = message.content.find((item) => item.type === 'text')?.text || '';
  const cleanedText = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return new Response(cleanedText, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = {
  path: '/api/generate-posts',
  method: 'POST',
};
