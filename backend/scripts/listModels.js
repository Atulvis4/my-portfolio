require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`
  );
  const data = await res.json();

  if (!res.ok) {
    console.error('API Error:', data);
    return;
  }

  const embedding = data.models.filter(m =>
    m.supportedGenerationMethods?.includes('embedContent')
  );
  const chat = data.models.filter(m =>
    m.supportedGenerationMethods?.includes('generateContent')
  );

  console.log('\n=== EMBEDDING MODELS (support embedContent) ===');
  embedding.forEach(m => console.log(' -', m.name));

  console.log('\n=== CHAT MODELS (support generateContent) ===');
  chat.forEach(m => console.log(' -', m.name));
}

listModels().catch(console.error);
