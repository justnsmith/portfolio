import { useState, useEffect, useRef } from 'react';
import { NavigationLinksProps } from '@types';

const labels: Record<string, string> = {
    about: 'About',
    tech: 'Tech Stack',
    experience: 'Experience',
    projects: 'Projects',
};

export default function NavigationLinks({ sectionIds, activeSection, onNavigate }: NavigationLinksProps) {
    const [clickedSection, setClickedSection] = useState<string | null>(null);
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleNavigate = (id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setClickedSection(id);
        onNavigate(id);
        timeoutRef.current = setTimeout(() => setClickedSection(null), 1500);
    };

    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

    const displayActiveSection = clickedSection !== null ? clickedSection : activeSection;

    return (
        <nav className="flex flex-col gap-1 mb-8 w-full max-w-[220px]">
            {sectionIds.map((id) => {
                const isActive = displayActiveSection === id;
                return (
                    <button
                        key={id}
                        onClick={() => handleNavigate(id)}
                        onMouseEnter={() => !isActive && setHoveredSection(id)}
                        onMouseLeave={() => setHoveredSection(null)}
                        className="flex items-center justify-center gap-3 py-2 px-1 transition-all duration-300 w-full"
                        style={{ background: 'transparent' }}
                    >
                        <span
                            className="transition-all duration-300"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: isActive ? 500 : 300,
                                fontSize: isActive ? '1rem' : '0.8125rem',
                                color: isActive ? 'var(--accent)' : hoveredSection === id ? 'var(--text-primary)' : 'var(--text-muted)',
                                letterSpacing: '0.04em',
                            }}
                        >
                            {labels[id] ?? id.charAt(0).toUpperCase() + id.slice(1)}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
