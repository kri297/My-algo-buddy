import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SYSTEM_PROMPT = `You are AlgoBuddy AI, an expert coding assistant specializing in data structures and algorithms. Your role is to help students learn effectively by:

1. **Explaining concepts clearly** - Break down complex topics into digestible pieces
2. **Providing hints, not solutions** - Guide students to discover answers themselves
3. **Analyzing code** - Point out issues, suggest improvements, explain time/space complexity
4. **Recommending resources** - Suggest relevant problems and learning materials
5. **Being encouraging** - Motivate students and celebrate their progress

Guidelines:
- Keep responses concise but thorough
- Use examples when explaining concepts
- Format code with proper syntax
- Explain time and space complexity when relevant
- Be patient and friendly
- If asked for a full solution, give hints first
- Use emojis sparingly for engagement 🎯

Topics you excel at:
- Arrays, Strings, Linked Lists, Stacks, Queues
- Trees, Graphs, Heaps, Tries
- Sorting, Searching, Dynamic Programming
- Greedy Algorithms, Backtracking, Recursion
- Big O notation and complexity analysis`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing');
      return NextResponse.json(
        { message: 'Sorry, the AI assistant is not configured yet. Please add your Gemini API key to the .env.local file.' },
        { status: 200 }
      );
    }

    console.log('API Key present:', GEMINI_API_KEY.substring(0, 10) + '...');

    // Format messages for Gemini API
    const conversationHistory = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        parts: [{ text: m.content }],
        role: m.role === 'assistant' ? 'model' : 'user',
      }));

    console.log('Sending request to Gemini API...');

    // Add system prompt as first message
    const prompt = {
      contents: [
        {
          parts: [{ text: SYSTEM_PROMPT }],
          role: 'user',
        },
        {
          parts: [{ text: 'I understand. I will help students learn about algorithms and data structures by providing clear explanations, hints, and guidance.' }],
          role: 'model',
        },
        ...conversationHistory,
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { message: `Sorry, I encountered an error (${response.status}). Please check your API key or try again later.` },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiMessage) {
      console.error('No AI message in response:', data);
      return NextResponse.json(
        { message: "I couldn't generate a response. Please try rephrasing your question." },
        { status: 200 }
      );
    }

    console.log('Successfully got AI response');
    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('Chatbot API error:', error.message);
    return NextResponse.json(
      { 
        message: "I'm having trouble connecting right now. The AI service might be temporarily unavailable. Please try again in a moment."
      },
      { status: 500 }
    );
  }
}
