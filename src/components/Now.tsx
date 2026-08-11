import { Link } from "react-router-dom";
import Section from "@ui/Section";
import { nowItems } from "@data/experience";
import { profile } from "@data/nav";

export default function Now() {
    return (
        <Section id="now" label="Now" delay={120}>
            <div className="deflist">
                {nowItems.map(item => (
                    <div className="defrow" key={item.label}>
                        <div>
                            <span className="t-h3">{item.label}</span>
                        </div>
                        <div>
                            <p style={{ margin: 0 }}>{item.body}</p>
                            <p className="t-mono" style={{ margin: "0.2rem 0 0" }}>
                                {item.meta}
                            </p>
                        </div>
                    </div>
                ))}

                <div className="defrow">
                    <div>
                        <span className="t-h3 t-soft">For more</span>
                    </div>
                    <div>
                        <p style={{ margin: 0 }}>
                            See my{" "}
                            <a className="lnk" href={profile.resume} target="_blank" rel="noopener noreferrer">
                                résumé
                            </a>{" "}
                            or the{" "}
                            <Link className="lnk" to="/projects-archive">
                                full project archive
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
