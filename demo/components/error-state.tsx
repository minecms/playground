import { MotionButton } from '@/components/motion/button';
import { AlertCircle, Info, TriangleAlert } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { FriendlyError } from '@/lib/errors';

export interface ErrorStateProps {
  variant?: 'info' | 'warn' | 'error';
  error: FriendlyError;
}

const ICONS = {
  info: Info,
  warn: TriangleAlert,
  error: AlertCircle,
} as const;

export function ErrorState({ variant = 'error', error }: ErrorStateProps) {
  const Icon = ICONS[variant];
  const alertVariant: 'default' | 'destructive' = variant === 'error' ? 'destructive' : 'default';

  return (
    <Alert variant={alertVariant}>
      <Icon />
      <AlertTitle>{error.title}</AlertTitle>
      <AlertDescription>
        <p>{error.description}</p>
        {error.hint ? (
          <MotionButton asChild size="sm" className="mt-3">
            <a href={error.hint} target="_blank" rel="noreferrer">
              Открыть Studio →
            </a>
          </MotionButton>
        ) : null}
        <details className="mt-4 w-full text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none">Технические подробности</summary>
          <pre className="mt-2 w-full overflow-x-auto rounded-md border border-border bg-muted/30 p-2 font-mono text-[11px] text-foreground/80">
            {error.technical}
          </pre>
        </details>
      </AlertDescription>
    </Alert>
  );
}
