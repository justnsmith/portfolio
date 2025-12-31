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
            <div className="max-w-7xl mx-auto space-y-8 px-4">
                {/* Header */}
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                        All Projects
                    </h1>
                    <p className="text-gray-400">
                        A complete archive of my work and contributions
                    </p>
                </div>

                {/* Table Container */}
                <div className="w-full">
                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-4 px-3 pt-6 pb-2 text-xs font-semibold tracking-wide text-gray-500 border-b border-gray-700">
                        <div className="col-span-1">Year</div>
                        <div className="col-span-3">Project</div>
                        <div className="col-span-2">Made For</div>
                        <div className="col-span-4">Built With</div>
                        <div className="col-span-2 text-right">Link</div>
                    </div>

                    {/* Projects rows */}
                    <div className="mt-2">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={`relative group grid grid-cols-12 gap-4 px-3 py-5 border-b border-gray-800/50 cursor-pointer transition-colors duration-200
                                    hover:bg-gray-800/30
                                    ${hoveredProject === project.id ? 'bg-gray-800/30' : ''}`}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                                onClick={() => handleProjectClick(project)}
                            >
                                {/* Year - Stays Cyan */}
                                <div className="col-span-1 text-cyan-400/80 font-mono text-sm flex items-center">
                                    {project.year}
                                </div>

                                {/* Project Title - Now hovers to White instead of Aqua */}
                                <div className="col-span-3 flex items-center">
                                    <span
                                        className={`text-sm font-medium transition-colors duration-200 ${hoveredProject === project.id
                                                ? 'text-white'
                                                : 'text-gray-300'
                                            }`}
                                    >
                                        {project.title}
                                    </span>
                                </div>

                                {/* Made for */}
                                <div className="col-span-2 flex items-center text-sm text-gray-500">
                                    {project.madeFor}
                                </div>

                                {/* Built With - Readable tags */}
                                <div className="col-span-4 flex flex-wrap items-center gap-2">
                                    {project.tech.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="px-2 py-0.5 text-xs text-gray-400 border border-gray-800 rounded bg-gray-900/50 group-hover:border-gray-700 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Link */}
                                <div className="col-span-2 flex items-center justify-end">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${hoveredProject === project.id ? 'text-indigo-400' : 'text-gray-600'
                                            }`}
                                    >
                                        <span className="hidden sm:inline">View Project</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
