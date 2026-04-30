import { Fragment } from "react";

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) parts.push(<code key={key++} className="px-1 py-0.5 rounded bg-muted text-[0.85em]">{tok.slice(1, -1)}</code>);
    else parts.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderTable(lines: string[], keyBase: number) {
  const rows = lines.map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  const header = rows[0];
  const body = rows.slice(2);
  return (
    <div key={keyBase} className="my-3 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-primary/10">
            {header.map((h, i) => (
              <th key={i} className="text-left p-2 border border-border font-semibold">{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className="even:bg-muted/40">
              {r.map((c, ci) => <td key={ci} className="p-2 border border-border">{renderInline(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    if (line.startsWith("# ")) { out.push(<h1 key={key++} className="text-2xl font-extrabold text-primary mt-2 mb-3">{renderInline(line.slice(2))}</h1>); i++; continue; }
    if (line.startsWith("## ")) { out.push(<h2 key={key++} className="text-lg font-bold mt-4 mb-2">{renderInline(line.slice(3))}</h2>); i++; continue; }
    if (line.startsWith("### ")) { out.push(<h3 key={key++} className="text-base font-bold mt-3 mb-1">{renderInline(line.slice(4))}</h3>); i++; continue; }

    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) { buf.push(lines[i].slice(2)); i++; }
      out.push(<blockquote key={key++} className="border-l-4 border-secondary pl-3 my-3 italic text-foreground/80">{renderInline(buf.join(" "))}</blockquote>);
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].includes("|")) { buf.push(lines[i]); i++; }
      out.push(renderTable(buf, key++));
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(
        <ul key={key++} className="list-disc pl-6 space-y-1 my-2">
          {items.map((it, idx) => <li key={idx}>{renderInline(it)}</li>)}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      out.push(
        <ol key={key++} className="list-decimal pl-6 space-y-1 my-2">
          {items.map((it, idx) => <li key={idx}>{renderInline(it)}</li>)}
        </ol>
      );
      continue;
    }

    const buf: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#|>|[-*]\s|\d+\.\s)/.test(lines[i]) && !lines[i].includes("|")) {
      buf.push(lines[i]); i++;
    }
    out.push(<p key={key++} className="my-2 leading-relaxed">{renderInline(buf.join(" "))}</p>);
  }

  return <div className="prose-sm max-w-none">{out.map((n, idx) => <Fragment key={idx}>{n}</Fragment>)}</div>;
}
