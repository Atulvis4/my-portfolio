import { QdrantClient } from '@qdrant/js-client-rest';

const COLLECTION_NAME = 'resume';

let client;

function getQdrantClient() {
  if (!client) {
    const config = { url: process.env.QDRANT_URL || 'http://localhost:6333' };
    if (process.env.QDRANT_API_KEY) config.apiKey = process.env.QDRANT_API_KEY;
    client = new QdrantClient(config);
  }
  return client;
}

async function ensureCollection(vectorSize) {
  const qdrant = getQdrantClient();
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

  if (!exists) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: vectorSize, distance: 'Cosine' },
    });
    console.log(`[qdrant] Created collection: ${COLLECTION_NAME} (dims: ${vectorSize})`);
  } else {
    console.log(`[qdrant] Collection exists: ${COLLECTION_NAME}`);
  }
}

async function deleteCollection() {
  const qdrant = getQdrantClient();
  try {
    await qdrant.deleteCollection(COLLECTION_NAME);
    console.log(`[qdrant] Deleted collection: ${COLLECTION_NAME}`);
  } catch {
    // collection didn't exist, fine
  }
}

async function upsertChunks(chunks) {
  const qdrant = getQdrantClient();
  const points = chunks.map((chunk) => ({
    id: chunk.id,
    vector: chunk.vector,
    payload: { text: chunk.text, section: chunk.section },
  }));

  await qdrant.upsert(COLLECTION_NAME, { points });
  console.log(`[qdrant] Upserted ${points.length} chunks`);
}

async function searchSimilar(vector, topK = 5) {
  const qdrant = getQdrantClient();
  const results = await qdrant.search(COLLECTION_NAME, {
    vector,
    limit: topK,
    with_payload: true,
  });

  return results.map((r) => ({
    text: r.payload.text,
    section: r.payload.section,
    score: r.score,
  }));
}

export { ensureCollection, deleteCollection, upsertChunks, searchSimilar };
