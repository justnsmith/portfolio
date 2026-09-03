import { useEffect, useRef } from "react";
import { sections, profile } from "@data/nav";

interface MenuSheetProps {
    open: boolean;
    activeSection: string;
    onClose: () => void;
    onNavigate: (id: string) => void;
    onContactClick: () => void;
}

export default function MenuSheet({
    open,
    activeSection,
    onClose,
    onNavigate,
    onContactClick,
}: MenuSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        // Focus the dialog itself, not a control. Announces the sheet without
        // painting a focus ring on the Close button.
        sheetRef.current?.focus({ preventScroll: true });
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    // Close first so the body scroll lock is lifted before the scroll starts.
    const go = (id: string) => {
        onClose();
        requestAnimationFrame(() => onNavigate(id));
    };

    return (
        <div
            ref={sheetRef}
            tabIndex={-1}
            className="sheet no-print"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
        >
            <div className="sheet__bar pg-wrap">
                <span className="bar__name">{profile.name}</span>
                <button className="btn-plain t-meta" onClick={onClose}>
                    Close
                </button>
            </div>

            <hr className="rule" />

            <nav className="sheet__nav pg-wrap" aria-label="Sections">
                <ul>
                    {sections.map(({ id, label }) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                aria-current={activeSection === id ? "true" : undefined}
                                onClick={e => {
                                    e.preventDefault();
                                    go(id);
                                }}
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sheet__links pg-wrap">
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                    Résumé
                </a>
                <button
                    className="btn-plain"
                    onClick={() => {
                        onClose();
                        onContactClick();
                    }}
                >
                    Email
                </button>
            </div>
        </div>
    );
}
