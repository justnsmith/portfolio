import { sections } from "@data/nav";

interface SiteNavProps {
    activeSection: string;
    onNavigate: (id: string) => void;
    compact?: boolean;
}

export default function SiteNav({ activeSection, onNavigate, compact }: SiteNavProps) {
    return (
        <nav aria-label="Sections">
            <ul
                className="flex flex-wrap items-center"
                style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    gap: compact ? "1.15rem" : "1.35rem",
                }}
            >
                {sections.map(({ id, label }) => {
                    const active = activeSection === id;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                onClick={e => {
                                    e.preventDefault();
                                    onNavigate(id);
                                }}
                                aria-current={active ? "true" : undefined}
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: compact ? "0.875rem" : "0.95rem",
                                    color: active ? "var(--accent)" : "var(--ink-mid)",
                                    textDecoration: "underline",
                                    textDecorationThickness: active ? "0.08em" : "0.055em",
                                    textUnderlineOffset: "0.2em",
                                    textDecorationColor: active ? "var(--accent)" : "transparent",
                                    transition: "color 150ms ease, text-decoration-color 150ms ease",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = "var(--accent)";
                                    e.currentTarget.style.textDecorationColor = "var(--accent-soft)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = active ? "var(--accent)" : "var(--ink-mid)";
                                    e.currentTarget.style.textDecorationColor = active ? "var(--accent)" : "transparent";
                                }}
                            >
                                {label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
