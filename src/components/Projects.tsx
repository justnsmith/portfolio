import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProjects } from '@data/projects';
import SectionHeading from '@components/ui/SectionHeading';

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
                <SectionHeading title="Projects" />

                <div className="space-y-4">
                    {projects.map((project, index) => {
                        const isHovered = hoveredProject === project.id;
                        return (
                            <div
                                key={project.id}
                                className={`rounded-xl overflow-hidden cursor-pointer ${
                                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{
                                    transition: 'opacity 0.5s ease, transform 0.3s ease, border-color 0.2s ease, background 0.2s ease',
                                    transitionDelay: isInView ? `${index * 80}ms` : '0ms',
                                    background: isHovered ? 'rgba(34, 211, 238, 0.03)' : 'rgba(255,255,255,0.025)',
                                    border: '1px solid',
                                    borderColor: isHovered ? 'var(--border-accent)' : 'var(--border)',
                                    transform: isHovered ? 'translateY(-1px)' : 'none',
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
                                            className="w-full h-full object-cover object-top"
                                            style={{
                                                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                                transition: 'transform 0.5s ease',
                                            }}
                                            onError={e => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 55%)',
                                                opacity: isHovered ? 0.7 : 0.92,
                                                transition: 'opacity 0.35s ease',
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
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            {project.title}
                                        </h3>
                                        <span
                                            className="shrink-0 text-xs"
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                color: 'var(--accent)',
                                                opacity: 0.7,
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
                                                className="px-2 py-0.5 rounded text-xs"
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    background: 'rgba(255,255,255,0.04)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-muted)',
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
                                                    style={{
                                                        background: 'var(--accent)',
                                                        opacity: isHovered ? 0.8 : 0.35,
                                                        transition: 'opacity 0.25s ease',
                                                    }}
                                                />
                                                <p
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                        lineHeight: '1.55',
                                                        opacity: isHovered ? 1 : 0.75,
                                                        transition: 'opacity 0.25s ease',
                                                    }}
                                                >
                                                    {bullet}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
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
