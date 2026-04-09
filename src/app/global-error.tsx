'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-ink flex items-center justify-center min-h-screen p-6">
        <div className="bg-ink-3 border-l-4 border-error p-8 max-w-2xl w-full shadow-lg">
          <h2 className="font-display text-3xl text-text-primary mb-4">Frontend Error Caught!</h2>
          <p className="text-sm text-text-secondary mb-4">
            The website successfully loaded, but a component crashed in the browser.
          </p>
          <div className="bg-ink-4 p-4 text-error font-mono text-xs rounded mb-6 overflow-auto">
            {error.message || 'Unknown fatal error occurred.'}
          </div>
          <button
            onClick={() => reset()}
            className="px-5 py-3 bg-gold text-ink text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-colors"
          >
            Try to Recover
          </button>
        </div>
      </body>
    </html>
  );
}
