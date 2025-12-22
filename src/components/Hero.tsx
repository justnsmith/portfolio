"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faBars, faTimes, faPaperPlane, faSpinner, faCheck } from "@fortawesome/free-solid-svg-icons";

const words = ["Software Engineer", "Backend Developer"];
const sectionIds = ["about", "tech", "experience", "projects"];

interface HeroProps {
    isContactModalOpen: boolean;
    setIsContactModalOpen: (isOpen: boolean) => void;
}

export default function Hero({ isContactModalOpen, setIsContactModalOpen }: HeroProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeSection, setActiveSection] = useState("about");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [contactAnimation, setContactAnimation] = useState("");
    const [contentHeight, setContentHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [formStatus, setFormStatus] = useState({
        submitting: false,
        success: false,
        error: false,
        message: ""
    });

    // Focus states for form fields
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form field focus
    const handleFieldFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    // Handle form field blur
    const handleFieldBlur = () => {
        setFocusedField(null);
    };

    // Handle contact button click with animation
    const handleContactClick = () => {
        setContactAnimation("pulse");
        setTimeout(() => {
            setIsContactModalOpen(true);
            setContactAnimation("");
        }, 300);
    };

    // Close the modal
    const closeModal = () => {
        setIsContactModalOpen(false);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setFormStatus({
                submitting: false,
                success: false,
                error: true,
                message: "Please fill out all fields"
            });
            return;
        }

        try {
            setFormStatus({
                submitting: true,
                success: false,
                error: false,
                message: "Sending message..."
            });

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: `New contact from ${formData.name} via portfolio`
                })
            });

            const result = await response.json();

            if (result.success) {
                setFormStatus({
                    submitting: false,
                    success: true,
                    error: false,
                    message: "Message sent successfully!"
                });

                // Reset form data
                setFormData({
                    name: "",
                    email: "",
                    message: ""
                });

                // Close modal after a delay
                setTimeout(() => {
                    setIsContactModalOpen(false);
                    setFormStatus({
                        submitting: false,
                        success: false,
                        error: false,
                        message: ""
                    });
                }, 3000);
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            setFormStatus({
                submitting: false,
                success: false,
                error: true,
                message: `Failed to send message. Please try again later. ${error}`
            });
        }
    };

    // Check window size and update content information
    useEffect(() => {
        const updateSizes = () => {
            setIsMobileView(window.innerWidth < 1024);
            setWindowHeight(window.innerHeight);

            // Get the actual height of the content
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                setContentHeight(heroSection.scrollHeight);
            }
        };

        // Initial check
        updateSizes();

        // Add event listener for window resize
        window.addEventListener('resize', updateSizes);

        // Cleanup
        return () => window.removeEventListener('resize', updateSizes);
    }, []);

    // Close menu when switching from mobile to desktop
    useEffect(() => {
        if (!isMobileView) {
            setIsMenuOpen(false);
        }
    }, [isMobileView]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target;
            if (isMenuOpen && target instanceof HTMLElement && !target.closest('.menu-container')) {
                setIsMenuOpen(false);
            }

            // For the contact modal
            if (isContactModalOpen && target instanceof HTMLElement && target.id === "contact-modal-backdrop") {
                setIsContactModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen, isContactModalOpen, setIsContactModalOpen]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isContactModalOpen) {
                setIsContactModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isContactModalOpen, setIsContactModalOpen]);

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

    useEffect(() => {
        // Keep track of intersection ratios for each section
        const sectionIntersections: Record<string, number> = {};

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Store the intersection ratio for each section
                    sectionIntersections[entry.target.id] = entry.intersectionRatio;

                    // Find the section with the highest intersection ratio
                    let maxRatio = 0;
                    let currentSection = "";

                    Object.keys(sectionIntersections).forEach((id) => {
                        if (sectionIntersections[id] > maxRatio) {
                            maxRatio = sectionIntersections[id];
                            currentSection = id;
                        }
                    });

                    // Only update if we have a meaningful intersection
                    if (maxRatio > 0 && currentSection) {
                        setActiveSection(currentSection);
                    }
                });
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                rootMargin: "-10% 0px -70% 0px"
            }
        );

        sectionIds.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const handleNavigationClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            setIsMenuOpen(false);
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
            {/* Fixed Burger Menu*/}
            {isMobileView && (
                <div className="fixed top-0 right-0 z-50 menu-container p-4 w-full flex justify-end bg-transparent">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                        <FontAwesomeIcon
                            icon={isMenuOpen ? faTimes : faBars}
                            className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu with Animation */}
                    <div
                        className={`absolute right-4 top-14 mt-2 w-48 bg-gray-800 border border-indigo-500 rounded-md shadow-lg shadow-indigo-500/20 overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen
                            ? 'opacity-100 scale-100 translate-y-0'
                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                            }`}
                    >
                        <div className="py-2">
                            {sectionIds.map((id, index) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    onClick={(e) => handleNavigationClick(id, e)}
                                    className={`block px-4 py-2 text-sm transition-all duration-300 hover:bg-gray-700 ${activeSection === id
                                        ? "text-indigo-400 border-l-2 border-indigo-500 pl-3"
                                        : "text-gray-300 hover:text-white"
                                        }`}
                                    style={{
                                        transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms'
                                    }}
                                >
                                    {id.charAt(0).toUpperCase() + id.slice(1)}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
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
                        className={`border-2 border-indigo-500 text-gray-300 hover:bg-indigo-500 hover:text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 ${contactAnimation ? `animate-${contactAnimation}` : ""}`}
                    >
                        Contact Me
                    </button>
                </div>

                {/* Selection Indicator */}
                {!isMobileView && (
                    <div className="flex flex-col gap-8 mb-8">
                        {sectionIds.map((id) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                onClick={(e) => handleNavigationClick(id, e)}
                                className={`relative text-sm font-medium transition-all duration-300 hover:text-white group ${activeSection === id
                                    ? "text-white scale-110"
                                    : "text-gray-400"
                                    }`}
                            >
                                {id.charAt(0).toUpperCase() + id.slice(1)}
                                <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-indigo-500 transform origin-left transition-transform duration-300 ${activeSection === id ? 'scale-x-100' : 'scale-x-0'
                                    } group-hover:scale-x-100`}></span>
                            </a>
                        ))}
                    </div>
                )}

                {/* Social Icons */}
                <div className={`${isMobileView ? 'w-full flex justify-center gap-6 py-4 bg-transparent mt-auto' : 'w-full flex justify-center gap-6 py-4 bg-transparent mt-auto'}`}>
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
            {isContactModalOpen && (
                <div
                    id="contact-modal-backdrop"
                    className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 px-4"
                    style={{ backdropFilter: "blur(20px)" }}
                >
                    <div
                        className="bg-gray-800 border border-indigo-500 rounded-xl w-full max-w-md overflow-hidden transform transition-all duration-500 ease-out"
                        style={{
                            boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
                            animation: "modalEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                        }}
                    >
                        {/* Modal Header */}
                        <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Contact Me</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Form content */}
                            {formStatus.success ? (
                                <div className="flex flex-col items-center justify-center py-6 animate-fadeIn">
                                    <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                                        <FontAwesomeIcon icon={faCheck} className="text-green-400 w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
                                    <p className="text-green-300 text-center">{formStatus.message}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="relative">
                                        <label
                                            htmlFor="name"
                                            className={`absolute left-3 transition-all duration-200 ${focusedField === 'name' || formData.name
                                                ? '-top-2 text-xs text-indigo-400 bg-gray-800 px-1 z-10'
                                                : 'top-2 text-gray-400'
                                                }`}
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFieldFocus('name')}
                                            onBlur={handleFieldBlur}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label
                                            htmlFor="email"
                                            className={`absolute left-3 transition-all duration-200 ${focusedField === 'email' || formData.email
                                                ? '-top-2 text-xs text-indigo-400 bg-gray-800 px-1 z-10'
                                                : 'top-2 text-gray-400'
                                                }`}
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFieldFocus('email')}
                                            onBlur={handleFieldBlur}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label
                                            htmlFor="message"
                                            className={`absolute left-3 transition-all duration-200 ${focusedField === 'message' || formData.message
                                                ? '-top-2 text-xs text-indigo-400 bg-gray-800 px-1 z-10'
                                                : 'top-2 text-gray-400'
                                                }`}
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFieldFocus('message')}
                                            onBlur={handleFieldBlur}
                                            rows={4}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            required
                                        ></textarea>
                                    </div>

                                    {formStatus.error && (
                                        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 animate-fadeIn">
                                            <p className="text-red-400 text-sm">{formStatus.message}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={formStatus.submitting}
                                        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center ${formStatus.submitting ? "opacity-80 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {formStatus.submitting ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animation for Modal and Effects */}
            <style>{`
                @keyframes modalEntrance {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-in forwards;
                }

                .animate-pulse {
                    animation: pulse 0.3s ease-in-out;
                }
            `}</style>
        </>
    );
}
