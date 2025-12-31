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

    // Check window size and update content information
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

    // Close menu when switching from mobile to desktop
    useEffect(() => {
        if (!isMobileView) {
            setIsMenuOpen(false);
        }
    }, [isMobileView]);

    const handleNavigationClick = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Determine the scaling factor needed
    const calculatedScaleFactor = () => {
        if (contentHeight > windowHeight && windowHeight > 0) {
            return isMobileView ? 1 : Math.min(0.95, windowHeight / contentHeight);
        }
        return 1;
    };

    const scaleFactor = calculatedScaleFactor();

    return (
        <>
            {/* Mobile Menu */}
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
                className={`relative flex flex-col items-center px-6 sm:px-12 pt-20 bg-transparent text-white text-center ${contentHeight > windowHeight ? 'h-auto pb-16' : 'min-h-screen'
                    }`}
                style={{
                    transform: `scale(${scaleFactor})`,
                    transformOrigin: 'top center',
                    marginBottom: scaleFactor < 1 ? `${(1 - scaleFactor) * -100}vh` : '0',
                    paddingTop: isMobileView ? '64px' : '80px'
                }}
            >
                {/* Profile Image - Larger */}
                <img
                    src="/profile.jpeg"
                    alt="Profile"
                    className="w-44 h-44 mb-6 rounded-full border-2 border-indigo-500 shadow-md"
                />

                {/* Name */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Justin Smith</h1>

                {/* Static Role */}
                <p className="text-indigo-400 text-xl md:text-2xl font-mono mb-6">
                    Software Engineer & Backend Developer
                </p>

                {/* Description - More spacing above */}
                <p className="text-gray-400 max-w-lg mb-6 mt-4">
                    I build efficient, scalable systems and am interested in low-level programming and optimizing performance.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="bg-indigo-600 text-gray-300 hover:bg-indigo-700 hover:text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-600/20 transform hover:-translate-y-0.5"
                    >
                        View Resume
                    </a>
                    <button
                        onClick={onContactClick}
                        className="border-2 border-indigo-500 text-gray-300 hover:bg-indigo-500 hover:text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5"
                    >
                        Contact Me
                    </button>
                </div>

                {/* Desktop Navigation Links - Centered in remaining space */}
                {!isMobileView && (
                    <div className="flex-1 flex items-center justify-center">
                        <NavigationLinks
                            sectionIds={sectionIds}
                            activeSection={activeSection}
                            onNavigate={handleNavigationClick}
                        />
                    </div>
                )}

                {/* Social Icons */}
                <div className="w-full flex justify-center gap-6 py-4 bg-transparent mt-auto">
                    <a href="https://github.com/justnsmith" target="_blank" className="bg-transparent group">
                        <FontAwesomeIcon
                            icon={faGithub}
                            className="w-8 h-8 text-gray-500 transition-all duration-300 transform group-hover:text-white group-hover:scale-125"
                        />
                    </a>
                    <a href="https://linkedin.com/in/justnsmith" target="_blank" className="bg-transparent group">
                        <FontAwesomeIcon
                            icon={faLinkedin}
                            className="w-8 h-8 text-gray-500 transition-all duration-300 transform group-hover:text-white group-hover:scale-125"
                        />
                    </a>
                    <a href="mailto:justnwsmith@gmail.com" className="bg-transparent group">
                        <FontAwesomeIcon
                            icon={faGoogle}
                            className="w-8 h-8 text-gray-500 transition-all duration-300 transform group-hover:text-white group-hover:scale-125"
                        />
                    </a>
                </div>
            </section>
        </>
    );
}
