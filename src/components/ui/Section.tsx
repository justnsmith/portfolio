import type { ReactNode } from "react";

interface SectionProps {
    id: string;
    /** Marginal label — hangs in the left margin on wide screens. */
    label: string;
    children: ReactNode;
    /** Drop the top hairline (used for the first section under the header). */
    plain?: boolean;
    delay?: number;
}

export default function Section({ id, label, children, plain, delay = 0 }: SectionProps) {
    return (
        <section
            id={id}
            className={`sec rise${plain ? " sec--plain" : ""}`}
            style={{ animationDelay: `${delay}ms` }}
            aria-labelledby={`${id}-label`}
        >
            <h2 className="sec-label" id={`${id}-label`}>
                {label}
            </h2>
            <div className="sec-body">{children}</div>
        </section>
    );
}
