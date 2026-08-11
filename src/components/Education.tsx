import Section from "@ui/Section";
import { education } from "@data/experience";

export default function Education() {
    return (
        <Section id="education" label="Education" delay={300}>
            <div className="stack-list">
                {education.map(degree => (
                    <article key={degree.school}>
                        <div
                            className="flex flex-wrap items-baseline"
                            style={{ gap: "0.35rem 1rem", justifyContent: "space-between" }}
                        >
                            <h3 className="t-h3">{degree.school}</h3>
                            <span className="t-meta" style={{ whiteSpace: "nowrap" }}>
                                {degree.date}
                            </span>
                        </div>

                        <p className="t-dim" style={{ margin: "0.15rem 0 0", fontSize: "0.95rem" }}>
                            {degree.degree}
                            {degree.honors && <span className="t-soft">{` · ${degree.honors}`}</span>}
                        </p>

                        <p className="t-mono" style={{ margin: "0.6rem 0 0", lineHeight: 1.7 }}>
                            {degree.detail}
                        </p>
                    </article>
                ))}
            </div>
        </Section>
    );
}
