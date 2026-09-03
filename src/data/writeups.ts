/**
 * Writeups.
 *
 * Two kinds live here:
 *
 *   1. Ones I wrote for this site. Drop a Markdown file in
 *      `src/content/writeups/` with the frontmatter block described in the
 *      README there; the filename becomes the URL and the entry appears
 *      automatically. Nothing else to register.
 *
 *   2. Ones published elsewhere. Add an entry to `elsewhere` below with a
 *      `url`. It is listed alongside the rest and links straight out.
 */

export interface Writeup {
    slug: string;
    title: string;
    /** Display date, e.g. "June 2026". Omitted when the date isn't known. */
    date?: string;
    /** Sort key, `YYYY-MM`, newest first. */
    sort: string;
    summary: string;
    tags: string[];
    /** Ties the writeup to an entry in `projects.ts`. */
    projectId?: string;
    repo?: string;
    /** Set on pieces published somewhere else. */
    url?: string;
    /** Where an offsite piece was published, e.g. "MITRE Caldera · Medium". */
    source?: string;
    /** Markdown body, present only on writeups hosted here. */
    body?: string;
    /** Estimated reading time in minutes. */
    minutes: number;
}

interface Frontmatter {
    meta: Record<string, string>;
    body: string;
}

function splitFrontmatter(raw: string): Frontmatter {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) return { meta: {}, body: raw };

    const meta: Record<string, string> = {};
    for (const line of match[1].split("\n")) {
        const colon = line.indexOf(":");
        if (colon === -1) continue;
        meta[line.slice(0, colon).trim()] = line
            .slice(colon + 1)
            .trim()
            .replace(/^["']|["']$/g, "");
    }
    return { meta, body: raw.slice(match[0].length) };
}

function readingMinutes(body: string): number {
    const words = body.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
}

const files = import.meta.glob("../content/writeups/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

/** `README.md` is the authoring guide, and a leading `_` marks a draft. */
const isPublished = (name: string) =>
    !name.startsWith("_") && name.toLowerCase() !== "readme";

const hosted: Writeup[] = Object.entries(files)
    .map(([path, raw]) => [path.split("/").pop()!.replace(/\.md$/, ""), raw] as const)
    .filter(([slug]) => isPublished(slug))
    .map(([slug, raw]) => {
        const { meta, body } = splitFrontmatter(raw);

        return {
            slug,
            title: meta.title ?? slug,
            date: meta.date,
            sort: meta.sort ?? "0000-00",
            summary: meta.summary ?? "",
            tags: meta.tags ? meta.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            projectId: meta.project || undefined,
            repo: meta.repo || undefined,
            body: body.trim(),
            minutes: readingMinutes(body),
        };
    });

const elsewhere: Writeup[] = [
    {
        slug: "grid-watch-dnp3-sandbox",
        // Verbatim from Medium, em dash included: a published title is quoted,
        // not restyled to house rules.
        title: "Caldera for OT — Grid Watch: A Virtual DNP3 Electrical Grid Sandbox",
        date: "June 2026",
        sort: "2026-06",
        summary:
            "The MITRE Caldera team's writeup of Grid Watch, the software-only DNP3 outstation my capstone team built as an adversary-emulation target: the simulated grid segment, the HMI, and four Caldera for OT attack scenarios run against it.",
        tags: ["DNP3", "MITRE Caldera for OT", "ICS security", "Python"],
        projectId: "grid-watch",
        repo: "https://github.com/mitre/grid-watch",
        url: "https://medium.com/@mitrecaldera/caldera-for-ot-grid-watch-a-virtual-dnp3-electrical-grid-sandbox-761e8c83ab77",
        source: "MITRE Caldera · Medium",
        minutes: 7,
    },
];

export const writeups: Writeup[] = [...hosted, ...elsewhere].sort((a, b) =>
    b.sort.localeCompare(a.sort),
);

export const getWriteupBySlug = (slug: string) => writeups.find(w => w.slug === slug);

export const getWriteupForProject = (projectId: string) =>
    writeups.find(w => w.projectId === projectId);

/** Where a writeup lives: an offsite URL, or a route on this site. */
export const writeupHref = (w: Writeup) => w.url ?? `/writeups/${w.slug}`;
