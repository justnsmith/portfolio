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
            {sectionIds.map((id, index) => {
                const isActive = displayActiveSection === id;
                return (
                    <button
                        key={id}
                        onClick={() => handleNavigate(id)}
                        className="group flex items-center gap-4 py-2.5 px-1 rounded-lg text-left transition-all duration-250 w-full"
                        style={{
                            background: isActive ? 'rgba(34, 211, 238, 0.05)' : 'transparent',
                        }}
                    >
                        {/* Number */}
                        <span
                            className="text-xs shrink-0 transition-all duration-250"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Indicator bar */}
                        <span
                            className="h-px shrink-0 transition-all duration-300"
                            style={{
                                width: isActive ? '24px' : '12px',
                                background: isActive ? 'var(--accent)' : 'var(--text-muted)',
                                opacity: isActive ? 1 : 0.5
                            }}
                        />

                        {/* Label */}
                        <span
                            className="text-sm transition-all duration-250"
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontWeight: isActive ? 500 : 400,
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                letterSpacing: isActive ? '0.03em' : '0',
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
