import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { MobileMenuProps } from '../../types';

export default function MobileMenu({
    isOpen,
    setIsOpen,
    activeSection,
    sectionIds,
    onNavigate
}: MobileMenuProps) {

    // Close menu when clicking outside
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
        <div className="fixed top-0 right-0 z-50 menu-container p-4 w-full flex justify-end bg-transparent">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="text-gray-300 hover:text-white transition-colors duration-300"
            >
                <FontAwesomeIcon
                    icon={isOpen ? faTimes : faBars}
                    className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>

            {/* Dropdown Menu with Animation */}
            <div
                className={`absolute right-4 top-14 mt-2 w-48 bg-gray-800 border border-indigo-500 rounded-md shadow-lg shadow-indigo-500/20 overflow-hidden transition-all duration-300 origin-top-right ${
                    isOpen
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="py-2">
                    {sectionIds.map((id, index) => (
                        <button
                            key={id}
                            onClick={() => handleNavClick(id)}
                            className={`block w-full text-left px-4 py-2 text-sm transition-all duration-300 hover:bg-gray-700 ${
                                activeSection === id
                                    ? "text-indigo-400 border-l-2 border-indigo-500 pl-3"
                                    : "text-gray-300 hover:text-white"
                            }`}
                            style={{
                                transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                            }}
                        >
                            {id.charAt(0).toUpperCase() + id.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
