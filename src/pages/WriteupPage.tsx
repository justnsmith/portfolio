import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import Markdown from "@ui/Markdown";
import { headings } from "@lib/markdown";
import { getWriteupBySlug } from "@data/writeups";
import { getProjectById } from "@data/projects";
import { profile } from "@data/nav";

export default function WriteupPage() {
    const { slug = "" } = useParams();
    const writeup = getWriteupBySlug(slug);
    const body = writeup?.body ?? "";

    const contents = useMemo(() => headings(body).filter(h => h.depth === 2), [body]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const previous = document.title;
        if (writeup) document.title = `${writeup.title} · ${profile.name}`;
        return () => {
            document.title = previous;
        };
    }, [writeup]);

    // Offsite pieces have no body to render, so send the reader to the source.
    if (!writeup || !writeup.body) {
        return (
            <PageLayout>
                <div className="rise">
                    <h1 className="t-name">{writeup ? "Published elsewhere" : "Not here"}</h1>
                    <p className="t-dim" style={{ margin: "0.75rem 0 0" }}>
                        {writeup
                            ? `"${writeup.title}" lives on ${writeup.source ?? "another site"}.`
                            : "There's no writeup at this address."}
                    </p>
                    <p style={{ marginTop: "1.5rem" }}>
                        {writeup?.url && (
                            <>
                                <a
                                    className="lnk"
                                    href={writeup.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read it on {writeup.source ?? "the original site"} ↗
                                </a>
                                {"  ·  "}
                            </>
                        )}
                        <Link className="lnk" to="/writeups">
                            All writeups
                        </Link>
                    </p>
                </div>
            </PageLayout>
        );
    }

    const project = writeup.projectId ? getProjectById(writeup.projectId) : undefined;

    return (
        <PageLayout>
            <article className="rise">
                <header>
                    <p className="t-meta no-print">
                        <Link className="lnk" to="/writeups" style={{ color: "inherit" }}>
                            Writeups
                        </Link>
                    </p>

                    <h1 className="t-name" style={{ marginTop: "0.6rem" }}>
                        {writeup.title}
                    </h1>

                    <p className="t-meta" style={{ display: "block", marginTop: "0.85rem" }}>
                        {[writeup.date, `${writeup.minutes} min read`].filter(Boolean).join("  ·  ")}
                    </p>

                    {writeup.summary && (
                        <p
                            className="t-dim"
                            style={{ margin: "1.15rem 0 0", fontSize: "1.125rem", lineHeight: 1.6 }}
                        >
                            {writeup.summary}
                        </p>
                    )}

                    <div
                        className="flex flex-wrap items-baseline"
                        style={{ gap: "0.5rem 1.25rem", marginTop: "1.25rem" }}
                    >
                        {writeup.tags.length > 0 && (
                            <span className="t-mono">{writeup.tags.join("  ·  ")}</span>
                        )}
                        {writeup.repo && (
                            <a
                                className="lnk"
                                href={writeup.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                            >
                                Source
                            </a>
                        )}
                    </div>
                </header>

                <hr className="rule" style={{ margin: "2rem 0" }} />

                {contents.length >= 3 && (
                    <nav className="toc no-print" aria-label="Contents">
                        <p className="t-meta" style={{ margin: 0 }}>
                            Contents
                        </p>
                        <ol>
                            {contents.map(h => (
                                <li key={h.id}>
                                    <a className="lnk-q" href={`#${h.id}`}>
                                        {h.text}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <Markdown source={writeup.body} />

                <hr className="rule" style={{ margin: "2.5rem 0 1.5rem" }} />

                <p className="t-dim" style={{ fontSize: "0.95rem" }}>
                    {project && (
                        <>
                            More on{" "}
                            <Link className="lnk" to="/projects-archive">
                                {project.title}
                            </Link>{" "}
                            in the project archive.{" "}
                        </>
                    )}
                    <Link className="lnk" to="/writeups">
                        All writeups
                    </Link>
                </p>
            </article>
        </PageLayout>
    );
}
