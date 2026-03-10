import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@components/layout/PageLayout';
import { projects } from '@data/projects';

export default function ProjectsArchive() {
    const navigate = useNavigate();
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);

    const handleProjectClick = (project: typeof projects[number]) => {
        if (project.githubUrl) {
            window.open(project.githubUrl, '_blank');
        } else if (project.url) {
            if (project.url.startsWith('http')) {
                window.open(project.url, '_blank');
            } else {
                navigate(`/projects/${project.id}`);
            }
        }
    };

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="space-y-2">
                    <p
                        className="text-xs tracking-[0.2em] uppercase mb-3"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.6 }}
                    >
                        Archive
                    </p>
                    <h1
                        className="text-3xl md:text-4xl font-bold tracking-tight"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
                    >
                        All Projects
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        A complete archive of my work and contributions.
                    </p>
                </div>

                {/* Table */}
                <div className="w-full">
                    {/* Column Headers */}
                    <div
                        className="hidden md:grid grid-cols-12 gap-4 px-3 py-3 text-xs tracking-wide"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-muted)',
                            borderBottom: '1px solid var(--border)',
                            letterSpacing: '0.08em'
                        }}
                    >
                        <div className="col-span-1">Year</div>
                        <div className="col-span-3">Project</div>
                        <div className="col-span-2">Made For</div>
                        <div className="col-span-4">Built With</div>
                        <div className="col-span-2 text-right">Link</div>
                    </div>

                    <div className="mt-1 space-y-0">
                        {projects.map((project) => {
                            const isHovered = hoveredProject === project.id;
                            return (
                                <div
                                    key={project.id}
                                    className="group cursor-pointer transition-all duration-200
                                        md:grid md:grid-cols-12 md:gap-4 md:px-3 md:py-4
                                        flex flex-col gap-3 p-4 rounded-lg md:rounded-none"
                                    style={{
                                        background: isHovered ? 'rgba(34, 211, 238, 0.03)' : 'transparent',
                                        borderBottom: '1px solid var(--border)',
                                    }}
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                    onClick={() => handleProjectClick(project)}
                                >
                                    {/* Mobile */}
                                    <div className="md:hidden space-y-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <span
                                                className="text-sm font-medium transition-colors duration-200"
                                                style={{ color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                            >
                                                {project.title}
                                            </span>
                                            <span
                                                className="shrink-0 text-xs"
                                                style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.7 }}
                                            >
                                                {project.year}
                                            </span>
                                        </div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            {project.madeFor}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.tech.map((tech, ti) => (
                                                <span
                                                    key={ti}
                                                    className="px-2 py-0.5 rounded text-xs"
                                                    style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        background: 'rgba(255,255,255,0.04)',
                                                        border: '1px solid var(--border)',
                                                        color: 'var(--text-muted)'
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5 text-xs"
                                            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
                                        >
                                            View Project
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Desktop */}
                                    <div className="hidden md:contents">
                                        <div className="col-span-1 flex items-center">
                                            <span
                                                className="text-xs"
                                                style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.7 }}
                                            >
                                                {project.year}
                                            </span>
                                        </div>
                                        <div className="col-span-3 flex items-center">
                                            <span
                                                className="text-sm transition-colors duration-200"
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontWeight: isHovered ? 500 : 400,
                                                    color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'
                                                }}
                                            >
                                                {project.title}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                {project.madeFor}
                                            </span>
                                        </div>
                                        <div className="col-span-4 flex flex-wrap items-center gap-1.5">
                                            {project.tech.map((tech, ti) => (
                                                <span
                                                    key={ti}
                                                    className="px-2 py-0.5 rounded text-xs transition-all duration-200"
                                                    style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        background: isHovered ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                                                        border: '1px solid',
                                                        borderColor: isHovered ? 'rgba(99,102,241,0.2)' : 'var(--border)',
                                                        color: isHovered ? '#a5b4fc' : 'var(--text-muted)'
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-end">
                                            <span
                                                className="inline-flex items-center gap-1.5 text-xs transition-all duration-200"
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    color: isHovered ? 'var(--accent)' : 'var(--text-muted)',
                                                    opacity: isHovered ? 1 : 0
                                                }}
                                            >
                                                View
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
