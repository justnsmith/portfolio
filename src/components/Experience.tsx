import Section from "@ui/Section";
import { experiences } from "@data/experience";

export default function Experience() {
    return (
        <Section id="experience" label="Experience" delay={240}>
            <div className="stack-list">
                {experiences.map(exp => (
                    <article key={exp.org}>
                        <div
                            className="flex flex-wrap items-baseline"
                            style={{ gap: "0.35rem 1rem", justifyContent: "space-between" }}
                        >
                            <h3 className="t-h3">{exp.title}</h3>
                            <span className="t-meta" style={{ whiteSpace: "nowrap" }}>
                                {exp.date}
                            </span>
                        </div>

                        <p className="t-dim" style={{ margin: "0.15rem 0 0", fontSize: "0.95rem" }}>
                            {exp.org}
                            <span className="t-soft">
                                {" · "}
                                {exp.location}
                                {exp.note ? ` · ${exp.note}` : ""}
                            </span>
                            {exp.githubUrl && (
                                <>
                                    {" · "}
                                    <a
                                        className="lnk"
                                        href={exp.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        source
                                    </a>
                                </>
                            )}
                        </p>

                        {exp.bullets && (
                            <ul className="bullets" style={{ marginTop: "0.85rem" }}>
                                {exp.bullets.map(b => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                        )}

                        {exp.tags && (
                            <p className="t-mono" style={{ margin: "1rem 0 0" }}>
                                {exp.tags.join("  ·  ")}
                            </p>
                        )}
                    </article>
                ))}
            </div>
        </Section>
    );
}
