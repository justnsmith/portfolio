import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProjects } from '@data/projects';

export default function Projects() {
    const navigate = useNavigate();
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [isInView, setIsInView] = useState<boolean>(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const projects = getFeaturedProjects();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
            { threshold: 0.1 }
        );
        const currentSection = sectionRef.current;
        if (currentSection) observer.observe(currentSection);
        return () => { if (currentSection) observer.unobserve(currentSection); };
    }, []);

    const handleProjectClick = (project: typeof projects[number]) => {
        if (project.internalUrl) {
            navigate(project.internalUrl);
        } else if (project.url) {
            if (project.url.startsWith('http')) {
                window.open(project.url, '_blank');
            } else {
                navigate(`/projects/${project.id}`);
            }
        } else if (project.githubUrl) {
            window.open(project.githubUrl, '_blank');
        }
    };

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="px-8 sm:px-12 md:px-14 lg:px-16 pt-20 pb-32 scroll-mt-28"
        >
            <div className="max-w-2xl">
                {/* Section heading */}
                <div className="flex items-center gap-3 mb-10">
                    <span
                        className="text-xs tracking-[0.2em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.6 }}
                    >
                        04
                    </span>
                    <div className="h-px w-6" style={{ background: 'var(--border-accent)' }} />
                    <h2
                        className="text-xl font-semibold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
                    >
                        Projects
                    </h2>
                </div>

                <div className="space-y-4">
                    {projects.map((project, index) => {
                        const isHovered = hoveredProject === project.id;
                        return (
                            <div
                                key={project.id}
                                className={`group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{
                                    transitionDelay: `${index * 80}ms`,
                                    background: isHovered ? 'rgba(34, 211, 238, 0.03)' : 'rgba(255,255,255,0.025)',
                                    border: isHovered ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                                    transform: isHovered ? 'translateY(-1px)' : 'none',
                                    boxShadow: isHovered ? '0 8px 32px rgba(34, 211, 238, 0.06)' : 'none',
                                }}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                                onClick={() => handleProjectClick(project)}
                            >
                                {/* Project Image */}
                                {project.image && (
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover object-top transition-transform duration-500"
                                            style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }}
                                            onError={e => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 50%)',
                                                opacity: 0.9
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Header row */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3
                                            className="text-base font-semibold leading-snug"
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                color: 'var(--text-primary)',
                                                letterSpacing: '-0.01em'
                                            }}
                                        >
                                            {project.title}
                                        </h3>
                                        <span
                                            className="shrink-0 text-xs"
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                color: 'var(--accent)',
                                                opacity: 0.7
                                            }}
                                        >
                                            {project.date}
                                        </span>
                                    </div>

                                    {/* Tech tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {project.tech.map((t, ti) => (
                                            <span
                                                key={ti}
                                                className="px-2 py-0.5 rounded text-xs transition-all duration-200"
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    background: isHovered ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.04)',
                                                    border: '1px solid',
                                                    borderColor: isHovered ? 'rgba(99, 102, 241, 0.25)' : 'var(--border)',
                                                    color: isHovered ? '#a5b4fc' : 'var(--text-muted)'
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    <p
                                        className="mb-3 leading-relaxed"
                                        style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}
                                    >
                                        {project.description}
                                    </p>

                                    {/* Bullets */}
                                    <div className="space-y-1.5">
                                        {project.bullets.slice(0, 3).map((bullet, bi) => (
                                            <div key={bi} className="flex items-start gap-2">
                                                <span
                                                    className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                                                    style={{ background: 'var(--accent)', opacity: isHovered ? 0.8 : 0.4 }}
                                                />
                                                <p
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                        lineHeight: '1.55',
                                                        opacity: isHovered ? 1 : 0.8
                                                    }}
                                                >
                                                    {bullet}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* External link hint */}
                                    {isHovered && (
                                        <div className="flex items-center gap-1.5 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                                            <svg className="w-3 h-3" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '0.7rem',
                                                    color: 'var(--accent)',
                                                    letterSpacing: '0.05em'
                                                }}
                                            >
                                                {project.internalUrl ? 'View details' : project.url ? 'Open project' : 'View on GitHub'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Archive button */}
                <div
                    className={`flex justify-start mt-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: '400ms' }}
                >
                    <button
                        onClick={() => navigate('/projects-archive')}
                        className="group flex items-center gap-2 text-sm transition-all duration-200"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-secondary)',
                            letterSpacing: '0.03em'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                        View all projects
                        <svg
                            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
