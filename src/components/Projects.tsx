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
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        const currentSection = sectionRef.current;
        if (currentSection) {
            observer.observe(currentSection);
        }

        return () => {
            if (currentSection) {
                observer.unobserve(currentSection);
            }
        };
    }, []);

    const handleProjectClick = (projectId: string, url?: string, githubUrl?: string) => {
        if (url) {
            if (url.startsWith('http')) {
                window.open(url, '_blank');
            } else {
                navigate(`/projects/${projectId}`);
            }
        } else if (githubUrl) {
            window.open(githubUrl, '_blank');
        }
    };

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-20 pb-32 scroll-mt-28"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                    <h2 className="text-2xl font-bold text-white mx-4 flex items-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse">
                            Projects
                        </span>
                    </h2>
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-grow"></div>
                </div>

                <p className={`text-gray-300 text-center mb-10 max-w-2xl mx-auto transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    Click on any project to view more details and access its GitHub repository.
                </p>

                <div className="space-y-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`relative border border-gray-800 rounded-md overflow-hidden
                                      bg-gray-900/30 backdrop-blur-sm cursor-pointer
                                      hover:bg-gray-800/50 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.005]
                                      ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                                      ${hoveredProject === project.id ? 'bg-gray-800/50 border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-[1.005]' : ''}`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transition: hoveredProject === project.id || hoveredProject === null
                                    ? 'transform 200ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out, box-shadow 200ms ease-in-out'
                                    : 'opacity 700ms, transform 700ms'
                            }}
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                            onClick={() => handleProjectClick(project.id, project.url, project.githubUrl)}
                        >
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 transform origin-left"
                                style={{
                                    transform: hoveredProject === project.id ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: 'transform 200ms ease-in-out'
                                }}
                            ></div>

                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                                    <h3 className="text-xl font-medium text-white group-hover:text-cyan-300 transition-colors duration-200">
                                        {project.title}
                                    </h3>
                                    <span className="text-xs text-cyan-400">
                                        {project.date}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="px-2 py-1 border border-gray-700 text-gray-300 rounded-full text-xs"
                                            style={{
                                                backgroundColor: hoveredProject === project.id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                                transition: 'background-color 200ms ease-in-out'
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-400 mb-4 text-sm">
                                    {project.description}
                                </p>

                                <div className="space-y-2">
                                    {project.bullets.map((bullet, bulletIndex) => (
                                        <div
                                            key={bulletIndex}
                                            className="flex items-center gap-2"
                                            style={{
                                                opacity: hoveredProject === project.id ? 1 : 0.7,
                                                transition: 'opacity 200ms ease-in-out'
                                            }}
                                        >
                                            <span className="text-cyan-500 inline-block flex-shrink-0 leading-none">•</span>
                                            <p className="text-xs text-gray-400 leading-tight">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`flex justify-center mt-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: '400ms' }}>
                    <button
                        onClick={() => navigate('/projects-archive')}
                        className="relative px-6 py-3 bg-gray-800 border border-gray-700 rounded-md
                                  text-gray-300 font-medium overflow-hidden
                                  hover:text-white hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/20 focus:outline-none"
                        style={{ transition: 'all 200ms ease-in-out' }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            View All Projects
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
