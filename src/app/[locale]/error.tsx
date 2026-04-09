'use client';

export default function LocaleError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div style={{ backgroundColor: 'white', color: 'red', padding: '50px', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' }}>🚨 React Crashed in the Browser!</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Error Message:</strong></p>
      <code style={{ display: 'block', backgroundColor: '#ffe6e6', padding: '15px', borderRadius: '5px', fontSize: '16px' }}>
        {error.message || "Unknown error"}
      </code>
    </div>
  );
}
