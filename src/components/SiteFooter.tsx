import { profile } from "@data/nav";

interface SiteFooterProps {
    /**
     * Drop the marginal label on pages whose content isn't set on the
     * marginalia grid, so the footer lines up with what's above it.
     */
    bare?: boolean;
}

export default function SiteFooter({ bare }: SiteFooterProps) {
    return (
        <footer
            className={bare ? "sec sec--bare" : "sec"}
            style={{ paddingBottom: "4.5rem" }}
        >
            {!bare && (
                <p className="sec-label" style={{ margin: 0 }}>
                    Elsewhere
                </p>
            )}
            <div className="sec-body">
                <div
                    className="flex flex-wrap items-baseline"
                    style={{ gap: "1.15rem", fontSize: "0.95rem" }}
                >
                    <a className="lnk" href={`mailto:${profile.email}`}>
                        Email
                    </a>
                    <a className="lnk" href={profile.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a className="lnk" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                    <a className="lnk" href={profile.resume} target="_blank" rel="noopener noreferrer">
                        Résumé
                    </a>
                </div>

            </div>
        </footer>
    );
}
