import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
import MobileMenu from "@ui/MobileMenu";
import NavigationLinks from "@ui/NavigationLinks";
import { useActiveSection } from "@hooks";
import { HeroProps } from "@types";

const sectionIds = ["about", "tech", "experience", "projects"];

interface HeroPropsExtended extends HeroProps {
    onContactClick: () => void;
}

export default function Hero({ isMobileView, onContactClick }: HeroPropsExtended) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const activeSection = useActiveSection(sectionIds);

    useEffect(() => {
        const updateSizes = () => {
            setWindowHeight(window.innerHeight);
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                setContentHeight(heroSection.scrollHeight);
            }
        };
        updateSizes();
        window.addEventListener('resize', updateSizes);
        return () => window.removeEventListener('resize', updateSizes);
    }, []);

    useEffect(() => {
        if (!isMobileView) setIsMenuOpen(false);
    }, [isMobileView]);

    const handleNavigationClick = (id: string) => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    const calculatedScaleFactor = () => {
        if (contentHeight > windowHeight && windowHeight > 0) {
            return isMobileView ? 1 : Math.min(0.95, windowHeight / contentHeight);
        }
        return 1;
    };

    const scaleFactor = calculatedScaleFactor();

    return (
        <>
            {isMobileView && (
                <MobileMenu
                    isOpen={isMenuOpen}
                    setIsOpen={setIsMenuOpen}
                    activeSection={activeSection}
                    sectionIds={sectionIds}
                    onNavigate={handleNavigationClick}
                />
            )}

            <section
                id="hero-section"
                className="relative flex flex-col items-center px-8 sm:px-14 bg-transparent text-white text-center min-h-screen"
                style={{
                    transform: `scale(${scaleFactor})`,
                    transformOrigin: 'top center',
                    marginBottom: scaleFactor < 1 ? `${(1 - scaleFactor) * -100}vh` : '0',
                    paddingTop: isMobileView ? '64px' : '0',
                    justifyContent: isMobileView ? 'flex-start' : 'center',
                }}
            >
                {/* Profile Image */}
                <div className="relative mb-8">
                    <div
                        className="absolute inset-0 rounded-full blur-xl opacity-30"
                        style={{ background: 'radial-gradient(circle, var(--accent), var(--accent-indigo))', transform: 'scale(1.3)' }}
                    />
                    <img
                        src="/profile.jpeg"
                        alt="Profile"
                        className="relative w-44 h-44 rounded-full object-cover"
                        style={{
                            border: '1.5px solid rgba(34, 211, 238, 0.35)',
                            boxShadow: '0 0 0 4px rgba(34, 211, 238, 0.06), 0 8px 32px rgba(0,0,0,0.5)'
                        }}
                    />
                </div>

                {/* Status badge */}
                <div
                    className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs"
                    style={{
                        background: 'rgba(34, 211, 238, 0.07)',
                        border: '1px solid rgba(34, 211, 238, 0.2)',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent)',
                        letterSpacing: '0.08em'
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for opportunities
                </div>

                {/* Name */}
                <h1
                    className="leading-none mb-3 tracking-tight"
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    Justin Smith
                </h1>

                {/* Role */}
                <p
                    className="mb-6"
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--accent)',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase'
                    }}
                >
                    Software Engineer / Backend & Systems
                </p>

                {/* Description */}
                <p
                    className="max-w-sm mb-8"
                    style={{
                        fontSize: '0.925rem',
                        lineHeight: '1.75',
                        color: 'var(--text-secondary)'
                    }}
                >
                    I build efficient, scalable systems — focused on low-level programming and performance-critical infrastructure.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="group relative overflow-hidden font-medium py-2.5 px-7 rounded-lg text-sm transition-all duration-200"
                        style={{
                            background: 'var(--accent)',
                            color: '#0d1117',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            letterSpacing: '0.01em',
                            boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)'
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(34, 211, 238, 0.35)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.2)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        }}
                    >
                        View Resume
                    </a>
                    <button
                        onClick={onContactClick}
                        className="font-medium py-2.5 px-7 rounded-lg text-sm transition-all duration-200"
                        style={{
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 500,
                            letterSpacing: '0.01em'
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34, 211, 238, 0.4)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        }}
                    >
                        Contact Me
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                {!isMobileView && (
                    <div className="mt-8 w-full flex justify-center">
                        <NavigationLinks
                            sectionIds={sectionIds}
                            activeSection={activeSection}
                            onNavigate={handleNavigationClick}
                        />
                    </div>
                )}

                {/* Social Icons */}
                <div className="w-full flex justify-center gap-5 py-4 mt-6">
                    {[
                        { href: "https://github.com/justnsmith", icon: faGithub, label: "GitHub" },
                        { href: "https://linkedin.com/in/justnsmith", icon: faLinkedin, label: "LinkedIn" },
                        { href: "mailto:justnwsmith@gmail.com", icon: faGoogle, label: "Email" },
                    ].map(({ href, icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith('http') ? "_blank" : undefined}
                            aria-label={label}
                            className="group flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                            style={{
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)'
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                                (e.currentTarget as HTMLElement).style.background = 'var(--accent-soft)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                            }}
                        >
                            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
                        </a>
                    ))}
                </div>
            </section>
        </>
    );
}
