import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { MobileMenuProps } from '../../types';

const labels: Record<string, string> = {
    about: 'About',
    tech: 'Tech Stack',
    experience: 'Experience',
    projects: 'Projects',
};

export default function MobileMenu({
    isOpen,
    setIsOpen,
    activeSection,
    sectionIds,
    onNavigate
}: MobileMenuProps) {

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target;
            if (isOpen && target instanceof HTMLElement && !target.closest('.menu-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, setIsOpen]);

    const handleNavClick = (id: string) => {
        onNavigate(id);
        setIsOpen(false);
    };

    return (
        <div className="fixed top-0 right-0 z-50 menu-container p-4 w-full flex justify-end">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)'
                }}
            >
                <FontAwesomeIcon
                    icon={isOpen ? faTimes : faBars}
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>

            <div
                className="absolute right-4 top-14 mt-1 w-52 overflow-hidden transition-all duration-250 origin-top-right"
                style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-6px)',
                    pointerEvents: isOpen ? 'all' : 'none',
                }}
            >
                <div className="py-1.5">
                    {sectionIds.map((id, index) => {
                        const isActive = activeSection === id;
                        return (
                            <button
                                key={id}
                                onClick={() => handleNavClick(id)}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-all duration-150"
                                style={{
                                    transitionDelay: isOpen ? `${index * 30}ms` : '0ms',
                                    background: isActive ? 'rgba(34, 211, 238, 0.06)' : 'transparent',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                                }}
                            >
                                <span
                                    className="text-xs"
                                    style={{ fontFamily: 'var(--font-mono)', color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: isActive ? 500 : 400 }}>
                                    {labels[id] ?? id.charAt(0).toUpperCase() + id.slice(1)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
