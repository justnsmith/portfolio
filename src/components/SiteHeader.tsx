import { profile } from "@data/nav";
import SiteNav from "@components/SiteNav";

interface SiteHeaderProps {
    activeSection: string;
    onNavigate: (id: string) => void;
    onContactClick: () => void;
}

export default function SiteHeader({ activeSection, onNavigate, onContactClick }: SiteHeaderProps) {
    return (
        <header className="hdr rise">
            <div className="hdr__portrait">
                <img src="/profile.jpeg" alt="" width={104} height={104} />
            </div>

            <div>
                <h1 className="t-name">{profile.name}</h1>

                <p className="t-dim" style={{ margin: "0.55rem 0 0", fontSize: "0.95rem" }}>
                    {profile.credential}
                </p>
                <p className="t-soft" style={{ margin: "0.1rem 0 0", fontSize: "0.95rem" }}>
                    {profile.role}
                </p>

                <div
                    className="flex flex-wrap items-center"
                    style={{ gap: "1.15rem", marginTop: "0.9rem", fontSize: "0.95rem" }}
                >
                    <a className="lnk" href={profile.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a className="lnk" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                    <a className="lnk" href={profile.resume} target="_blank" rel="noopener noreferrer">
                        Résumé
                    </a>
                    <button className="btn-plain lnk" onClick={onContactClick}>
                        Email
                    </button>
                </div>

                <div className="no-print" style={{ marginTop: "1.5rem" }}>
                    <SiteNav activeSection={activeSection} onNavigate={onNavigate} />
                </div>
            </div>
        </header>
    );
}
