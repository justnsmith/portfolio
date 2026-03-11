import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@components/layout/PageLayout';
import { projects } from '@data/projects';

type Filter = 'all' | 'Personal' | 'College';

const FILTERS: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Personal', value: 'Personal' },
    { label: 'College', value: 'College' },
];

const uniqueTechCount = [...new Set(projects.flatMap(p => p.tech))].length;
const uniqueYears = [...new Set(projects.map(p => p.year))].length;

export default function ProjectsArchive() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<Filter>('all');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    const filtered = filter === 'all' ? projects : projects.filter(p => p.madeFor === filter);

    const byYear = filtered.reduce((acc, p) => {
        if (!acc[p.year]) acc[p.year] = [];
        acc[p.year].push(p);
        return acc;
    }, {} as Record<number, typeof projects>);
    const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

    const handleOpen = (project: typeof projects[number]) => {
        if (project.githubUrl) window.open(project.githubUrl, '_blank');
        else if (project.url) {
            if (project.url.startsWith('http')) window.open(project.url, '_blank');
            else navigate(project.url);
        } else if (project.internalUrl) {
            navigate(project.internalUrl);
        }
    };

    let globalIdx = 0;

    return (
        <PageLayout maxWidth="max-w-5xl">
            {/* ── Page header ─────────────────────────────── */}
            <div className="mb-12">
                <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--accent)',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    opacity: 0.65,
                    marginBottom: '0.75rem'
                }}>
                    Archive
                </p>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}>
                        All Projects
                    </h1>

                    {/* Stats row */}
                    <div className="flex items-center gap-5 pb-1" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                    }}>
                        <StatItem value={projects.length} label="projects" />
                        <Dot />
                        <StatItem value={uniqueYears} label="years" />
                        <Dot />
                        <StatItem value={uniqueTechCount} label="technologies" />
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--border)', marginTop: '1.5rem' }} />
            </div>

            {/* ── Filter tabs ──────────────────────────────── */}
            <div className="flex items-center gap-1 mb-10">
                {FILTERS.map(f => {
                    const active = filter === f.value;
                    const count = f.value === 'all'
                        ? projects.length
                        : projects.filter(p => p.madeFor === f.value).length;
                    return (
                        <button
                            key={f.value}
                            onClick={() => { setFilter(f.value); setExpanded(null); }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.72rem',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                background: active ? 'rgba(34, 211, 238, 0.09)' : 'transparent',
                                color: active ? 'var(--accent)' : 'var(--text-muted)',
                                border: '1px solid',
                                borderColor: active ? 'rgba(34, 211, 238, 0.22)' : 'transparent',
                            }}
                        >
                            {f.label}
                            <span style={{
                                fontSize: '0.62rem',
                                opacity: 0.65,
                                color: active ? 'var(--accent)' : 'var(--text-muted)'
                            }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Table header (desktop) ───────────────────── */}
            <div className="hidden md:grid mb-1 px-4" style={{
                gridTemplateColumns: '1fr 1fr 2rem',
                gap: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                opacity: 0.5,
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border)',
            }}>
                <div>Project</div>
                <div>Stack</div>
                <div />
            </div>

            {/* ── Year groups ──────────────────────────────── */}
            <div className="space-y-10 mt-4">
                {years.map(year => (
                    <div key={year}>
                        {/* Year label */}
                        <div className="flex items-center gap-3 mb-3">
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                opacity: 0.55,
                            }}>
                                {year}
                            </span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.62rem',
                                color: 'var(--text-muted)',
                                opacity: 0.4,
                            }}>
                                {byYear[year].length}
                            </span>
                        </div>

                        {/* Rows */}
                        <div>
                            {byYear[year].map(project => {
                                globalIdx++;
                                const idx = globalIdx;
                                const isExpanded = expanded === project.id;
                                return (
                                    <ProjectRow
                                        key={project.id}
                                        project={project}
                                        isExpanded={isExpanded}
                                        mounted={mounted}
                                        delay={idx * 35}
                                        onToggle={() => setExpanded(isExpanded ? null : project.id)}
                                        onOpen={() => handleOpen(project)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-24" style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                }}>
                    No projects found.
                </div>
            )}
        </PageLayout>
    );
}

/* ── Sub-components ─────────────────────────────── */

function StatItem({ value, label }: { value: number; label: string }) {
    return (
        <span>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{value}</span>
            {' '}{label}
        </span>
    );
}

function Dot() {
    return <span style={{ opacity: 0.3 }}>·</span>;
}

interface RowProps {
    project: typeof projects[number];
    isExpanded: boolean;
    mounted: boolean;
    delay: number;
    onToggle: () => void;
    onOpen: () => void;
}

function ProjectRow({ project, isExpanded, mounted, delay, onToggle, onOpen }: RowProps) {
    const [hovered, setHovered] = useState(false);
    const hasLink = !!(project.githubUrl || project.url || project.internalUrl);

    return (
        <div
            style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
            }}
        >
            {/* Main row */}
            <div
                className="relative cursor-pointer"
                style={{
                    borderBottom: '1px solid var(--border)',
                    background: hovered || isExpanded ? 'rgba(34, 211, 238, 0.025)' : 'transparent',
                    transition: 'background 0.15s ease',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={onToggle}
            >
                {/* Left accent bar */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'var(--accent)',
                    opacity: hovered || isExpanded ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                    borderRadius: '0 1px 1px 0',
                }} />

                {/* Desktop layout */}
                <div className="hidden md:grid items-center px-4 py-3.5" style={{
                    gridTemplateColumns: '1fr 1fr 2rem',
                    gap: '1rem',
                }}>
                    {/* Title + context */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.875rem',
                            fontWeight: hovered || isExpanded ? 500 : 400,
                            color: hovered || isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)',
                            transition: 'color 0.15s ease, font-weight 0.15s ease',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {project.title}
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            color: 'var(--text-muted)',
                            opacity: 0.5,
                            flexShrink: 0,
                        }}>
                            {project.madeFor}
                        </span>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1 min-w-0">
                        {project.tech.slice(0, 4).map((t, i) => (
                            <span key={i} style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '3px',
                                background: hovered ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.03)',
                                border: '1px solid',
                                borderColor: hovered ? 'rgba(99,102,241,0.18)' : 'var(--border)',
                                color: hovered ? '#a5b4fc' : 'var(--text-muted)',
                                transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                                whiteSpace: 'nowrap',
                            }}>
                                {t}
                            </span>
                        ))}
                        {project.tech.length > 4 && (
                            <span style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--text-muted)',
                                opacity: 0.5,
                                alignSelf: 'center',
                            }}>
                                +{project.tech.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Link / expand icon */}
                    <div className="flex items-center justify-end gap-2">
                        {hasLink && (
                            <button
                                title="Open project"
                                onClick={e => { e.stopPropagation(); onOpen(); }}
                                style={{
                                    color: hovered ? 'var(--accent)' : 'var(--text-muted)',
                                    opacity: hovered ? 1 : 0,
                                    transition: 'color 0.15s ease, opacity 0.15s ease',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        )}
                        <span style={{
                            color: 'var(--text-muted)',
                            opacity: 0.35,
                            transition: 'transform 0.2s ease, opacity 0.15s ease',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            display: 'flex',
                        }}>
                            <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden px-4 py-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                            }}>
                                {project.title}
                            </span>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.62rem',
                                color: 'var(--text-muted)',
                                opacity: 0.5,
                                flexShrink: 0,
                            }}>
                                {project.madeFor}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span style={{
                                color: 'var(--text-muted)',
                                opacity: 0.35,
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                                display: 'flex',
                            }}>
                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {project.tech.slice(0, 3).map((t, i) => (
                            <span key={i} style={{
                                fontSize: '0.62rem',
                                fontFamily: 'var(--font-mono)',
                                padding: '0.18rem 0.45rem',
                                borderRadius: '3px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                            }}>
                                {t}
                            </span>
                        ))}
                        {project.tech.length > 3 && (
                            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', opacity: 0.5 }}>
                                +{project.tech.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded description */}
            <div style={{
                overflow: 'hidden',
                maxHeight: isExpanded ? '400px' : '0',
                transition: 'max-height 0.3s ease',
            }}>
                <div style={{
                    padding: '1rem 1rem 1.25rem 1rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'rgba(34,211,238,0.015)',
                }}>
                    <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        marginBottom: '0.875rem',
                        fontFamily: 'var(--font-body)',
                    }}>
                        {project.description}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                        {project.tech.map((t, i) => (
                            <span key={i} style={{
                                fontSize: '0.68rem',
                                fontFamily: 'var(--font-mono)',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '4px',
                                background: 'rgba(99,102,241,0.07)',
                                border: '1px solid rgba(99,102,241,0.18)',
                                color: '#a5b4fc',
                            }}>
                                {t}
                            </span>
                        ))}
                        {hasLink && (
                            <button
                                onClick={e => { e.stopPropagation(); onOpen(); }}
                                className="flex items-center gap-1.5 ml-auto transition-colors duration-150"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.68rem',
                                    color: 'var(--accent)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                View project
                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
