import { useEffect, useState } from "react";
import { profile } from "@data/nav";
import SiteNav from "@components/SiteNav";
import Burger from "@ui/Burger";

interface StickyBarProps {
    activeSection: string;
    onNavigate: (id: string) => void;
    onMenuOpen: () => void;
    menuOpen: boolean;
}

/**
 * Slim bar that slides in once the masthead has scrolled away, so the
 * section links stay reachable without a permanent chrome.
 */
export default function StickyBar({ activeSection, onNavigate, onMenuOpen, menuOpen }: StickyBarProps) {
    const [shown, setShown] = useState(false);

    // Watch the masthead itself rather than a fixed offset. On phones it is a
    // full-screen landing, so any hard-coded trigger height would be wrong.
    useEffect(() => {
        const masthead = document.getElementById("top");
        if (!masthead) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShown(!entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(masthead);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div className="bar no-print" data-shown={shown} inert={!shown}>
                <div className="pg-wrap">
                    <div className="bar__inner">
                        <a
                            className="bar__name"
                            href="#top"
                            onClick={e => {
                                e.preventDefault();
                                onNavigate("top");
                            }}
                            style={{ textDecoration: "none" }}
                        >
                            {profile.name}
                        </a>
                        <div className="bar__nav nav-inline">
                            <SiteNav activeSection={activeSection} onNavigate={onNavigate} compact />
                        </div>
                        <Burger onClick={onMenuOpen} expanded={menuOpen} />
                    </div>
                </div>
            </div>
        </>
    );
}
