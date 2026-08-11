import { useEffect, useRef, useState } from "react";
import { profile } from "@data/nav";
import SiteNav from "@components/SiteNav";

interface StickyBarProps {
    activeSection: string;
    onNavigate: (id: string) => void;
}

/**
 * Slim bar that slides in once the masthead has scrolled away, so the
 * section links stay reachable without a permanent chrome.
 */
export default function StickyBar({ activeSection, onNavigate }: StickyBarProps) {
    const [shown, setShown] = useState(false);
    const sentinel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sentinel.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShown(!entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={sentinel} aria-hidden="true" style={{ position: "absolute", top: "18rem", height: 1 }} />
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
                        <div className="bar__nav">
                            <SiteNav activeSection={activeSection} onNavigate={onNavigate} compact />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
