import { Link } from "react-router-dom";
import Section from "@ui/Section";
import { getFeaturedProjects } from "@data/projects";

export default function Projects() {
    const projects = getFeaturedProjects();

    return (
        <Section id="projects" label="Projects" delay={180}>
            <div className="stack-list">
                {projects.map(project => {
                    const primary = project.internalUrl ?? project.url ?? project.githubUrl;
                    const isInternal = Boolean(project.internalUrl);

                    return (
                        <article key={project.id}>
                            <div
                                className="flex flex-wrap items-baseline"
                                style={{ gap: "0.35rem 1rem", justifyContent: "space-between" }}
                            >
                                <h3 className="t-h3">
                                    {primary ? (
                                        isInternal ? (
                                            <Link className="lnk-q" to={primary}>
                                                {project.title}
                                            </Link>
                                        ) : (
                                            <a
                                                className="lnk-q"
                                                href={primary}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {project.title}
                                            </a>
                                        )
                                    ) : (
                                        project.title
                                    )}
                                </h3>
                                <span className="t-meta" style={{ whiteSpace: "nowrap" }}>
                                    {project.date}
                                </span>
                            </div>

                            <p className="t-dim" style={{ margin: "0.4rem 0 0", fontSize: "1rem" }}>
                                {project.description}
                            </p>

                            <div
                                className="flex flex-wrap items-baseline"
                                style={{ gap: "0.4rem 1.25rem", marginTop: "0.75rem", justifyContent: "space-between" }}
                            >
                                <span className="t-mono">{project.tech.join("  ·  ")}</span>
                                <span className="flex flex-wrap items-baseline" style={{ gap: "1rem" }}>
                                    {project.internalUrl && (
                                        <Link
                                            className="lnk"
                                            to={project.internalUrl}
                                            style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                                        >
                                            Visualizer
                                        </Link>
                                    )}
                                    {project.url && (
                                        <a
                                            className="lnk"
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                                        >
                                            Live site
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            className="lnk"
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                                        >
                                            Source
                                        </a>
                                    )}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>

            <p style={{ marginTop: "1.75rem", fontSize: "0.95rem" }}>
                <Link className="lnk" to="/projects-archive">
                    All projects →
                </Link>
            </p>
        </Section>
    );
}
