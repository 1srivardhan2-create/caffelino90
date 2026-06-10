// Minimal stub - app uses localStorage exclusively
// This file exists only to prevent deployment errors

Deno.serve(() => {
  return new Response(
    JSON.stringify({ 
      status: 'disabled',
      message: 'This API is disabled. The app uses localStorage for all data operations.'
    }), 
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
});
