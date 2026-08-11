import { profile } from "@data/nav";
import SiteNav from "@components/SiteNav";
import Burger from "@ui/Burger";

interface SiteHeaderProps {
    activeSection: string;
    onNavigate: (id: string) => void;
    onContactClick: () => void;
    onMenuOpen: () => void;
    menuOpen: boolean;
}

export default function SiteHeader({
    activeSection,
    onNavigate,
    onContactClick,
    onMenuOpen,
    menuOpen,
}: SiteHeaderProps) {
    return (
        <header className="hdr rise">
            <div className="hdr__burger no-print">
                <Burger onClick={onMenuOpen} expanded={menuOpen} />
            </div>

            <div className="hdr__portrait">
                <img src="/profile.jpeg" alt="" width={112} height={112} />
            </div>

            <div className="hdr__identity">
                <h1 className="t-name">{profile.name}</h1>
                <p className="hdr__credential t-dim">{profile.credential}</p>
                <p className="hdr__role t-soft">{profile.role}</p>
            </div>

            <div className="hdr__links">
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

            <div className="hdr__nav nav-inline no-print">
                <SiteNav activeSection={activeSection} onNavigate={onNavigate} />
            </div>
        </header>
    );
}
