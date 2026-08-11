import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import SiteFooter from "@components/SiteFooter";
import { profile } from "@data/nav";

interface PageLayoutProps {
    children: ReactNode;
    /** Widen the measure for pages that hold tables or the visualizer. */
    wide?: boolean;
}

export default function PageLayout({ children, wide }: PageLayoutProps) {
    const wrap = `pg-wrap${wide ? " pg-wrap--wide" : ""}`;

    return (
        <>
            <div className={wrap}>
                <div
                    className="flex flex-wrap items-baseline no-print"
                    style={{ gap: "1rem", justifyContent: "space-between", padding: "2rem 0 1.25rem" }}
                >
                    <Link
                        to="/"
                        className="lnk-q"
                        style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 500 }}
                    >
                        ← {profile.name}
                    </Link>
                    <span className="flex flex-wrap items-baseline" style={{ gap: "1.15rem", fontSize: "0.95rem" }}>
                        <a className="lnk" href={profile.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                        <a className="lnk" href={profile.resume} target="_blank" rel="noopener noreferrer">
                            Résumé
                        </a>
                    </span>
                </div>
            </div>

            <hr className="rule" />

            <main className={wrap} style={{ paddingTop: "2.5rem" }}>
                {children}
            </main>

            <div className={wrap}>
                <SiteFooter bare />
            </div>
        </>
    );
}
