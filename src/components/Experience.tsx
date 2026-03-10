const experiences = [
    {
        title: "Software Engineering Intern",
        subtitle: "U.S. Indo-Pacific Command (USINDOPACOM), J667",
        note: "Secret Clearance",
        location: "Honolulu, HI",
        date: "Feb 2026 – Present",
        active: true,
        tags: ["SharePoint", "Power Platform", "Data Modeling"],
        description: "Building internal tooling for a defense organization under active Secret Clearance.",
        bullets: [
            "Built mockups, data workflows, and schema for an internal Gift Inventory Application using SharePoint and Power Platform alongside stakeholder communication.",
        ],
    },
    {
        title: "Open Source Collaborator",
        subtitle: "nimblebrain.ai",
        location: "Remote",
        date: "Jan 2026 – Present",
        active: true,
        tags: ["Python", "MCP", "LLM Agents", "Alpha Vantage API"],
        description: "Building open-source financial tooling powered by LLM-agent workflows.",
        bullets: [
            "Building an MCP server in Python powering intent-based financial data tools via the Alpha Vantage API.",
            "Designing query-to-tool-call abstractions; implementing routing, validation, and error handling for LLM-agent workflows.",
        ],
    },
    {
        title: "Undergraduate Research Assistant",
        subtitle: "University of Hawaiʻi at Mānoa",
        location: "Honolulu, HI",
        date: "Mar 2025 – Present",
        active: true,
        tags: ["C++", "Python", "CUDA", "SQL", "cuVS", "Faiss"],
        description: "Contributing to two research tracks under faculty guidance — GPU-accelerated LLM inference and natural language database querying.",
        subprojects: [
            {
                name: "GPU-Accelerated LLM Inference",
                tech: "Python, C++, CUDA, cuVS, Faiss",
                bullets: [
                    "Collaborating with Carnegie Mellon University on GPU-accelerated KV cache systems for LLM inference.",
                    "Migrating CPU-based Faiss to GPU-accelerated cuVS to reduce nearest-neighbor search bottlenecks via CUDA.",
                    "Validated ANN-based KV cache retrieval achieving 92.3% F1 vs full attention.",
                ],
            },
            {
                name: "SQLPlus",
                tech: "C++, Python, SQL",
                bullets: [
                    "Building a custom PostgreSQL extension adding SQL operators for natural language condition matching.",
                    "Prototyped BM25, pre-filtering, embeddings, and LLM calls to reduce runtime and API calls.",
                    "Achieved 98.4% accuracy across 1,000 queries with total runtime 92.45s.",
                ],
            },
        ],
    },
];

import SectionHeading from '@components/ui/SectionHeading';

export default function Experience() {
    return (
        <section
            id="experience"
            className="px-8 sm:px-12 md:px-14 lg:px-16 pt-20 pb-32 scroll-mt-28"
        >
            <div className="max-w-2xl">
                <SectionHeading title="Experience" />

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-px"
                        style={{ background: 'linear-gradient(to bottom, var(--accent-indigo), var(--accent), transparent)' }}
                    />

                    <div className="space-y-10 pl-8">
                        {experiences.map((exp, i) => (
                            <div key={i} className="relative">
                                {/* Timeline dot */}
                                <div className="absolute -left-8 top-1 -translate-x-1/2">
                                    {exp.active ? (
                                        <>
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    background: 'var(--accent)',
                                                    boxShadow: '0 0 0 3px rgba(34, 211, 238, 0.15), 0 0 10px rgba(34, 211, 238, 0.3)'
                                                }}
                                            />
                                            <div
                                                className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                                                style={{ background: 'var(--accent)', opacity: 0.25 }}
                                            />
                                        </>
                                    ) : (
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ background: 'var(--text-muted)', border: '2px solid var(--bg-base)' }}
                                        />
                                    )}
                                </div>

                                {/* Date pill */}
                                <div className="mb-3">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            background: 'rgba(34, 211, 238, 0.07)',
                                            border: '1px solid rgba(34, 211, 238, 0.18)',
                                            color: 'var(--accent)'
                                        }}
                                    >
                                        {exp.active && (
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                                style={{ boxShadow: '0 0 4px rgba(52, 211, 153, 0.6)' }}
                                            />
                                        )}
                                        {exp.date}
                                    </span>
                                </div>

                                {/* Card */}
                                <div
                                    className="rounded-xl p-5 transition-all duration-300"
                                    style={{
                                        background: 'rgba(255,255,255,0.025)',
                                        border: '1px solid var(--border)',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(34, 211, 238, 0.03)';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                                        (e.currentTarget as HTMLElement).style.transform = 'none';
                                    }}
                                >
                                    {/* Header */}
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                        <h3
                                            className="text-base font-semibold"
                                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                                        >
                                            {exp.title}
                                        </h3>
                                        {exp.note && (
                                            <span
                                                className="px-2 py-0.5 rounded text-xs"
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    background: 'rgba(251, 191, 36, 0.08)',
                                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                                    color: '#fbbf24'
                                                }}
                                            >
                                                {exp.note}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className="text-sm mb-1"
                                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.75 }}
                                    >
                                        {exp.subtitle}
                                    </p>
                                    <p
                                        className="text-xs mb-4"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {exp.location}
                                    </p>

                                    {/* Sub-projects (research assistant style) */}
                                    {exp.subprojects ? (
                                        <div className="space-y-4">
                                            {exp.subprojects.map((sub, si) => (
                                                <div key={si}>
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span
                                                            className="text-xs font-medium"
                                                            style={{ color: 'var(--text-primary)' }}
                                                        >
                                                            {sub.name}
                                                        </span>
                                                        <span
                                                            className="text-xs"
                                                            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                                                        >
                                                            — {sub.tech}
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-1.5">
                                                        {sub.bullets.map((b, bi) => (
                                                            <li key={bi} className="flex items-start gap-2">
                                                                <span
                                                                    className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                                                                    style={{ background: 'var(--accent)', opacity: 0.6 }}
                                                                />
                                                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                                    {b}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className="space-y-1.5 mb-4">
                                            {exp.bullets.map((b, bi) => (
                                                <li key={bi} className="flex items-start gap-2">
                                                    <span
                                                        className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                                                        style={{ background: 'var(--accent)', opacity: 0.6 }}
                                                    />
                                                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                                        {b}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                                        {exp.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-0.5 rounded-full text-xs"
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    background: 'rgba(99, 102, 241, 0.08)',
                                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                                    color: '#a5b4fc'
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
