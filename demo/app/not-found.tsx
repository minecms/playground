import Link from 'next/link';
import { MotionButton } from '@/components/motion/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Страница не найдена
      </h1>
      <p className="max-w-prose text-base text-muted-foreground">
        Адрес не соответствует ни одной опубликованной странице. Возможно она ещё не создана
        в Studio или slug изменился.
      </p>
      <MotionButton asChild size="sm">
        <Link href="/">На главную</Link>
      </MotionButton>
    </div>
  );
}
