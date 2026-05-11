'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/error-state';
import { toFriendlyError } from '@/lib/errors';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('[demo] route error:', error);
  }, [error]);

  return (
    <div className="py-8">
      <ErrorState
        variant="error"
        error={{
          ...toFriendlyError(error),
          technical: `${error.message}${error.digest ? ` · digest=${error.digest}` : ''}`,
        }}
      />
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent">
        Повторить попытку
      </button>
    </div>
  );
}
