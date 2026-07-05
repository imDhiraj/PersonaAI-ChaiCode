export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  return new Response(
    JSON.stringify({ useProxy: hasApiKey }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
