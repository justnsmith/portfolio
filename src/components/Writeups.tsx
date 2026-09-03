import { Link } from "react-router-dom";
import Section from "@ui/Section";
import { writeups, writeupHref } from "@data/writeups";

const SHOWN = 3;

export default function Writeups() {
    const recent = writeups.slice(0, SHOWN);
    if (recent.length === 0) return null;

    return (
        <Section id="writeups" label="Writeups" delay={210}>
            <div className="stack-list">
                {recent.map(writeup => {
                    const href = writeupHref(writeup);
                    const offsite = Boolean(writeup.url);

                    return (
                        <article key={writeup.slug}>
                            <div
                                className="flex flex-wrap items-baseline"
                                style={{ gap: "0.35rem 1rem", justifyContent: "space-between" }}
                            >
                                <h3 className="t-h3">
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
                                </h3>
                                <span className="t-meta" style={{ whiteSpace: "nowrap" }}>
                                    {writeup.date}
                                </span>
                            </div>

                            <p className="t-dim" style={{ margin: "0.4rem 0 0", fontSize: "1rem" }}>
                                {writeup.summary}
                            </p>

                            <p className="t-mono" style={{ margin: "0.75rem 0 0" }}>
                                {[writeup.source, `${writeup.minutes} min read`]
                                    .filter(Boolean)
                                    .join("  ·  ")}
                            </p>
                        </article>
                    );
                })}
            </div>

            <p style={{ marginTop: "1.75rem", fontSize: "0.95rem" }}>
                <Link className="lnk" to="/writeups">
                    All writeups →
                </Link>
            </p>
        </Section>
    );
}
