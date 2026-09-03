import { Link } from "react-router-dom";
import PageLayout from "@components/layout/PageLayout";
import { writeups, writeupHref, type Writeup } from "@data/writeups";

function Meta({ writeup }: { writeup: Writeup }) {
    const parts = [
        writeup.date,
        writeup.source,
        `${writeup.minutes} min read`,
    ].filter(Boolean);

    return <span className="t-meta">{parts.join("  ·  ")}</span>;
}

export default function WriteupsIndex() {
    return (
        <PageLayout>
            <div className="rise">
                <h1 className="t-name">Writeups</h1>
                <p className="t-dim" style={{ margin: "0.55rem 0 0", fontSize: "0.95rem" }}>
                    Longer notes on things I've built: what the design was, and which decisions
                    turned out to be load-bearing.
                </p>

                <div className="stack-list" style={{ marginTop: "2.5rem" }}>
                    {writeups.map(writeup => {
                        const href = writeupHref(writeup);
                        const offsite = Boolean(writeup.url);

                        return (
                            <article key={writeup.slug}>
                                <div
                                    className="flex flex-wrap items-baseline"
                                    style={{ gap: "0.35rem 1rem", justifyContent: "space-between" }}
                                >
                                    <h2 className="t-h2">
                                        {offsite ? (
                                            <a
                                                className="lnk-q"
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {writeup.title} ↗
                                            </a>
                                        ) : (
                                            <Link className="lnk-q" to={href}>
                                                {writeup.title}
                                            </Link>
                                        )}
                                    </h2>
                                    <Meta writeup={writeup} />
                                </div>

                                <p className="t-dim" style={{ margin: "0.5rem 0 0", fontSize: "1rem" }}>
                                    {writeup.summary}
                                </p>

                                {writeup.tags.length > 0 && (
                                    <p className="t-mono" style={{ margin: "0.75rem 0 0" }}>
                                        {writeup.tags.join("  ·  ")}
                                    </p>
                                )}
                            </article>
                        );
                    })}
                </div>

                {writeups.length === 0 && (
                    <p className="t-soft" style={{ padding: "3rem 0" }}>
                        Nothing published yet.
                    </p>
                )}
            </div>
        </PageLayout>
    );
}
