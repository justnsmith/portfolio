import { useNavigate } from 'react-router-dom';
import PageLayout from '@components/layout/PageLayout';
import { projects } from '@data/projects';

export default function ProjectsArchive() {
    const navigate = useNavigate();

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
        <PageLayout>
            <div className="space-y-6">
                {/* Title */}
                <h1 className="text-4xl font-bold text-white">All Projects</h1>

                {/* Column Headers */}
                <div className="grid grid-cols-12 py-3 text-sm font-medium text-white">
                    <div className="col-span-1">Year</div>
                    <div className="col-span-3 pl-2">Project</div>
                    <div className="col-span-2 pl-2">Made for</div>
                    <div className="col-span-4 pl-2">Built with</div>
                    <div className="col-span-2 text-left pl-2">Link</div>
                </div>

                <div className="border-b border-gray-800 my-2"></div>

                {/* Projects table */}
                <div>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="grid grid-cols-12 border-b border-gray-800 py-4 hover:bg-gray-800/20 transition-colors cursor-pointer text-sm"
                            onClick={() => handleProjectClick(project.id, project.url, project.githubUrl)}
                        >
                            {/* Year */}
                            <div className="col-span-1 text-gray-400 flex items-center">
                                {project.year}
                            </div>

                            {/* Project Title */}
                            <div className="col-span-3 pl-2 pr-4 flex items-center text-white font-semibold">
                                {project.title}
                            </div>

                            {/* Made for */}
                            <div className="col-span-2 pl-2 pr-4 font-medium text-gray-400 flex items-center">
                                {project.madeFor}
                            </div>

                            {/* Built With */}
                            <div className="col-span-4 pl-2 pr-4 flex flex-wrap gap-1 items-center">
                                {project.tech.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="px-2 py-0.5 border border-cyan-900/30 bg-cyan-900/10 text-cyan-400 rounded-md text-xs"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Link */}
                            <div className="col-span-2 text-left pl-2 flex items-center justify-start text-gray-400 hover:text-cyan-400 transition-colors">
                                <span className="mr-1 text-xs cursor-pointer">
                                    {project.url && !project.url.startsWith('http') ? 'View Details' : 'View Repo'}
                                </span>
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
