export interface Experience {
    title: string;
    org: string;
    note?: string;
    location: string;
    date: string;
    tags: string[];
    bullets: string[];
    githubUrl?: string;
}

export const experiences: Experience[] = [
    {
        title: "Research Assistant",
        org: "iDB Lab, University of Hawaiʻi at Mānoa",
        location: "Remote",
        date: "Mar 2025 – Present",
        tags: ["Python", "PostgreSQL", "LLM inference", "Embeddings", "BM25"],
        bullets: [
            "Investigating semantic KV cache reuse: ran attention-vs-embedding experiments across a Qwen3-8B model to test whether attention-pattern similarity detects reusable cached queries better than sentence embeddings, and identified RoPE as a primary cause of key spreading in the retrieval index through targeted ablation experiments.",
            "Benchmarked semantic-join frameworks (LOTUS, Palimpzest, Nirvana) on entity-matching workloads, isolating where LLM-call time dominates runtime and where each framework's optimizations break down.",
            "Prototyped SQLPlus, a filter cascade of keyword matching, embeddings, cached BM25, and an LLM fallback that cut LLM calls for semantic SQL predicates, reducing end-to-end runtime ~6× at under 2 points of accuracy loss.",
        ],
    },
    {
        title: "Software Engineer Intern",
        org: "U.S. Indo-Pacific Command",
        note: "Secret Clearance",
        location: "Oʻahu, HI",
        date: "Feb 2026 – May 2026",
        tags: ["Power Automate", "SharePoint", "Data Modeling"],
        bullets: [
            "Scoped an internal Gift Inventory application with stakeholders, then designed the page mockups, data workflows, and schema behind it.",
            "Built a Power Automate pipeline exporting SharePoint list and site data to formatted PDF reports, cutting export runtime 5.86× by parallelizing item fetches with index-tagged ordering to preserve output order.",
            "Wrote user and developer guides documenting the system for handoff.",
        ],
    },
    {
        title: "Open Source Collaborator",
        org: "nimblebrain.ai",
        location: "Remote",
        date: "Jan 2026 – Apr 2026",
        githubUrl: "https://github.com/justnsmith/mcp-alpha-vantage",
        tags: ["Python", "MCP", "asyncio", "Pydantic", "Alpha Vantage API"],
        bullets: [
            "Built an MCP server in Python giving LLM clients typed access to live market data: 12 tools over the Alpha Vantage API returning validated JSON, so the model calls for a price instead of generating one.",
            "Wrote composed analytics tools that fetch multiple symbols concurrently to derive market breadth, stock screening, and portfolio P&L the upstream API doesn't return.",
            "Cut API usage under a 25-request/day quota with per-endpoint TTL caching, benchmarked at a 93.3% hit rate on a realistic agent workload.",
        ],
    },
];

export interface NowItem {
    label: string;
    body: string;
    meta: string;
}

export const nowItems: NowItem[] = [
    {
        label: "Georgia Tech",
        body: "Starting an M.S. in Computer Science, specializing in Computing Systems.",
        meta: "Incoming graduate student · begins Jan 2027",
    },
    {
        label: "Research Assistant",
        body: "Researching KV cache retrieval for LLM inference, and what actually makes a cached query reusable.",
        meta: "iDB Lab, UH Mānoa · since Mar 2025",
    },
];

export interface Degree {
    school: string;
    degree: string;
    date: string;
    honors?: string;
    /** Coursework line. Omitted for a program that hasn't started. */
    detail?: string;
}

export const education: Degree[] = [
    {
        school: "Georgia Institute of Technology",
        degree: "M.S. Computer Science, Computing Systems",
        date: "Jan 2027 – Dec 2028 (expected)",
        honors: "Incoming",
    },
    {
        school: "University of Hawaiʻi at Mānoa",
        degree: "B.S. Computer Science",
        date: "Aug 2022 – May 2026",
        honors: "Magna Cum Laude · 3.85 GPA",
        detail: "Operating Systems, Databases, Computer Networks, Programming Language Theory, Data Structures & Algorithms.",
    },
];
