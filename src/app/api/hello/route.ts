export const runtime = 'edge'

export async function GET() {
  try {
    return new Response(
      JSON.stringify({ message: 'Hello Coop!' }),
      {
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (e: unknown) {
    console.error('API Error:', e);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { 
        status: 500,
        headers: {
          'content-type': 'application/json',
        }
      }
    )
  }
}
