import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import { projects, type Project } from "@data/projects";
import { getWriteupForProject } from "@data/writeups";

type Filter = "all" | "Personal" | "College";

const FILTERS: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Personal", value: "Personal" },
    { label: "College", value: "College" },
];

export default function ProjectsArchive() {
    const [filter, setFilter] = useState<Filter>("all");

    const byYear = useMemo(() => {
        const list = filter === "all" ? projects : projects.filter(p => p.madeFor === filter);
        const grouped = list.reduce<Record<number, Project[]>>((acc, p) => {
            (acc[p.year] ??= []).push(p);
            return acc;
        }, {});
        return Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a)
            .map(year => ({ year, items: grouped[year] }));
    }, [filter]);

    const count = byYear.reduce((sum, group) => sum + group.items.length, 0);

    return (
        <PageLayout>
            <div className="rise">
                <h1 className="t-name">Projects</h1>
                <p className="t-dim" style={{ margin: "0.55rem 0 0", fontSize: "0.95rem" }}>
                    Everything I've built, newest first: coursework, research spin-offs, and things I
                    wrote to understand how they work. Some have a{" "}
                    <Link className="lnk" to="/writeups">
                        longer writeup
                    </Link>
                    .
                </p>

                <div
                    className="flex flex-wrap items-center no-print"
                    style={{ gap: "0.5rem", margin: "1.75rem 0 2rem" }}
                >
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            className="btn-quiet"
                            aria-pressed={filter === f.value}
                            onClick={() => setFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                    <span className="t-mono" style={{ marginLeft: "0.35rem" }}>
                        {count} {count === 1 ? "project" : "projects"}
                    </span>
                </div>

                <div className="arch-head">
                    <div className="t-meta">Project</div>
                    <div className="t-meta">Description</div>
                </div>

                {byYear.map(({ year, items }) => (
                    <div key={year}>
                        <div className="arch-year">
                            <span className="t-meta">{year}</span>
                        </div>

                        {items.map(project => {
                            const primary = project.internalUrl ?? project.url ?? project.githubUrl;
                            const isInternal = Boolean(project.internalUrl);
                            const writeup = getWriteupForProject(project.id);

                            return (
                                <div className="arch-row" key={project.id}>
                                    <div>
                                        <span className="t-h3">
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
                                        </span>
                                        <p className="t-mono" style={{ margin: "0.15rem 0 0" }}>
                                            {project.madeFor} · {project.date}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="t-dim" style={{ margin: 0, fontSize: "0.95rem" }}>
                                            {project.description}
                                        </p>
                                        <p className="t-mono" style={{ margin: "0.5rem 0 0" }}>
                                            {project.tech.join("  ·  ")}
                                        </p>
                                        <p style={{ margin: "0.5rem 0 0" }}>
                                            <span
                                                className="flex flex-wrap items-baseline"
                                                style={{ gap: "1rem" }}
                                            >
                                                {writeup && (
                                                    writeup.url ? (
                                                        <a
                                                            className="lnk"
                                                            href={writeup.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                fontFamily: "var(--font-mono)",
                                                                fontSize: "0.75rem",
                                                            }}
                                                        >
                                                            Writeup ↗
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            className="lnk"
                                                            to={`/writeups/${writeup.slug}`}
                                                            style={{
                                                                fontFamily: "var(--font-mono)",
                                                                fontSize: "0.75rem",
                                                            }}
                                                        >
                                                            Writeup
                                                        </Link>
                                                    )
                                                )}
                                                {project.internalUrl && (
                                                    <Link
                                                        className="lnk"
                                                        to={project.internalUrl}
                                                        style={{
                                                            fontFamily: "var(--font-mono)",
                                                            fontSize: "0.75rem",
                                                        }}
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
                                                        style={{
                                                            fontFamily: "var(--font-mono)",
                                                            fontSize: "0.75rem",
                                                        }}
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
                                                        style={{
                                                            fontFamily: "var(--font-mono)",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        Source
                                                    </a>
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {count === 0 && (
                    <p className="t-soft" style={{ padding: "3rem 0" }}>
                        No projects in this filter yet.
                    </p>
                )}
            </div>
        </PageLayout>
    );
}
