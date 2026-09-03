/**
 * Pure helpers for the Markdown renderer in `components/ui/Markdown.tsx`.
 *
 * These live apart from the component so the module stays
 * component-only, because mixing the two breaks React Fast Refresh.
 */

/** Heading text → anchor id. Must match what the renderer emits. */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

/** A heading pulled out for a writeup's contents list. */
export interface Heading {
    id: string;
    text: string;
    depth: number;
}

/** Collect `##` and `###` headings, skipping anything inside a code fence. */
export function headings(source: string): Heading[] {
    const out: Heading[] = [];
    let inFence = false;

    for (const line of source.split("\n")) {
        if (/^```/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;

        const match = line.match(/^(#{2,3})\s+(.*)$/);
        if (match) out.push({ id: slugify(match[2]), text: match[2], depth: match[1].length });
    }
    return out;
}
