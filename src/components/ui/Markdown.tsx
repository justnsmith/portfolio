import type { ReactNode } from "react";
import { slugify } from "@lib/markdown";

/**
 * A small Markdown renderer: enough for the writeups, no dependency.
 *
 * Supported: ATX headings (`#`–`####`), paragraphs, `-`/`*` and `1.` lists,
 * fenced code blocks, blockquotes, thematic breaks, pipe tables, and the
 * inline forms `**bold**`, `*italic*`, `` `code` `` and `[text](href)`.
 *
 * Deliberately not supported: nested lists, HTML passthrough, reference
 * links, footnotes. Everything renders as plain React nodes, so there is no
 * `dangerouslySetInnerHTML` anywhere and no HTML sanitising to get wrong.
 */

const INLINE_PATTERN =
    "(`[^`]+`)|(\\*\\*[^*]+\\*\\*)|(\\*[^*\\n]+\\*)|(\\[[^\\]]*\\]\\([^)\\s]+\\))";

/** Render the inline spans of one line of text. */
function inline(text: string, keyBase: string): ReactNode[] {
    // Built per call: the matcher is stateful, and link labels recurse.
    const re = new RegExp(INLINE_PATTERN, "g");
    const out: ReactNode[] = [];
    let last = 0;
    let n = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(text)) !== null) {
        if (m.index > last) out.push(text.slice(last, m.index));
        const token = m[0];
        const key = `${keyBase}i${n++}`;

        if (token.startsWith("`")) {
            out.push(
                <code className="code-in" key={key}>
                    {token.slice(1, -1)}
                </code>,
            );
        } else if (token.startsWith("**")) {
            out.push(<strong key={key}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith("*")) {
            out.push(<em key={key}>{token.slice(1, -1)}</em>);
        } else {
            const split = token.indexOf("](");
            const label = token.slice(1, split);
            const href = token.slice(split + 2, -1);
            const external = /^https?:/i.test(href);
            out.push(
                <a
                    className="lnk"
                    key={key}
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                    {inline(label, key)}
                </a>,
            );
        }

        last = m.index + token.length;
    }

    if (last < text.length) out.push(text.slice(last));
    return out;
}

const UL = /^[-*+]\s+/;
const OL = /^\d+[.)]\s+/;
const HR = /^(-{3,}|\*{3,}|_{3,})\s*$/;

/** Does this line open a block, and so end an open paragraph? */
function opensBlock(line: string): boolean {
    return /^(#{1,4}\s|```|>|\||[-*+]\s|\d+[.)]\s)/.test(line) || HR.test(line);
}

function cells(line: string): string[] {
    return line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map(c => c.trim());
}

function parse(source: string): ReactNode[] {
    const lines = source.replace(/\r\n/g, "\n").split("\n");
    const out: ReactNode[] = [];
    let i = 0;
    const key = () => `b${out.length}`;

    while (i < lines.length) {
        const line = lines[i];

        if (!line.trim()) {
            i++;
            continue;
        }

        const fence = line.match(/^```\s*(\S*)/);
        if (fence) {
            const buf: string[] = [];
            i++;
            while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
            i++; // closing fence
            out.push(
                <pre className="code-block" key={key()} data-lang={fence[1] || undefined}>
                    <code>{buf.join("\n")}</code>
                </pre>,
            );
            continue;
        }

        const heading = line.match(/^(#{1,4})\s+(.*)$/);
        if (heading) {
            const depth = heading[1].length;
            const text = heading[2];
            const Tag = depth <= 2 ? "h2" : depth === 3 ? "h3" : "h4";
            out.push(
                <Tag className={depth <= 2 ? "t-h2" : "t-h3"} key={key()} id={slugify(text)}>
                    {inline(text, key())}
                </Tag>,
            );
            i++;
            continue;
        }

        if (HR.test(line)) {
            out.push(<hr className="rule" key={key()} />);
            i++;
            continue;
        }

        if (/^>\s?/.test(line)) {
            const buf: string[] = [];
            while (i < lines.length && /^>/.test(lines[i])) {
                buf.push(lines[i++].replace(/^>\s?/, ""));
            }
            out.push(
                <blockquote className="pull" key={key()}>
                    {inline(buf.join(" ").trim(), key())}
                </blockquote>,
            );
            continue;
        }

        // Pipe table, only when the next line is the header separator.
        if (
            line.trim().startsWith("|") &&
            i + 1 < lines.length &&
            /^\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1].trim())
        ) {
            const head = cells(line);
            i += 2;
            const rows: string[][] = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
            out.push(
                <div className="tbl-scroll" key={key()}>
                    <table className="tbl">
                        <thead>
                            <tr>
                                {head.map((c, n) => (
                                    <th key={n}>{inline(c, `th${n}`)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, r) => (
                                <tr key={r}>
                                    {row.map((c, n) => (
                                        <td key={n}>{inline(c, `td${r}-${n}`)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>,
            );
            continue;
        }

        if (UL.test(line) || OL.test(line)) {
            const ordered = OL.test(line);
            const marker = ordered ? OL : UL;
            const items: string[] = [];

            while (i < lines.length && marker.test(lines[i])) {
                let item = lines[i++].replace(marker, "");
                // Soft-wrapped continuation lines are indented under the item.
                while (i < lines.length && /^\s{2,}\S/.test(lines[i])) {
                    item += ` ${lines[i++].trim()}`;
                }
                items.push(item);
            }

            out.push(
                ordered ? (
                    <ol className="num-list" key={key()}>
                        {items.map((t, n) => (
                            <li key={n}>{inline(t, `li${n}`)}</li>
                        ))}
                    </ol>
                ) : (
                    <ul className="bullets" key={key()}>
                        {items.map((t, n) => (
                            <li key={n}>{inline(t, `li${n}`)}</li>
                        ))}
                    </ul>
                ),
            );
            continue;
        }

        const buf: string[] = [];
        while (i < lines.length && lines[i].trim() && !opensBlock(lines[i])) {
            buf.push(lines[i++].trim());
        }
        out.push(<p key={key()}>{inline(buf.join(" "), key())}</p>);
    }

    return out;
}

export default function Markdown({ source }: { source: string }) {
    return <div className="prose">{parse(source)}</div>;
}
