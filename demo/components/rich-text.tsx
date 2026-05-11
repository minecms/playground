import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Безопасный whitelist-рендер ProseMirror JSON в React-узлы (без dangerouslySetInnerHTML).
// За типографику отвечает @tailwindcss/typography (`prose` на враппере),
// а здесь — только корректные семантические теги и санитарный фильтр узлов/marks.
type RichTextNode = {
  type?: unknown;
  text?: unknown;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  marks?: Array<{ type?: unknown; attrs?: Record<string, unknown> }>;
};

export interface RichTextProps {
  value: unknown;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  if (!isDoc(value)) return null;
  const content = Array.isArray(value.content) ? value.content : [];
  if (content.length === 0) return null;

  return (
    <div className={cn('prose prose-zinc dark:prose-invert max-w-none', className)}>
      {content.map((node, index) => renderNode(node, `root.${index}`))}
    </div>
  );
}

function isDoc(value: unknown): value is { type: 'doc'; content?: RichTextNode[] } {
  return Boolean(value) && typeof value === 'object' && (value as { type?: unknown }).type === 'doc';
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  if (typeof node.type !== 'string') return null;

  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{renderInline(node.content, `${key}.p`)}</p>;
    case 'heading':
      return renderHeading(readHeadingLevel(node.attrs?.level), key, node);
    case 'bulletList':
      return <ul key={key}>{(node.content ?? []).map((c, i) => renderNode(c, `${key}.${i}`))}</ul>;
    case 'orderedList': {
      const start = typeof node.attrs?.start === 'number' ? node.attrs.start : undefined;
      return (
        <ol key={key} start={start}>
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}.${i}`))}
        </ol>
      );
    }
    case 'listItem':
      return <li key={key}>{(node.content ?? []).map((c, i) => renderNode(c, `${key}.${i}`))}</li>;
    case 'blockquote':
      return (
        <blockquote key={key}>
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}.${i}`))}
        </blockquote>
      );
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{collectPlainText(node)}</code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} />;
    case 'hardBreak':
      return <br key={key} />;
    default:
      return null;
  }
}

function renderHeading(level: 1 | 2 | 3 | 4 | 5 | 6, key: string, node: RichTextNode): ReactNode {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag key={key}>{renderInline(node.content, `${key}.h`)}</Tag>;
}

function readHeadingLevel(raw: unknown): 1 | 2 | 3 | 4 | 5 | 6 {
  const n = typeof raw === 'number' ? raw : 2;
  if (n >= 1 && n <= 6) return n as 1 | 2 | 3 | 4 | 5 | 6;
  return 2;
}

function renderInline(nodes: RichTextNode[] | undefined, key: string): ReactNode {
  if (!Array.isArray(nodes)) return null;
  return nodes.map((node, i) => {
    const itemKey = `${key}.${i}`;
    if (node.type === 'text') {
      return wrapWithMarks(typeof node.text === 'string' ? node.text : '', node.marks, itemKey);
    }
    if (node.type === 'hardBreak') return <br key={itemKey} />;
    return null;
  });
}

function wrapWithMarks(text: string, marks: RichTextNode['marks'], key: string): ReactNode {
  if (!Array.isArray(marks) || marks.length === 0) return <span key={key}>{text}</span>;

  let node: ReactNode = text;
  for (const mark of marks) {
    if (typeof mark.type !== 'string') continue;
    switch (mark.type) {
      case 'bold':
        node = <strong>{node}</strong>;
        break;
      case 'italic':
        node = <em>{node}</em>;
        break;
      case 'strike':
        node = <s>{node}</s>;
        break;
      case 'code':
        node = <code>{node}</code>;
        break;
      case 'link': {
        const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : null;
        if (href && isSafeHref(href)) {
          const target = mark.attrs?.target === '_blank' ? '_blank' : undefined;
          node = (
            <a
              href={href}
              {...(target ? { target, rel: 'noreferrer noopener' } : {})}>
              {node}
            </a>
          );
        }
        break;
      }
      default:
        break;
    }
  }
  return <span key={key}>{node}</span>;
}

function isSafeHref(href: string): boolean {
  const trimmed = href.trim().toLowerCase();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  );
}

function collectPlainText(node: RichTextNode): string {
  const out: string[] = [];
  const visit = (n: RichTextNode | undefined): void => {
    if (!n) return;
    if (typeof n.text === 'string') out.push(n.text);
    if (Array.isArray(n.content)) for (const c of n.content) visit(c);
  };
  visit(node);
  return out.join('');
}
