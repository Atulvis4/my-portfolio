import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not set in .env');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

async function embedText(text) {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function chatCompletion(systemPrompt, history, userMessage) {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  // Convert history to Gemini format
  const geminiHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

export { embedText, chatCompletion };
