import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
import MobileMenu from "@ui/MobileMenu";
import NavigationLinks from "@ui/NavigationLinks";
import ContactModal from "@ui/ContactModal";
import { useActiveSection } from "@hooks";
import { HeroProps } from "@types";

const words = ["Software Engineer", "Backend Developer"];
const sectionIds = ["about", "tech", "experience", "projects"];

export default function Hero({ isMobileView }: HeroProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactAnimation, setContactAnimation] = useState("");
    const [contentHeight, setContentHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const activeSection = useActiveSection(sectionIds);

    // Typing animation effect
    useEffect(() => {
        const currentWord = words[currentWordIndex];
        const speed = isDeleting ? 50 : 100;

        const timeout = setTimeout(() => {
            setDisplayText((prev) =>
                isDeleting
                    ? currentWord.substring(0, prev.length - 1)
                    : currentWord.substring(0, prev.length + 1)
            );

            if (!isDeleting && displayText === currentWord) {
                setTimeout(() => setIsDeleting(true), 1200);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
        }, speed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentWordIndex]);

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

    const handleContactClick = () => {
        setContactAnimation("pulse");
        setTimeout(() => {
            setIsContactModalOpen(true);
            setContactAnimation("");
        }, 300);
    };

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
                {/* Profile Image */}
                <img
                    src="/profile.jpeg"
                    alt="Profile"
                    className="w-36 h-36 mb-6 rounded-full border-2 border-indigo-500 shadow-md"
                />

                {/* Name */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Justin Smith</h1>

                {/* Animated Role */}
                <p className="text-indigo-400 text-xl md:text-2xl font-mono mb-6 h-12">
                    {displayText}
                    <span className="animate-pulse">|</span>
                </p>

                {/* Description */}
                <p className="text-gray-400 max-w-lg mb-6">
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
                        onClick={handleContactClick}
                        className={`border-2 border-indigo-500 text-gray-300 hover:bg-indigo-500 hover:text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 ${contactAnimation ? `animate-${contactAnimation}` : ""
                            }`}
                    >
                        Contact Me
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                {!isMobileView && (
                    <NavigationLinks
                        sectionIds={sectionIds}
                        activeSection={activeSection}
                        onNavigate={handleNavigationClick}
                    />
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

            {/* Contact Form Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />

            {/* CSS Animation for Pulse Effect */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                .animate-pulse {
                    animation: pulse 0.3s ease-in-out;
                }
            `}</style>
        </>
    );
}
